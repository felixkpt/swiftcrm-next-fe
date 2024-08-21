'use client';
import { useEffect, ReactNode, useState } from "react";
import { Modal, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { subscribe } from '@/app/components/baseComponents/utils/pubSub';
import { RequestResponseType } from "../types";

type Props = {
    modelID: string;
    title?: string;
    children: ReactNode;
};

const AutoModal = ({ modelID, title, children }: Props) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleShowModal = () => {
            setOpen(true);
        };

        const unsubscribeShowModal = subscribe(`${modelID}_showModal`, handleShowModal);

        return () => {
            unsubscribeShowModal();
        };
    }, [modelID]);

    useEffect(() => {
        const handleResponse = ({ status }: RequestResponseType) => {
            if (status === 200) {
                setOpen(false);
            }
        };

        const unsubscribe = subscribe(`${modelID}_done`, handleResponse);

        return () => {
            unsubscribe();
        };
    }, [modelID]);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            keepMounted
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 24,
                    p: 4,
                }}
                id={`${modelID}Modal`}
            >
                {title && (
                    <Typography id="modal-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                )}
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                    }}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
                <Box id="modal-description" sx={{ mt: 2 }}>
                    {children}
                </Box>
            </Box>
        </Modal>
    );
};

export default AutoModal;
