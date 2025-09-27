'use client';

import Search from '../../search/Search';
import styles from '../../../styles/input-container.module.css';
import stylesModal from '../../../styles/modal.module.css';
import CustomButton from '../../button/CustomButton';
import Modal from '../../modal/Modal';
import { useState } from 'react';

export default function InputContainer() {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleCancel = () => {
    setOpenModal(false);
  }

  return (
    <div id='modal-root' className={styles.inputContainer}>
      <Search placeholder="Nombre, apellido, email..." />

      <CustomButton type='button' onClick={() => setOpenModal(true)}>
        Agregar
      </CustomButton>

      <Modal
        size="sm"
        isOpen={openModal}
        title="Invitar integrante"
      >
        <form className={stylesModal.modalContent}>

          <div className={stylesModal.buttonsContainer}>

            <CustomButton type='button' variant='secondary' onClick={handleCancel}>
              Cancelar
            </CustomButton>
            <CustomButton type='submit'>
              Agregar
            </CustomButton>

          </div>
        </form>
      </Modal>
    </div>
  );
}