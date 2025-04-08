import React, { createContext, useContext, useState } from 'react';

interface MainThemeContextType {
	mainStyle: string;
};

const MainThemeContext = createContext<MainThemeContextType>({
	mainStyle: `mt-3 h-full w-full text-white border-separate border-spacing-y-3 
		bg-gradient-to-r from-purple-600 to-blue-700 rounded-xl px-5`
})

//*TODO do theme switcher
export const MainThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mainStyle, setMainStyle] = useState<string>(
    `mt-3 h-full w-full text-white border-separate border-spacing-y-3 
		bg-gradient-to-r from-purple-600 to-blue-700 rounded-xl px-5`
  );

  return (
    <MainThemeContext.Provider value={{ mainStyle }}>
      {children}
    </MainThemeContext.Provider>
  );
};

export const useMainTheme = () => useContext(MainThemeContext);
