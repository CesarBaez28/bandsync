'use client';

import CustomLink from '../../link-temporal/CustomLink';
import Search from '../../search/Search';
import styles from '../../../styles/input-container.module.css';
import { Can } from '../../authorization/Can';
import { UserPermissions } from '@/app/lib/permisions';
import { UUID } from 'node:crypto';

type InputContainerProps = {
  readonly hypName: string;
  readonly musicalBandId: UUID | undefined;
}

export default function InputContainer({ hypName, musicalBandId }: InputContainerProps) {
  return (
    <div id='modal-root' className={styles.inputContainer}>
      <Search placeholder="Nombre o descripción" />

      <Can permission={UserPermissions.ADD_REPERTOIRE} musicalBandId={musicalBandId}>
        <CustomLink buttonStyle={true} href={`/musicalbands/${hypName}/repertoires/create`}>
          Agregar
        </CustomLink>
      </Can>

    </div>
  );
}