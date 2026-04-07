'use client';

import CustomLink from '../../link/CustomLink';
import Search from '../../search/Search';
import styles from '../../../styles/input-container.module.css';
import { UUID } from 'node:crypto';
import { Can } from '../../authorization/Can';
import { UserPermissions } from '@/app/lib/permisions';

type InputContainerProps = {
  readonly hypName: string;
  readonly musicalBandId: UUID | undefined;
}

export default function InputContainer({ hypName, musicalBandId }: InputContainerProps) {
  return (
    <div id='modal-root' className={styles.inputContainer}>
      <Search placeholder="Nombre, artista, género, tonalidad" />

      <Can permission={UserPermissions.ADD_SONG} musicalBandId={musicalBandId}>
        <CustomLink buttonStyle={true} href={`/musicalbands/${hypName}/songs/create`}>
          Agregar
        </CustomLink>
      </Can>

    </div>
  );
}