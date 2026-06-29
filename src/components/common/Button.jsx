import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Shared button component.
 *
 * Primary / ghost variants have a magnetic attraction effect: the button
 * subtly follows the cursor while hovering, snapping back on mouse-leave
 * with spring physics. This replaces box-shadow hover effects.
 *
 * variant "primary" -> solid gold-to-amber gradient, no shadow
 * variant "ghost"   -> transparent with gold border, no shadow
 * variant "text"    -> inline link style, no magnetic effect
 */

const SPRING_CFG = { stiffness: 300, damping: 26, mass: 0.5 }
const MAGNETIC_STRENGTH = 0.22

function Button({
  children,
  variant = 'primary',
  as = 'button',
  href,
  icon: Icon,
  iconPosition = 'right',
  className = '',
  ...props
}) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, SPRING_CFG)
  const sy = useSpring(my, SPRING_CFG)

  const onMove = (e) => {
    if (variant === 'text') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left - r.width / 2) * MAGNETIC_STRENGTH)
    my.set((e.clientY - r.top - r.height / 2) * MAGNETIC_STRENGTH)
  }

  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const variantClass = {
    primary: 'bg-gold-sweep text-ink',
    ghost:   'bg-transparent text-paper border border-gold/60 hover:bg-gold/10 hover:border-gold',
    text:    'bg-transparent text-gold hover:text-amber px-0 py-0 gap-1.5',
  }

  const isMagnetic = variant !== 'text'
  const Component  = as === 'a' ? motion.a : as === 'button' ? motion.button : motion(as)
  const baseClasses =
    variant === 'text'
      ? 'inline-flex items-center font-medium text-sm transition-colors duration-300'
      : 'btn-base'

  return (
    <Component
      href={as === 'a' ? href : undefined}
      style={isMagnetic ? { x: sx, y: sy } : undefined}
      whileHover={isMagnetic ? { scale: 1.03 } : undefined}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`${baseClasses} ${variantClass[variant]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={18} strokeWidth={2.25} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={18} strokeWidth={2.25} />}
    </Component>
  )
}

export default Button
