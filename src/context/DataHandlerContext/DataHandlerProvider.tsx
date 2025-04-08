import { ReactNode, useContext, useRef, useState, useTransition, useEffect } from 'react';
import { DataHandlerContext } from './DataHandlerContext';
import { useApiFetch } from "../../hooks/useApiFetch"
import { TickData } from '../../types/types';
import { setCookie, getCookie } from '../../utils/utils';

export const DataHandlerProvider = ({ children }: { children: ReactNode }) => {
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
  const isDataCookieAccepted    = useRef<boolean>(false);

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
          if (isDataCookieAccepted.current)
            setCookie("data", JSON.stringify(updatedDataArray));
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
          if (isDataCookieAccepted.current)
            setCookie("data", JSON.stringify(updatedData));
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
    isDataCookieAccepted.current = Boolean(getCookie('cookie_data_accepted'));
    if (isDataCookieAccepted.current) {
      const cookieData = getCookie('data');
      if (cookieData && cookieData !== '[]') {
        const data = JSON.parse(cookieData);
        setData(data);
      } 
    }else {
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
