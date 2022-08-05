import { useRef, useState } from 'react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { MdModeEdit } from 'react-icons/md';
import { useEnterKeyPress } from '../hooks/useEnterKeyPress';

type InputP<T> = {
  name: Path<T>;
  onBlurCallback?: ({ value, errorHandler }: { value: string; errorHandler?: () => void }) => any;
  defaultValue?: any;
  placeholder?: string;
  register: UseFormRegister<T>;
  type?: 'input' | 'textarea';
  label: string;
};

type Event = {
  target: any;
};

export const Input = <T extends FieldValues>({
  name,
  type,
  placeholder,
  defaultValue,
  onBlurCallback,
  register,
  label,
}: InputP<T>) => {
  const { onBlur, name: registerName, ref } = register(name);
  const [currentValue, setCurrentValue] = useState<string | undefined>(undefined);
  const [isOnFocus, setIsOnFocus] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const errorHandler = () => {
    setCurrentValue(defaultValue);
    if (inputRef.current) {
      inputRef.current.value = defaultValue;
    }
  };

  const customOnBlur = (value: string) => {
    setIsOnFocus(false);

    if (onBlurCallback && value !== defaultValue && value !== currentValue) {
      setCurrentValue(value);
      onBlurCallback({ value, errorHandler });
    }
  };

  useEnterKeyPress({ ref: inputRef, cb: customOnBlur });

  const defaultProps = {
    name: registerName,
    defaultValue: defaultValue ?? '',
    placeholder: placeholder ?? 'Type...',
    onBlur: (event: Event) => {
      return onBlurCallback
        ? (() => {
            onBlur(event);
            customOnBlur(event.target.value);
          })()
        : onBlur(event);
    },
    onFocus: () => setIsOnFocus(true),
    ref: (event: any) => {
      ref(event);
      inputRef.current = event;
    },
  };

  if (type === 'textarea') {
    return (
      <>
        <label htmlFor={registerName}>{label}</label>
        <div className="relative">
          <textarea {...defaultProps} />
          {!isOnFocus && (
            <div className="absolute right-5 top-1 translate-y-1/2 z-20">
              <MdModeEdit size={18} />
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <label htmlFor={registerName}>{label}</label>
      <div className="relative">
        <input {...defaultProps} />
        {!isOnFocus && (
          <div className="absolute right-5 top-1 translate-y-1/2 z-20">
            <MdModeEdit size={18} />
          </div>
        )}
      </div>
    </>
  );
};