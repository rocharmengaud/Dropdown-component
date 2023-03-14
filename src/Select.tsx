import { useState } from 'react';
import styles from './select.module.css';

type SelectOption = {
  label: string;
  value: any;
};

type SelectProps = {
  options: SelectOption[];
  // optional field with ?
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
};

export const Select = ({ value, onChange, options }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  function clearOptions() {
    onChange(undefined);
  }

  function selectOption(option: SelectOption) {
    onChange(option);
  }
  return (
    <>
      {/* CLASSNAMES HERE ARE CSS MODULES */}
      {/* onBlur means when we defocus by clicking off this div area */}
      <div tabIndex={0} className={styles.container} onClick={() => setIsOpen((previous) => !previous)} onBlur={() => setIsOpen(false)}>
        <span className={styles.value}>{value?.label}</span>
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
          {options.map((option) => (
            <li
              key={option.label}
              className={`${styles.option} ${isOptionSelected(option) > styles.selected} : ''`}
              onClick={(event) => {
                event.stopPropagation();
                selectOption(option);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
