import { useState, useEffect } from 'react';
import { FavouriteList } from "./FavouriteList"
import { useDataHandler } from "../../context/DataHandlerContext/DataHandlerContext";
import { useThemeContext } from '../../context/ThemeContext/ThemeContext';
import ThemeSwitcher from '../ThemeSwitcher';

interface FavouriteDashboardProps {
  headText?:      string;
  buttonText?:    string;
  listStyle?:     string;
  headTextStyle?: string;
  buttonStyle?:   string;
}

export const FavouriteDashboard = ({ headText, buttonText, listStyle, headTextStyle, buttonStyle }: FavouriteDashboardProps) => {
  const { data }  = useDataHandler();
  const { theme } = useThemeContext();
  const [updateFlag, setUpdateFlag] = useState<boolean>(true);
  
  useEffect(() => {
    setUpdateFlag(!updateFlag); //Start updating our list
  }, []);

  const listBase = `mt-3 h-full w-full border-separate border-spacing-y-3 rounded-xl px-5 transition-colors ease-in-out duration-300`;
  const headBase = `text-2xl font-bold mb-2`;
  const buttonBase = `text-lg font-semibold pt-1 pb-1 pl-4 pr-4 rounded-lg transition-colors ease-in-out duration-300`;
  const listClassName = listStyle ?? (
    `${listBase} ${theme === 'dark'
      ? 'text-white bg-gradient-to-r from-purple-600 to-blue-700'
      : 'text-gray-900 bg-gradient-to-r from-yellow-100 to-pink-200'}`
  );
  const headTextClassName = headTextStyle ?? (
    `${headBase} ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`
  );
  const buttonClassName = buttonStyle ?? (
    `${buttonBase} ${theme === 'dark'
      ? 'bg-amber-300 hover:bg-amber-300/80 text-black'
      : 'bg-blue-500 hover:bg-blue-400 text-white'}`
  );

  return (
    <div className="prevent-select p-6">
      <div className="flex flex-row justify-between align-middle">
        <h2 className={headTextClassName}>{headText ?? "FavouriteList"}</h2>
        <button 
          className={buttonClassName}
          onClick={() => setUpdateFlag(!updateFlag)}
        >
          {buttonText ?? "Update all"}
        </button>
      </div>
      {data.length > 0 ? (
        <FavouriteList updateFlag={updateFlag} tableStyle={listClassName} />
      ) : (
        <div className={`${listClassName} p-17 flex items-center justify-center`}>
          <span className="text-lg font-semibold">No data available</span>
        </div>
      )}

      <div className="fixed top-2 right-2">
        <ThemeSwitcher />
      </div>
    </div>
  )
}
