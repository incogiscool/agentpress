import { useMDXComponents as getThemeComponents } from "nextra-theme-docs"; // nextra-theme-blog or your custom theme

// Get the default MDX components
const themeComponents = getThemeComponents();

// Merge components
// @ts-expect-error any
export function useMDXComponents(components) {
  return {
    ...themeComponents,
    ...components,
  };
}
