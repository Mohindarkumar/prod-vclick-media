import AnimatedCounter from '../../components/common/AnimatedCounter'

/**
 * Thin wrapper around AnimatedCounter for the Why Choose Us stat row
 * (build brief §6.5). Kept as its own module per the §4 folder spec so
 * the section composition stays declarative.
 */
function StatBlock({ target, suffix, label }) {
  return <AnimatedCounter target={target} suffix={suffix} label={label} />
}

export default StatBlock
