import { useEffect, useTransition } from 'react';
import { useApiFetch } from "../hooks/useApiFetch"
import { SearchBar } from "./SearchBar"

interface HeaderProps {
  logoSrc: string;
  name:    string;
}

export const Header = ({ logoSrc, name }: HeaderProps) => {
  const [, startTransition] = useTransition();
  const [isInstrumentsLoading, fetchInstruments] = useApiFetch(
    'https://data-api.coindesk.com/spot/v1/markets/instruments', 
    { 
      market: 'coinbase', 
      instrument_status: 'ACTIVE', 
      api_key: "fff2211f54bbb67548c547cb6e2b5ecc94f60b4fb31acce4ab3c3aaf11d1145d" 
    }, 
    false
  );

  const retry = async (
    fn: () => Promise<any>,
    retries = 3,
    delay = 1_000
  ): Promise<any> => {
    for (let i = 0; i < retries; ++i) {
      try {
        return await fn();
      } catch (e) {
        if (i < retries - 1) {
          await new Promise(res => setTimeout(res, delay));
        } else {
          throw e;
        }
      }
    }
    throw new Error('Unreachable');
  };
  const loadData = async () => {
    startTransition(async () => {
      let response: any;
      try {
        response = await retry(() => fetchInstruments(), 3, 1_000);
      } catch (error) {
        console.error(`Error fetching data for ${name} after retries:`, error);
        return;
      }
      const data = response?.Data?.coinbase?.instruments;
      if (data) {
        startTransition(() => {
          localStorage.setItem('cryptoData', JSON.stringify(data));
        });
      }
    });
  };
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="prevent-select flex flex-row justify-between items-center gap-3">
      <img src={logoSrc} alt="LOGO" className="w-[5vw] h-[5vw]"></img>
      <h1 className="text-3xl font-bold">{name}</h1>
      <div className="bg-slate-800 hover:bg-slate-700 
        transition-colors duration-300 ease-in-out flex-1 mx-4 relative rounded-lg">
        <SearchBar 
          isPending={isInstrumentsLoading} 
          placeholderText="Type here" 
          searchButtonText="Search"/>
      </div>
    </div>
  )
}
