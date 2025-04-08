import { useEffect, useState, useRef } from 'react';
import { useDataHandler } from '../../context/DataHandlerContext/DataHandlerContext';
import { useThemeContext } from '../../context/ThemeContext/ThemeContext';
import { SortConfig, TickData } from '../../types/types';
import { CryptoRow } from '../table/CryptoRow';
import { HeaderRow } from '../table/HeaderRow';

interface FavouriteListProps {
  updateFlag:     boolean;
  tableStyle?:    string;
  headerStyle?:   string;
  tbodyStyle?:    string;
  controlsStyle?: Array<string>;
}

export const FavouriteList = ({ updateFlag, tableStyle, headerStyle, tbodyStyle, controlsStyle }: FavouriteListProps) => {  
  let tabIndex: number = 2;
  const { data, updateAction } = useDataHandler();
  const { theme }              = useThemeContext();

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'INSTRUMENT',
    direction: 'asc',
  });

  const handleSort = (key: SortConfig['key'] | undefined) => {
    if (key) {
      let direction: SortConfig['direction'] = 
        sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
      setSortConfig({ key, direction });
    }
  };

  const outputData = () => {
    const sortedArray = [...data];
    sortedArray.sort((a: TickData, b: TickData) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortedArray;
  }

  const dataRef = useRef<TickData[]>(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data.length]);
  
  const updateData = () => {
    const names = dataRef.current.map(value => value.INSTRUMENT);
    updateAction(names);
  };

  useEffect(() => {
    updateData();
    const interval = setInterval(() => {
       updateData();
    }, 10_000);
    return () => clearInterval(interval);
  }, [updateFlag]);

  //*TODO Loading animation
  const titles: Array<string>              = ["Ticker",     "Price", "Change",     "Last Updated"];
  const sortKeys: Array<SortConfig['key']> = ["INSTRUMENT", "PRICE", "PRICE_FLAG", "PRICE_LAST_UPDATE_TS"]; 

  const tableBase = `mt-3 h-full w-full table-auto border-separate border-spacing-y-3 rounded-xl px-5`;
  const headerBase = `text-left text-sm`;
  const tbodyBase = `text-sm`;
  const tableClassName = tableStyle ?? (
    `${tableBase} ${theme === 'dark'
      ? 'text-white bg-gradient-to-r from-purple-600 to-blue-700'
      : 'text-gray-900 bg-gradient-to-r from-yellow-100 to-pink-200'}`
  );
  const headerClassName = headerStyle ?? (
    `${headerBase} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`
  );
  const tbodyClassName = tbodyStyle ?? (
    `${tbodyBase} ${theme === 'dark' ? '' : 'text-gray-800'}`
  );
  
  return (
    <table className={tableClassName}>
      <thead>
        <HeaderRow
          headerStyle={headerClassName}
          titles={titles}
          sortKeys={sortKeys}
          sortConfig={sortConfig}
          handleSort={handleSort}
        />
      </thead>
      <tbody className={tbodyClassName}>
        {outputData().map((value: TickData) => {
          tabIndex = tabIndex + 2;
          return (
            <CryptoRow 
              key={value.INSTRUMENT} 
              value={value} 
              tabIndex={tabIndex}
              updateButtonStyle={controlsStyle?.[0]}
              deleteButtonStyle={controlsStyle?.[1]}
            />
          )
        })}
      </tbody>
    </table>
  );
}
