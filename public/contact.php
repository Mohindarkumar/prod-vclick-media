<?php
declare(strict_types=1);

// Always respond with JSON — must be first so fatal errors also get the header.
header('Content-Type: application/json; charset=utf-8');

// Catch PHP fatal errors (e.g. missing vendor/) and return JSON instead of HTML.
register_shutdown_function(function (): void {
    $err = error_get_last();
    if ($err && in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        if (!headers_sent()) {
            http_response_code(500);
        }
        echo json_encode(['success' => false, 'message' => 'Server error. Please try again or contact us via WhatsApp.']);
    }
});

// ── Load config from outside the web root ────────────────────────────────────
$configFile = dirname(__DIR__) . '/config.php';

if (!file_exists($configFile)) {
    http_response_code(500);
    exit(json_encode(['success' => false, 'message' => 'Server configuration missing. Please contact support.']));
}

require_once $configFile;

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'message' => 'Method not allowed']));
}

// ── Honeypot — silently drop bots ─────────────────────────────────────────────
if (!empty($_POST['_hp'])) {
    exit(json_encode(['success' => true]));
}

// ── Cloudflare Turnstile server-side verification ─────────────────────────────
// Only enforced when TURNSTILE_SECRET is defined and non-empty in config.php.
if (defined('TURNSTILE_SECRET') && TURNSTILE_SECRET !== '') {
    $token = trim($_POST['cf-turnstile-response'] ?? '');

    if ($token === '') {
        http_response_code(400);
        exit(json_encode(['success' => false, 'message' => 'Security check failed. Please complete the verification and try again.']));
    }

    $verifyData = http_build_query([
        'secret'   => TURNSTILE_SECRET,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
    ]);

    $ctx = stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => 'Content-Type: application/x-www-form-urlencoded',
            'content' => $verifyData,
            'timeout' => 5,
        ],
    ]);

    $result = @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $ctx);
    $outcome = $result ? json_decode($result, true) : null;

    if (!$outcome || !($outcome['success'] ?? false)) {
        http_response_code(403);
        exit(json_encode(['success' => false, 'message' => 'Security verification failed. Please try again.']));
    }
}

// ── Read + validate inputs ────────────────────────────────────────────────────
$name    = trim($_POST['name']    ?? '');
$email   = trim($_POST['email']   ?? '');
$phone   = trim($_POST['phone']   ?? '');
$message = trim($_POST['message'] ?? '');

$errors = [];
if ($name === '')                                                     $errors[] = 'Name is required.';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL))     $errors[] = 'A valid email is required.';
if ($phone === '')                                                    $errors[] = 'Phone is required.';
if ($message === '')                                                  $errors[] = 'Message is required.';

if ($errors) {
    http_response_code(422);
    exit(json_encode(['success' => false, 'message' => implode(' ', $errors)]));
}

