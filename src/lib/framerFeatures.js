import { domMax } from 'framer-motion'

// domMax (not the smaller domAnimation) because layout animations are used
// (PortfolioGrid's masonry re-flow). Exported as its own module so
// LazyMotion can dynamically import() it as a separate chunk, deferring this
// weight out of the critical initial bundle instead of loading it synchronously.
export default domMax
