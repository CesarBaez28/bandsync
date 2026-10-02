'use client';

import styles from '@/app/styles/input-container.module.css'
import { UUID } from "node:crypto";
import Search from "../../search/Search";
import { Can } from "../../authorization/Can";
import { UserPermissions } from "@/app/lib/permisions";
import CustomLink from "../../link/CustomLink";

type InputContainerProps = {
  readonly hypName: string;
  readonly musicalBandId: UUID | undefined;
}

export default function InputContainer({ hypName, musicalBandId }: InputContainerProps) {
  return (
    <div id='modal-root' className={styles.inputContainer}>
      <Search placeholder="Nombre" />

      <Can permission={UserPermissions.ADD_SETLIST} musicalBandId={musicalBandId}>
        <CustomLink buttonStyle={true} href={`/musicalbands/${hypName}/setlists/create`}>
          Agregar
        </CustomLink>
      </Can>

    </div>
  );
}