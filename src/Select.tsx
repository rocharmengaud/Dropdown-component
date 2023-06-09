import { useEffect, useRef, useState } from 'react';
import styles from './select.module.css';

export type SelectOption = {
  label: string;
  value: string | number;
};

type SingleSelectProps = {
  multiple?: false;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
};

type MultipleSelectProps = {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
};

type SelectProps = {
  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

export const Select = ({ value, onChange, options, multiple }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // FOR ACCESSIBILITY
  const containerRef = useRef<HTMLDivElement>(null);

  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined);
  }

  function selectOption(option: SelectOption) {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter((o) => o !== option));
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
    }
  }

  function isOptionSelected(option: SelectOption) {
    return multiple ? value.includes(option) : option === value;
  }

  // If we click outside the dropdown we reset the highlight to the first option (index 0)
  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  // ACCESSIBILITY
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.target != containerRef.current) return;
      switch (event.code) {
        case 'Enter':
        case 'Space':
          setIsOpen((previous) => !previous);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        case 'ArrowUp':
        case 'ArrowDown': {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (event.code === 'ArrowDown' ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case 'Escape':
          setIsOpen(false);
          break;
      }
    };

    containerRef.current?.addEventListener('keydown', handler);
    return () => {
      containerRef.current?.removeEventListener('keydown', handler);
    };
  }, [isOpen, highlightedIndex, options]);

  return (
    <>
      {/* CLASSNAMES HERE ARE CSS MODULES */}
      {/* onBlur means when we defocus by clicking off this div area */}
      <div
        ref={containerRef}
        tabIndex={0}
        className={styles.container}
        onClick={() => setIsOpen((previous) => !previous)}
        onBlur={() => setIsOpen(false)}
      >
        <span className={styles.value}>
          {multiple
            ? value.map((v) => (
                <button
                  key={v.value}
                  className={styles['option-badge']}
                  onClick={(event) => {
                    // so the parent (dropdown) doesn't open up
                    event.stopPropagation();
                    selectOption(v);
                  }}
                >
                  {v.label}
                  <span className={styles['remove-btn']}>&times;</span>
                </button>
              ))
            : value?.label}
        </span>
        {/* THIS IS A WAY FOR STYLES WITH A - TO WORK */}
        <button
          className={styles['clear-btn']}
          onClick={(event) => {
            // so the parent (dropdown) doesn't open up
            event.stopPropagation();
            clearOptions();
          }}
        >
          &times;
        </button>
        <div className={styles.divider}></div>
        <div className={styles.caret}></div>
        {/* '' for empty styling */}
        <ul className={`${styles.options} ${isOpen ? styles.show : ''}`}>
          {options.map((option, index) => (
            <li
              key={option.value}
              className={`${styles.option} ${isOptionSelected(option) ? styles.selected : ''} ${
                index === highlightedIndex ? styles.highlighted : ''
              } `}
              onClick={(event) => {
                event.stopPropagation();
                selectOption(option);
                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
