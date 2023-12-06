import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { ReactNode } from 'react';
import { useRef } from 'react';
import React from 'react';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    // bgcolor: 'background.paper',
    bgcolor: '#f2f2f2',
    border: '0px solid #000',
    boxShadow: 24,
    p: 3,
    borderRadius: '20px',
    textAlign: 'center' as 'center',
    outline: 0
  };

export interface ModalProps {
  isOpen? : boolean,
}

function MyModal({open, modalHeader, modalContent ,closeFunc, myref}: {open: boolean, modalHeader:string | ReactNode, modalContent:JSX.Element | undefined, closeFunc: () => void, myref: any}) {
    return (<>
        <Modal
            open={open}
            onClose={closeFunc}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableEscapeKeyDown = {modalHeader==="QR코드를 찍고 입장해주세요!" ? true : false}
        >
            <Box sx={modalStyle} ref={myref}>
            <Typography id="modal-modal-title" variant="h5" component="h2">
                {modalHeader}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {modalContent}
            </Typography>
            </Box>
        </Modal>
        <style jsx global>{`
            .headerTitle{
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
            }
            #modal-modal-description{
                display: flex;
                justify-content: center;
                align-items: center;
            }
        `}</style>
        </>
    )
}

export default React.memo(MyModal)