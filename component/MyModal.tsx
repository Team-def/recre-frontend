import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

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
    
  };

export interface ModalProps {
  isOpen? : boolean,
}

export default function MyModal({open, modalHeader, modalContent ,closeFunc}: {open: boolean, modalHeader:string, modalContent:JSX.Element, closeFunc: () => void}) {
    return (
        <Modal
            open={open}
            onClose={closeFunc}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h5" component="h2">
                {modalHeader}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {modalContent}
            </Typography>
            </Box>
        </Modal>
    )
}