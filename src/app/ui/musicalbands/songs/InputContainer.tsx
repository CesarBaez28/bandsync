'use client';

import CustomLink from '../../link/CustomLink';
import Search from '../../search/Search';
import styles from './input-container.module.css';

type InputContainerProps = {
  readonly hypName: string
}

export default function InputContainer({ hypName }: InputContainerProps) {
  return (
    <div id='modal-root' className={styles.inputContainer}>
      <Search placeholder="Nombre, artista, género, tonalidad" />

      <CustomLink buttonStyle={true} href={`/musicalbands/${hypName}/songs/create`}>
        Agregar
      </CustomLink>
    </div>
  );
}