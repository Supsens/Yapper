import React, { useState } from "react";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-4 right-4 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded-full shadow-lg"
    >
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default DarkModeToggle;
