/**
 * styled-components emits generated class names, never semantic ones like
 * `primary` or `sm`, and jsdom cannot expand shorthand properties whose value is
 * a CSS custom property (`padding: var(--space-3)`). This helper reads the
 * injected stylesheet so tests can assert on the real declarations.
 */
export function getCssForElement(element: Element): string {
  const classNames = Array.from(element.classList);

  return Array.from(document.styleSheets)
    .flatMap((sheet) => Array.from(sheet.cssRules).map((rule) => rule.cssText))
    .filter((ruleText) => classNames.some((className) => ruleText.includes(`.${className}`)))
    .join('\n');
}