'use client';

import React, { useState, MouseEvent } from 'react';
import { Button, Menu, MenuItem, IconButton, Typography } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import Link from 'next/link';
import { getEndpoint } from "../../Autos/BaseAutoModel/autoFunctions";
import { Visibility as VisibilityIcon, Edit as EditIcon, Update as UpdateIcon, Archive as ArchiveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ActionListType, ActionType, KnownActionsType } from '../../Autos/BaseAutoModel/types';

type Props = {
    modelID: string;
    record: any;
    actionLabels: Partial<ActionListType>;
    recordEndpoint: string;
    actionType?: ActionType;
    handleActionClick: (actionKey: KnownActionsType, record: any, recordEndpoint: string) => void,
};

const iconMapping: Record<KnownActionsType, React.ReactNode> = {
    viewRecord: <VisibilityIcon />,
    editRecord: <EditIcon />,
    updateRecordStatus: <UpdateIcon />,
    archiveRecord: <ArchiveIcon />,
    deleteRecord: <DeleteIcon />,
};

const AutoRecordActionSection = ({ modelID, record, recordEndpoint, actionLabels, actionType = 'dropdown', handleActionClick }: Props) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    if (Object.keys(actionLabels).length === 0) return null;

    const actionsList = Object.keys(actionLabels) as KnownActionsType[];

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const prehandleActionClick = (
        e: MouseEvent<HTMLElement>,
        actionKey: KnownActionsType,
        record: string
    ) => {
        setAnchorEl(null);
            e.preventDefault();
            handleActionClick(actionKey, record, recordEndpoint);
    };

    return (
        <div className={`buttons ${modelID}AutoRecordActionSection`}>

            {actionType === 'dropdown' ? (
                <>
                    <IconButton
                        aria-controls="action-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                        color="primary"
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="action-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        {actionsList.map(actionKey => (
                            <MenuItem
                                key={actionKey}
                                onClick={(e) => prehandleActionClick(e, actionKey, record)}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'start',
                                    alignItems: 'center',
                                    gap: '0.04rem'
                                }}
                            >
                                {iconMapping[actionKey]}
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                    {actionLabels[actionKey]?.label}
                                </Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </>
            ) : (
                <div>
                    {actionsList.map(actionKey => (
                        <Button
                            key={actionKey}
                            component={Link}
                            data-href={getEndpoint(actionLabels, record, recordEndpoint, actionKey)}
                            data-action={actionKey}
                            data-id={record.id}
                            data-target={getEndpoint(actionLabels, record, recordEndpoint, actionKey)}
                            variant="contained"
                            color="primary"
                            style={{ margin: '4px' }}
                        >
                            {actionLabels[actionKey]?.label}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AutoRecordActionSection;
