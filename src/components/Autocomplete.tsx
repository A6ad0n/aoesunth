import { useEffect, useRef } from 'react'

interface AutocompleteProps {
  query:                string;
  isPending:            boolean;
  loadingText?:         string;
  selectedIndex:        number;
  handleFilteredChange: (arr: Array<string>) => void;
  handleClick:          (item: string) => void;
  handleMouseEnter:     (index: number) => void;
  listStyle?:           string;
  itemStyle?:           string;
  activeItemStyle?:     string;
  hoverItemStyle?:      string;
}

export const Autocomplete = ({ query, isPending, loadingText, selectedIndex, 
  handleFilteredChange, handleClick, handleMouseEnter,
  listStyle, itemStyle, activeItemStyle, hoverItemStyle }: AutocompleteProps) => {
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const selectedEl = itemRefs.current[selectedIndex];
    if (selectedEl) {
      selectedEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);
  

  const filterData = () => {
    const storedData = Object.keys(JSON.parse(localStorage.getItem('cryptoData') || '[]'));
    return storedData.filter((item: string) => item.toLowerCase().includes(query.toLowerCase()));
  };
  
  const filteredData = filterData();
  useEffect(() => {
    handleFilteredChange(filteredData);
  }, [filteredData, handleFilteredChange]);

  const listClassName = listStyle ??
    `absolute left-0 right-0 top-full mt-2 bg-gray-800/80 
    rounded-lg shadow-lg z-20 max-h-60 overflow-auto scroll-smooth`;
  const itemClassName = itemStyle ??
    `p-2 cursor-pointer transition-colors ease-in-out duration-200`;
  const activeItemClassName = activeItemStyle ?? 
    `bg-gray-600`;
  const hoverItemClassName = hoverItemStyle ??
    `hover:bg-gray-600/80`;
  return (
    <div className="relative">
      {isPending &&      
      <div className="flex flex-row gap-5 align-middle w-full items-center">
        <div className="spinner"></div>
        <p className="rounded-lg p-2 z-10">{loadingText}</p>
      </div>
      }
      
      <ul className={listClassName}>
        {filteredData.map((item: string, index: number) => (
          <li
            key={item}
            ref={el => itemRefs.current[index] = el}
            onClick={() => handleClick(item)}
            onMouseEnter={() => handleMouseEnter(index)}
            className={`${itemClassName} ${selectedIndex === index ? activeItemClassName : selectedIndex === -1 ? hoverItemClassName : ''}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
