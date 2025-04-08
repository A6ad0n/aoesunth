import { SortConfig } from "../types/types";

interface HeaderCellProps {
  style?:      string;
  title:       string;
  sortKey?:    SortConfig['key'];
  sortConfig?: SortConfig;
  onSort?:     (key: SortConfig['key']) => void;
}

export const HeaderCell = ({ style, title, sortKey, sortConfig, onSort } : HeaderCellProps) => {
	const isActive: boolean = sortKey ? sortConfig?.key === sortKey : false;
	const direction: string = sortConfig?.direction === 'asc' ? '↑' : '↓';
  return (
    <th
        className={`${style} ${sortKey ? 'cursor-pointer' : ''}`}
        onClick={sortKey ? () => onSort!(sortKey) : undefined}
    >
        {title} {isActive && direction}
    </th>
  )
}
