import { SortConfig } from "../types/types";
import { HeaderCell } from "./HeaderCell";

interface HeaderRowProps {
    headerStyle: string;
    titles: 		 Array<string>;
    sortKeys: 	 Array<SortConfig['key']>;
    sortConfig:  SortConfig;
    handleSort:  (key: SortConfig['key']) => void;
}

export const HeaderRow = ({ headerStyle, titles, sortKeys, sortConfig, handleSort }: HeaderRowProps) => {
	const cellStyle ="px-6 py-3 w-32";
  return (
		<tr className={headerStyle}>
			{titles.map((title, index) => {
				const sortKey = sortKeys[index];
				return (
					<HeaderCell
						key={title}
						style={cellStyle}
						title={title}
						sortKey={sortKey}
						sortConfig={sortConfig}
						onSort={handleSort}
					/>
				);
			})}
			<HeaderCell title="Controls" style={cellStyle}/>
		</tr>
  );
}
