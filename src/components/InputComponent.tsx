import { useEffect, useRef } from 'react';

interface InputComponentProps {
  style?:           string;
  input?:           string;
  type?:            string;
  placeholderText?: string;
  onInputChange?:   (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeydown?:       (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setIsFocused?:    (val: boolean) => void;
  allowedRef?:      React.RefObject<any>;
}

export const InputComponent = ({
  style           = '',
  input           = '',
  type            = 'text',
  placeholderText = '',
  onInputChange   = () => {},
  onKeydown       = () => {},
  setIsFocused    = () => {},
  allowedRef,
}: InputComponentProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
        allowedRef?.current && !allowedRef?.current.contains(event.target as Node) ) {
      setIsFocused(false);
    }
  };
  const handleEscPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsFocused(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscPress);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscPress);
    };
  }, []);

  return (
    <div>
      <input
        ref={inputRef}
        className={style}
        type={type}
        value={input}
        onChange={(e) => onInputChange(e)} 
        onKeyDown={(e) => onKeydown(e)}
        onFocus={() => setIsFocused(true)}
        onMouseDown={() => setIsFocused(false)}
        placeholder={placeholderText}
      />
    </div>
  );
};
