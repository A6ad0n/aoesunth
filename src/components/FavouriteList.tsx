import { useEffect, useState, useRef } from 'react';
import { useDataHandler } from './DataHandlerContext';
import { CryptoRow } from './CryptoRow';
import { SortConfig, TickData } from '../types/types';
import { HeaderRow } from './HeaderRow';

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
  const tableClassName = tableStyle ??
    `mt-3 h-full w-full table-auto text-white border-separate 
    border-spacing-y-3 bg-gradient-to-r from-purple-600 to-blue-700 rounded-xl px-5`;
  const headerClassName = headerStyle ??
    `text-left text-sm text-gray-300`;
  const tbodyClassName = tbodyStyle ??
    `text-sm`
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
