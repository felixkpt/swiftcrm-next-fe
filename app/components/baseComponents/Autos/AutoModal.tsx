'use client'
import { useEffect, useRef } from "react";
import { subscribe } from '@/app/components/baseComponents/utils/pubSub';
import { RequestResponseType } from "../types";

type Props = {
    modelID: string;
    title?: string;
    children: React.ReactNode;
};

const AutoModal = ({ modelID, title, children }: Props) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const handleShowModal = () => {
            if (modalRef.current) {
                modalRef.current.showModal();
            }
        };

        const unsubscribeShowModal = subscribe(`${modelID}_showModal`, handleShowModal);

        return () => {
            unsubscribeShowModal();
        };
    }, [modelID]);

    useEffect(() => {
        const handleResponse = ({ status }: RequestResponseType) => {
            if (status === 200) {
                closeModal();
            }
        };

        const unsubscribe = subscribe(`${modelID}_done`, handleResponse);

        return () => {
            unsubscribe();
        };
    }, [modelID]);

    const closeModal = () => {
        if (modalRef.current) {
            modalRef.current.close();
        }
    };

    return (
        <div>
            <dialog ref={modalRef} id={`${modelID}Modal`} className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
                    </form>
                    <div className='my-3'>{children}</div>
                </div>
            </dialog>
        </div>
    );
};

export default AutoModal;
