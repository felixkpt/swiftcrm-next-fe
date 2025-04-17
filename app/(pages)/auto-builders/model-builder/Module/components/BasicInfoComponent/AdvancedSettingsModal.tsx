import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from '@mui/material';
import React from 'react';

type Props = {
    open: boolean;
    onClose: () => void;
    modelURI: string;
    setModelURI: (val: string) => void;
    apiEndpoint: string;
    setApiEndpoint: (val: string) => void;
};

const AdvancedSettingsModal: React.FC<Props> = ({
    open,
    onClose,
    modelURI,
    setModelURI,
    apiEndpoint,
    setApiEndpoint
}) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Advanced Model Settings</DialogTitle>
            <DialogContent>
                
                <Box mb={2} mt={2}>
                    <TextField
                        label="Model/Page URI"
                        fullWidth
                        variant="outlined"
                        value={modelURI}
                        onChange={(e) => setModelURI(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="API Endpoint"
                        fullWidth
                        variant="outlined"
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AdvancedSettingsModal;
