export const toggleDarkMode = () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const isDark = currentTheme === "dark";
  const newTheme = isDark ? "light" : "dark";

  localStorage.setItem("dark_mode", JSON.stringify(!isDark));

  document.documentElement.setAttribute("data-theme", newTheme);
};
export const applyDarkMode = (isDark: boolean) => {
  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );
};
