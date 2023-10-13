import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function Help() {

  return (
    <>
      createPortal(
        <ModalContent onClose={() => setShowHelp(false)} />,
        document.body
      )
    </>
  );
}
