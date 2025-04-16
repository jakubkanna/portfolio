export const applyDarkMode = (isDark: boolean) => {
  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );
};
