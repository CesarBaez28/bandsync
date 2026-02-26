"use client";

import { forwardRef, ChangeEvent, useState } from 'react';
import clsx from 'clsx';
import styles from './customs-inputs.module.css';
import CustomButton from '../button/CustomButton';
import AttachtIcon from '@/public/attach_file_24dp.svg'
import CloseIcon from '@/public/close_24dp.svg'

export type CustomFileInputProps = {
  label?: string;
  name: string;
  accept?: string;
  multiple?: boolean;
  className?: string;
  error?: string;
  helperText?: string;
  onChange?: (files: File[] | null) => void;
  buttonText?: string;
};

const CustomFileInput = forwardRef<HTMLInputElement, CustomFileInputProps>(
  (
    {
      label,
      name,
      accept,
      multiple = false,
      className,
      error,
      helperText,
      onChange,
      buttonText = 'Seleccionar archivo',
    },
    ref
  ) => {
    const [files, setFiles] = useState<File[]>([]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files;
      const selected = fileList ? Array.from(fileList) : [];
      setFiles(selected);
      onChange?.(selected.length ? selected : null);
    };

    const handleRemove = (index: number) => {
      const updated = files.filter((_, i) => i !== index);
      setFiles(updated);
      onChange?.(updated.length ? updated : null);
      if (ref && 'current' in ref && ref.current) {
        const dataTransfer = new DataTransfer();
        updated.forEach((file) => dataTransfer.items.add(file));
        ref.current.files = dataTransfer.files;
      }
    };

    return (
      <div className={clsx(styles.wrapper, className)}>
        {label && (
          <label htmlFor={name} className={styles.label}>
            {label}
          </label>
        )}

        <div>
          <CustomButton
            style={{ padding: '0.4rem 0.4rem' }}
            variant='secondary'
            type='button'
            iconLeft={
              <AttachtIcon width={24} height={24} />
            }
            onClick={() => ref && 'current' in ref && ref.current?.click()}
          >
            {buttonText}
          </CustomButton>
          <input
            id={name}
            name={name}
            type="file"
            accept={accept}
            multiple={multiple}
            className={styles.input}
            ref={ref}
            onChange={handleChange}
          />
        </div>

        {files.length > 0 && (
          <ul className={styles.fileList}>
            {files.map((file, idx) => (
              <li
                key={`${file.name}-${file.size}-${file.lastModified}`}
                className={styles.fileItem}
              >
                <span>{file.name}</span>
                <CustomButton variant='tertiary' type='button' onClick={() => handleRemove(idx)} aria-label={`Eliminar ${file.name}`}>
                  <CloseIcon width={24} height={24} />
                </CustomButton>
              </li>
            ))}
          </ul>
        )}

        {helperText && !error && (
          <p className={styles.helperText}>{helperText}</p>
        )}
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    );
  }
);

CustomFileInput.displayName = 'CustomFileInput';
export default CustomFileInput;