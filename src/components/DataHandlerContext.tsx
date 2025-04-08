import React, { createContext, useContext, useRef, useState, useTransition, useEffect } from 'react';
import { useApiFetch } from "../hooks/useApiFetch"
import { TickData } from '../types/types';

interface DataHandlerContextType {
  data:         Array<TickData>;
  updateAction: (names: Array<string>) => void;
  isAddedRefs:  React.RefObject<Set<string>> | null;
  handleDelete: (name: string) => void;
  removing:     Set<string>;
}

const DataHandlerContext = createContext<DataHandlerContextType>({
  data:         [],
  updateAction: () => {},
  isAddedRefs:  null,
  handleDelete: () => {},
  removing:     new Set<string>()
});

export const DataHandlerProvider = ({ children }: { children: React.ReactNode }) => {
  //*TODO How to organize one occurence of API_KEY in all my program IT OCCURS AT HEADER ALSO
  const API_KEY = "fff2211f54bbb67548c547cb6e2b5ecc94f60b4fb31acce4ab3c3aaf11d1145d";
  const defaultTickParams = {
    market: 'coinbase',
    apply_mapping: 'true',
    api_key: API_KEY,
  };
	const [, fetchTick] = useApiFetch(
    'https://data-api.coindesk.com/spot/v1/latest/tick',
    {
      ...defaultTickParams,
      instruments: [],
    },
    false
  );
  const [, startTransition] = useTransition();
  
  const [data, setData]         = useState<Array<TickData>>([]);
  const [removing, setRemoving] = useState<Set<string>>(new Set<string>());
  const isAddedRefs             = useRef<Set<string>>(new Set<string>());

  const updateAction = (names: Array<string>) => {
    console.log("FETCHING", names);
    names.filter(val => !removing.has(val));

    startTransition(async () => {
      const newDataArray: Array<TickData> = await Promise.all(
        names.map(async (name) => {
          try {
            const newData: Object = Object.values(await fetchTick({
              ...defaultTickParams,
              instruments: [name],
            }))[0];
            const { INSTRUMENT, PRICE, PRICE_FLAG, PRICE_LAST_UPDATE_TS } = Object.values(newData)[0];
            const tickData: TickData = { INSTRUMENT, PRICE, PRICE_FLAG, PRICE_LAST_UPDATE_TS }
            return tickData;
          } catch (error) {
            console.error(`Error fetching data for ${name}:`, error);
            return {} as TickData;
          }
        })
      );

      startTransition(() => {
        setData(prev => {
          const updatedDataArray: Array<TickData> = prev.map(item => {
            const match: TickData | undefined = newDataArray.find((val: TickData) => val.INSTRUMENT === item.INSTRUMENT);
            return match && Object.keys(match).length > 0 ? match : item;
          }).filter(item => Object.keys(item).length > 0);

          newDataArray.forEach((newData: TickData) => {
            if (Object.keys(newData).length > 0) {
              const exists = prev.some(item => item.INSTRUMENT === newData.INSTRUMENT);
              if (!exists) {
                updatedDataArray.push(newData);
                isAddedRefs.current.add(newData.INSTRUMENT);
              }
            }
          });
          document.cookie = `data=${JSON.stringify(updatedDataArray)}; path=/`;
          return updatedDataArray;
        });
      });
    });
  };

  const handleDelete = (name: string) => {
    setRemoving(prev => new Set(prev).add(name));
    setTimeout(() => {
      startTransition(() => {
        setData(prev => {
          const updatedData = prev.filter(item => item.INSTRUMENT !== name);
          document.cookie = `data=${JSON.stringify(updatedData)}; path=/`;
          return updatedData;
        });
        setRemoving(prev => {
          const updated = new Set(prev);
          updated.delete(name);
          return updated;
        });
      });
    }, 500);
  };

  const loadDataFromCookies = () => {
    const cookieData = document.cookie.split('; ').find(row => row.startsWith('data='));
    if (cookieData && cookieData !== 'data=[]') {
      const data = JSON.parse(cookieData.split('=')[1]);
      setData(data);
    } else {
      updateAction(["DOGE-USD"]);
    }
  };
  useEffect(() => {
    loadDataFromCookies();
  }, []);

  return (
    <DataHandlerContext.Provider value={{ data, updateAction, isAddedRefs, removing, handleDelete }}>
      {children}
    </DataHandlerContext.Provider>
  );
};

export const useDataHandler = () => useContext(DataHandlerContext);
