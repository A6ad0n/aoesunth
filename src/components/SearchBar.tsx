import { useState, useRef } from 'react'
import { Autocomplete } from './Autocomplete';
import { InputComponent } from './InputComponent';
import { unstable_batchedUpdates } from 'react-dom';
import { useDataHandler } from './DataHandlerContext';

interface SearchBarProps {
  isPending:         boolean;
  placeholderText?:  string;
  inputStyle?:       string;
  searchButtonText?: string;
  buttonStyle?:      string;
}

export const SearchBar = ({ isPending, placeholderText, inputStyle, searchButtonText, buttonStyle }: SearchBarProps) => {
  const [input, setInput]                 = useState<string>("");
  const [isFocused, setIsFocused]         = useState<boolean>(true);
  const [filteredData, setFilteredData]   = useState<Array<string>>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const autocompleteRef  = useRef<any>(null);
  const { updateAction } = useDataHandler();

  const buttonClassName = buttonStyle ?? 
    `absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 
    rounded-lg border-none cursor-pointer transition-colors ease-in-out duration-200 hover:bg-blue-500/80`;
  const inputClassName = inputStyle ?? 
    `w-full h-full focus:outline-none focus:ring-0 focus:border-gray-600 border-2 border-white p-2 
    rounded-lg hover:border-gray-600 transition-colors ease-in-out duration-200`;

 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    unstable_batchedUpdates(() => {
      if (!input)
        setSelectedIndex(-1);
      setInput(e.target.value);
      if (isFocused === false) //IDK smtimes there're bug
        setIsFocused(true);
    });
  }
  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      setInput(filteredData[selectedIndex === -1 ? 0 : selectedIndex]);
    }
    else if (e.key === 'Enter') {
      e.preventDefault;
      handleEnter();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (selectedIndex < filteredData.length - 1)
        setSelectedIndex(prevIndex => prevIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (selectedIndex > 0)
        setSelectedIndex(prevIndex => prevIndex - 1);
    }
  }

  
  const handleButtonClick = (item: string = input) => {
    if (item)
      updateAction([item]);
  }
  const handleEnter = () => {
    handleButtonClick();
    setInput('');
  }
  const handleMouseEnter = (index: number) => {
    setSelectedIndex(index);
  }

  const handleFilteredChange = (arr: Array<string>) => {
    if (JSON.stringify(filteredData) !== JSON.stringify(arr))
      setFilteredData(arr);
  }

  return (
    <div className="w-full h-full relative">
      <InputComponent 
        style={inputClassName}
        input={input}
        type='text'
        placeholderText={placeholderText}
        onInputChange={handleInputChange}
        onKeydown={handleKeydown}
        setIsFocused={setIsFocused}
        allowedRef={autocompleteRef}
      />
      <button 
        className={buttonClassName}
        onClick={() => handleEnter()}
      >
        {searchButtonText}
      </button>
      <div ref={autocompleteRef}>
        {(input && isFocused) && 
          <Autocomplete 
            query={input} 
            isPending={isPending}
            loadingText="Loading..."
            selectedIndex={selectedIndex}
            handleFilteredChange={handleFilteredChange}
            handleClick={handleButtonClick}
            handleMouseEnter={handleMouseEnter}
          />}
      </div>
    </div>
  )
}