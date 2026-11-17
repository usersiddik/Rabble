import { domAnimation } from "framer-motion";

/**
 * Framer Motion's animation + gesture features, loaded after hydration by
 * <LazyMotion features={loadMotionFeatures}>. Keeps the hero's first-load JS
 * small; components use `m.*` (not `motion.*`) and render their final state
 * from the server until this arrives.
 */
export default domAnimation;
