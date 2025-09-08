'use client';

import CustomLink from '../../link/CustomLink';
import Search from '../../search/Search';
import styles from '../../../styles/input-container.module.css';

type InputContainerProps = {
  readonly hypName: string
}

export default function InputContainer({ hypName }: InputContainerProps) {
  return (
    <div id='modal-root' className={styles.inputContainer}>
      <Search placeholder="Nombre o descripción" />

      <CustomLink buttonStyle={true} href={`/musicalbands/${hypName}/repertoires/create`}>
        Agregar
      </CustomLink>
    </div>
  );
}