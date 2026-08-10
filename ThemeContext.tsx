import React, { createContext, useState, useContext } from 'react';

// تعریف ساختار داده‌های تم
type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

// ایجاد Context
const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

// کامپوننت Provider برای در برگرفتن کل اپلیکیشن
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// هوک سفارشی برای استفاده راحت در صفحات
export const useTheme = () => useContext(ThemeContext);
