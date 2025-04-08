import  { createContext, useContext } from 'react';
import { TickData } from '../../types/types';

export interface DataHandlerContextType {
  data:         Array<TickData>;
  updateAction: (names: Array<string>) => void;
  isAddedRefs:  React.RefObject<Set<string>> | null;
  handleDelete: (name: string) => void;
  removing:     Set<string>;
}

const DataHandlerContextContent = {
	data:         [],
	updateAction: () => {},
	isAddedRefs:  null,
	handleDelete: () => {},
	removing:     new Set<string>()
}
export const DataHandlerContext = createContext<DataHandlerContextType>(DataHandlerContextContent);
export const useDataHandler     = () => useContext(DataHandlerContext);