// ── HTML escape helper ────────────────────────────────────────────────────────
function esc(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

// ── Full responsive email wrapper ─────────────────────────────────────────────
function buildEmail(string $header, string $body, string $footer): string
{
    return '<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>VClick Media &amp; Events</title>
<style>
  body  { margin:0; padding:0; background:#111111; font-family:Arial,Helvetica,sans-serif; -webkit-text-size-adjust:100%; }
  table { border-collapse:collapse; mso-table-lspace:0; mso-table-rspace:0; }
  img   { border:0; display:block; max-width:100%; }
  .wrap { max-width:600px; margin:40px auto; background:#111111; border:1px solid #222222; border-radius:12px; overflow:hidden; }
  .pad  { padding:32px 40px; }
  .btn  { display:inline-block; background:#D4AF37; color:#000000 !important; padding:14px 36px;
          border-radius:8px; text-decoration:none; font-weight:700; font-size:15px;
          font-family:Arial,Helvetica,sans-serif; white-space:nowrap; }
  @media only screen and (max-width:620px) {
    .wrap { margin:0 !important; border-radius:0 !important; width:100% !important; }
    .pad  { padding:24px 20px !important; }
    .btn  { display:block !important; padding:15px 20px !important; text-align:center !important; }
  }
</style>
</head>
<body>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
  <tr>
    <td>
      <div class="wrap">
        ' . $header . '
        <div class="pad">' . $body . '</div>
        ' . $footer . '
      </div>
    </td>
  </tr>
</table>
</body>
</html>';
}

// ── Shared logo header builder ────────────────────────────────────────────────
function logoHeader(string $subline = ''): string
{
    $sub = $subline
        ? '<p style="margin:8px 0 0;color:#aaaaaa;font-size:12px;font-family:Arial,sans-serif;">' . $subline . '</p>'
        : '';

    // Use logo image when SITE_URL is configured; fall back to site-name text
    if (defined('SITE_URL') && SITE_URL !== '') {
        $logoUrl = SITE_URL . '/uploads/images/logos/logo.png';
        $brand = '<img src="' . $logoUrl . '" alt="' . (defined('SITE_NAME') ? htmlspecialchars(SITE_NAME, ENT_QUOTES | ENT_HTML5, 'UTF-8') : 'VClick Media &amp; Events') . '" width="160" style="height:auto;max-width:160px;display:inline-block;" />';
    } else {
        $siteName = defined('SITE_NAME') ? htmlspecialchars(SITE_NAME, ENT_QUOTES | ENT_HTML5, 'UTF-8') : 'VClick Media &amp; Events';
        $brand = '<h1 style="margin:0;color:#D4AF37;font-size:22px;font-weight:800;font-family:Arial,sans-serif;letter-spacing:0.02em;">' . $siteName . '</h1>';
    }

    return '<div style="background:#0b0b0b;padding:28px 40px;text-align:center;border-bottom:2px solid #D4AF37;">'
        . $brand
        . $sub
        . '</div>';
}

$year        = date('Y');
$safeName    = esc($name);
$safeEmail   = esc($email);
$safePhone   = esc($phone);
$safeMessage = nl2br(esc($message));

// ── Template 1 — Owner notification ──────────────────────────────────────────
$ownerHeader = logoHeader('New Enquiry Notification');

$ownerBody = '<h2 style="margin:0 0 16px;color:#D4AF37;font-size:18px;font-family:Arial,sans-serif;">New Lead Received!</h2>'
    . '<p style="color:#cccccc;font-size:14px;line-height:1.6;margin:0 0 20px;font-family:Arial,sans-serif;">A visitor submitted the contact form. Details below.</p>'
    . '<table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #222222;">'
    . '<tr><td style="padding:12px 0;color:#888888;font-size:13px;width:90px;vertical-align:top;border-bottom:1px solid #222222;font-family:Arial,sans-serif;">Name</td>'
    .     '<td style="padding:12px 0 12px 12px;color:#f0f0f0;font-weight:700;font-size:14px;border-bottom:1px solid #222222;font-family:Arial,sans-serif;">' . $safeName . '</td></tr>'
    . '<tr><td style="padding:12px 0;color:#888888;font-size:13px;vertical-align:top;border-bottom:1px solid #222222;font-family:Arial,sans-serif;">Email</td>'
    .     '<td style="padding:12px 0 12px 12px;border-bottom:1px solid #222222;"><a href="mailto:' . $safeEmail . '" style="color:#D4AF37;font-size:14px;font-family:Arial,sans-serif;">' . $safeEmail . '</a></td></tr>'
    . '<tr><td style="padding:12px 0;color:#888888;font-size:13px;vertical-align:top;border-bottom:1px solid #222222;font-family:Arial,sans-serif;">Phone</td>'
    .     '<td style="padding:12px 0 12px 12px;color:#f0f0f0;font-size:14px;border-bottom:1px solid #222222;font-family:Arial,sans-serif;">' . $safePhone . '</td></tr>'
    . '<tr><td style="padding:12px 0;color:#888888;font-size:13px;vertical-align:top;font-family:Arial,sans-serif;">Message</td>'
    .     '<td style="padding:12px 0 12px 12px;color:#dddddd;font-size:14px;line-height:1.7;font-family:Arial,sans-serif;">' . $safeMessage . '</td></tr>'
    . '</table>'
    // ── Reply button — table-based for email-client compatibility ──────────
    . '<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">'
    . '<tr><td align="center">'
    . '<table cellpadding="0" cellspacing="0" border="0">'
    . '<tr><td style="border-radius:8px;background:#D4AF37;mso-padding-alt:0;">'
    . '<a href="mailto:' . $safeEmail . '" class="btn" style="display:inline-block;background:#D4AF37;color:#000000;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;font-family:Arial,Helvetica,sans-serif;white-space:nowrap;">Reply to ' . $safeName . '</a>'
    . '</td></tr></table>'
    . '</td></tr></table>';

$ownerFooter  = '<div style="padding:16px 40px;background:#0d0d0d;text-align:center;"><p style="color:#555555;font-size:11px;margin:0;font-family:Arial,sans-serif;">Sent automatically by VClick CMS &mdash; do not reply to this email</p></div>';
$ownerSubject = "New Lead from {$name} — VClick";

// ── Template 2 — User confirmation ───────────────────────────────────────────
$userHeader = logoHeader();

$userBody = '<h2 style="margin:0 0 12px;color:#D4AF37;font-size:20px;font-weight:700;font-family:Arial,sans-serif;">Thank You, ' . $safeName . '!</h2>'
    . '<p style="color:#cccccc;font-size:15px;line-height:1.7;margin:0 0 20px;font-family:Arial,sans-serif;">We have received your message and our team will reach out to you as soon as possible — usually within 24 hours.</p>'
    . '<div style="background:#1a1a1a;border:1px solid #D4AF37;border-radius:8px;padding:20px 24px;margin:0 0 8px;">'
    . '<p style="color:#D4AF37;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px;font-family:Arial,sans-serif;">What happens next?</p>'
    . '<table cellpadding="0" cellspacing="0" width="100%">'
    . '<tr><td style="padding:5px 0;color:#bbbbbb;font-size:14px;line-height:1.6;font-family:Arial,sans-serif;">&#10003;&nbsp; Our team reviews your enquiry</td></tr>'
    . '<tr><td style="padding:5px 0;color:#bbbbbb;font-size:14px;line-height:1.6;font-family:Arial,sans-serif;">&#10003;&nbsp; We reach out to schedule a consultation</td></tr>'
    . '<tr><td style="padding:5px 0;color:#bbbbbb;font-size:14px;line-height:1.6;font-family:Arial,sans-serif;">&#10003;&nbsp; We craft a tailored proposal for your event</td></tr>'
    . '</table>'
    . '</div>';

$userFooter  = '<div style="padding:20px 40px;background:#0d0d0d;text-align:center;"><p style="color:#888888;font-size:12px;margin:0;font-family:Arial,sans-serif;">&copy; ' . $year . ' VClick Media &amp; Events. All rights reserved.</p></div>';
$userSubject = 'We received your message — VClick Media & Events';

// ── PHPMailer ─────────────────────────────────────────────────────────────────
require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailException;

function sendMail(string $toEmail, string $toName, string $subject, string $htmlBody): void
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->Port       = SMTP_PORT;
    $mail->SMTPAuth   = true;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom(SMTP_USER, SITE_NAME);
    $mail->addAddress($toEmail, $toName);
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $htmlBody;

    $mail->send();
}

try {
    sendMail(OWNER_EMAIL, SITE_NAME, $ownerSubject, buildEmail($ownerHeader, $ownerBody, $ownerFooter));
    sendMail($email, $name, $userSubject, buildEmail($userHeader, $userBody, $userFooter));

    echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
} catch (MailException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not send your message. Please try again or contact us via WhatsApp.']);
}
