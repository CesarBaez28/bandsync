'use client'

import stylesResponsive from '@/app/styles/responsive.module.css';
import { PagedData, Setlist } from "@/app/lib/definitions";
import { UUID } from "node:crypto";
import CustomLink from '../../link/CustomLink';
import { Can } from '../../authorization/Can';
import { UserPermissions } from '@/app/lib/permisions';
import CustomButton from '../../button/CustomButton';

import EditIcon from '@/public/edit_24dp.svg';
import DeleteIcon from '@/public/delete_24dp.svg';
import { useState } from 'react';
import { formatDate } from '@/app/lib/utils';
import SetListsAccordion from './SetListsAccordion';

type Props = {
  readonly data: PagedData<Setlist> | undefined;
  readonly musicalBandId: UUID | undefined;
  readonly hypName: string;
};

export default function SetListsContent({ data, musicalBandId, hypName }: Props) {
  const [selectedSetList, setSelectedSetList] = useState<Setlist | null>(null);

  const handleDelete = (setList: Setlist) => {
    setSelectedSetList(setList);
    // Implement delete functionality here
  }

  return (
    <div id='modal-root'>
      {(data?.content?.length ?? 0) > 0 ? (
        <>
          <div className={stylesResponsive.desktopOnly}>
            <table>
              <thead>
                <tr>
                  <th>Acciones</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Repertorio</th>
                  <th>Fecha de Creación</th>
                </tr>
              </thead>
              <tbody>
                {data?.content.map((setList) => (
                  <tr key={setList.id}>
                    <td>
                      <div style={{ display: 'flex', gap: '.6rem' }}>
                        <Can permission={UserPermissions.UPDATE_SETLIST} musicalBandId={musicalBandId}>
                          <CustomLink href={`/musicalbands/${hypName}/setlists/${setList.id}/edit`} variant="tertiary">
                            <EditIcon width={24} height={24} />
                          </CustomLink>
                        </Can>
                        <Can permission={UserPermissions.DELETE_SETLIST} musicalBandId={musicalBandId}>
                          <CustomButton onClick={() => handleDelete(setList)} variant="tertiary" type="button">
                            <DeleteIcon width={24} height={24} />
                          </CustomButton>
                        </Can>
                      </div>
                    </td>
                    <td>{setList.name}</td>
                    <td>{setList.description}</td>
                    <td>{setList.repertoire.name}</td>
                    <td>{formatDate(new Date(setList.createdAt))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={stylesResponsive.mobileOnly}>
            <SetListsAccordion
              data={data}
              musicalBandId={musicalBandId}
              hypName={hypName}
              onDelete={handleDelete}
            />
          </div>
        </>
      ) : (
        <div className="message">
          <h2>¡No se encontraron resultados!</h2>
          <p>Registre un Setlist usando el botón Agregar o cambie los valores de su búsqueda</p>
        </div>)
      }
    </div>
  );
}