import useCounterAnimation from '../../hooks/useCounterAnimation'

/**
 * Stat counter that counts up once on scroll-into-view (build brief §3.5, §6.5).
 * Driven entirely by useCounterAnimation (IntersectionObserver + rAF easing).
 *
 * Usage: <AnimatedCounter target={500} suffix="+" label="Events Completed" />
 */
function AnimatedCounter({ target, suffix = '', prefix = '', label, duration = 1800 }) {
  const [ref, value] = useCounterAnimation(target, duration)

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl md:text-5xl font-extrabold gold-text-gradient tabular-nums">
        {prefix}
        {value.toLocaleString()}
        {suffix}
      </p>
      {label && <p className="mt-2 text-sm md:text-base text-mist">{label}</p>}
    </div>
  )
}

export default AnimatedCounter
