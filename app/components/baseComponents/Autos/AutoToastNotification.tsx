'use client'
import React, { useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { subscribe } from '../utils/helpers';

type NotificationEvent = CustomEvent & {
    status?: number;
    type?: 'success' | 'info' | 'warning' | 'error';
    data?: { message?: string };
    error?: { message?: string; detail?: string };
};

const AutoToastNotification: React.FC = () => {
    useEffect(() => {
        const unsubscribe = subscribe('autoNotification', handleNotification);

        return () => {
            unsubscribe();
        };
    }, []);

    const handleNotification = useCallback((event: NotificationEvent) => {
        setTimeout(() => {
            if (isDialogOpen()) {
                return; // Don't show toast if a dialog is open
            }

            const eventData = event as unknown as NotificationEvent

            const status = eventData?.status;
            const type = eventData?.type;
            const data = eventData?.data;
            const error = eventData?.error;

            const errorMessage = error?.message || error?.detail;
            const successMessage = data?.message || 'Operation successful';
            console.log(errorMessage, successMessage)
            if (status !== undefined) {
                if (status === 200) {
                    toast.success(successMessage);
                } else if (status >= 400 && status < 500) {
                    toast.warning(errorMessage || 'Client error');
                } else if (status >= 500) {
                    toast.error(errorMessage || 'Server error');
                } else {
                    toast.info('Info notification');
                }
            } else if (type) {
                switch (type) {
                    case 'success':
                        toast.success(successMessage);
                        break;
                    case 'info':
                        toast.info(successMessage || 'Info notification');
                        break;
                    case 'warning':
                        toast.warning(errorMessage || 'Warning notification');
                        break;
                    case 'error':
                        toast.error(errorMessage || 'Error notification');
                        break;
                    default:
                        toast.info('Info notification');
                        break;
                }
            }
        }, 300);
    }, []);

    const isDialogOpen = () => {
        const dialogs = document.querySelectorAll('dialog');
        let isOpen = false;

        dialogs.forEach((dialog) => {
            if (dialog.open) {
                isOpen = true;
                return; // Exit forEach early if a dialog is found open
            }
        });

        return isOpen;
    };

    return (
        <div>
            <ToastContainer
                position="top-right"
                theme="light"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default AutoToastNotification;
