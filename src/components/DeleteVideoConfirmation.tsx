import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { Alert, AlertTitle } from '@mui/material';
import { IProcessedVideo } from '../common/interfaces';
import React from 'react';

export interface DeleteConfirmationProps {
  onClose: (action?: number) => void;
  videoDetails: IProcessedVideo;
}

export const DeleteVideoConfirmation: React.FC<DeleteConfirmationProps> = ({ onClose, videoDetails }) => {
  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(videoDetails.id);
  };

  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }} maxWidth="xs" open={true}>
      <DialogTitle>Delete Vidoe Confirmation</DialogTitle>
      <DialogContent dividers>
        <Alert severity="warning">
          <AlertTitle>Are you sure you want delete?</AlertTitle>
          <strong>{videoDetails.name}</strong> by <strong>{videoDetails.author.name}</strong>
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};
