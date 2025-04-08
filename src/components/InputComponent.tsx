import React, { useEffect, useRef } from 'react';

interface InputComponentProps extends React.InputHTMLAttributes<HTMLInputElement> {
  setIsFocused: (val: boolean) => void;
  allowedRef?:   React.RefObject<any>;
}

export const InputComponent = ({
  setIsFocused,
  allowedRef, ...props
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
        {...props}
      />
    </div>
  );
};
