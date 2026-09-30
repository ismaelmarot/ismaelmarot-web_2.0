/**
 * CSS Animation utilities
 * These are CSS class names that correspond to keyframes defined in globals.css
 * The actual keyframes are in globals.css for better performance
 */

// Keyframe names (defined in globals.css)
export const keyframes = {
  fadeInUp: 'fadeInUp',
  fadeIn: 'fadeIn',
  slideInLeft: 'slideInLeft',
  slideInRight: 'slideInRight',
  scaleIn: 'scaleIn',
} as const;

// Animation class names for different variants
export const animationClasses = {
  fadeInUp: 'animate-fade-in-up',
  staggerContainer: 'animate-stagger-container',
  staggerItem: (index: number): string => `animate-stagger-item stagger-${index}`,
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  scaleIn: 'animate-scale-in',
} as const;

/**
 * Returns the animation class if reduced motion is not preferred,
 * otherwise returns an empty string.
 * Usage: className={getAnimationClass(animationClasses.fadeInUp, prefersReducedMotion)}
 */
export function getAnimationClass(
  className: string,
  prefersReducedMotion = false
): string {
  if (prefersReducedMotion) return '';
  return className;
}

export interface ScrollAnimationOptions {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

// Default scroll animation options
export const defaultScrollAnimationOptions: ScrollAnimationOptions = {
  rootMargin: '0px 0px -10% 0px',
  threshold: 0.1,
  triggerOnce: true,
};