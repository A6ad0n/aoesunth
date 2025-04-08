import { useState, useEffect } from 'react';
import { FavouriteList } from "./FavouriteList"
import { useDataHandler } from "./DataHandlerContext";

interface FavouriteDashboardProps {
  headText?:      string;
  buttonText?:    string;
  listStyle?:     string;
  headTextStyle?: string;
  buttonStyle?:   string;
}

export const FavouriteDashboard = ({ headText, buttonText, listStyle, headTextStyle, buttonStyle }: FavouriteDashboardProps) => {
  const { data, updateAction } = useDataHandler();
  const [updateFlag, setUpdateFlag] = useState<boolean>(true);
  
  useEffect(() => {
    setUpdateFlag(!updateFlag); //Start updating our list
  }, []);

  const listClassName = listStyle ?? 
    `mt-3 h-full w-full text-white border-separate border-spacing-y-3
    bg-gradient-to-r from-purple-600 to-blue-700 rounded-xl px-5`
  const headTextClassName = headTextStyle ??
    `text-2xl font-bold mb-2`;
  const buttonClassName = buttonStyle ?? 
    `text-lg font-semi-bold pt-1 pb-1 pl-4 pr-4 bg-amber-300
    rounded-lg hover:bg-amber-300/80 transition-colors ease-in-out`;
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
    </div>
  )
}
