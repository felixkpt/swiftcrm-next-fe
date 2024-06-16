'use client';

import { ActionListType, KnownActionsType, ActionType } from "@/app/components/Autos/autoTypes";
import Link from "next/link";
import { getEndpoint } from "../../Autos/BaseAutoModel/autoFunctions";

type Props = {
    componentId: string;
    record: any;
    actionLabels: Partial<ActionListType>;
    recordEndpoint: string;
    actionType?: ActionType;
};

const AutoRecordActionSection = ({ componentId, record, recordEndpoint, actionLabels, actionType = 'dropdown' }: Props) => {

    if (Object.keys(actionLabels).length === 0) return

    const actionsList = Object.keys(actionLabels) as KnownActionsType[]

    return (
        <>
            {
                actionType === 'dropdown' ?
                    <div className={`dropdown dropdown-bottom dropdowns ${componentId}AutoRecordActionSection`}>
                        <label tabIndex={0} className="btn btn-sm btn-dark m-1">Click</label>
                        <ul tabIndex={0} className="dropdown-content z-[1222] menu p-2 shadow bg-slate-800 rounded-lg w-44">
                            {
                                actionsList.map(actionKey => (
                                    <li
                                        key={`${actionKey}`}
                                        className={`p-1 cursor-pointer rounded`}
                                    >
                                        <Link
                                            data-action={`${actionKey}`}
                                            data-id={record.id}
                                            data-target={getEndpoint(actionLabels, record, recordEndpoint, actionKey)}
                                            href={getEndpoint(actionLabels, record, recordEndpoint, actionKey)}
                                            className={`m-1 ${actionLabels[actionKey].classes}`}
                                        >
                                            {actionLabels[actionKey].label}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    :
                    <div className={`buttons ${componentId}AutoRecordActionSection`}>
                        {
                            actionsList.map(actionKey => (
                                <Link
                                    key={`${actionKey}`}
                                    data-action={`${actionKey}`}
                                    data-id={record.id}
                                    data-target={getEndpoint(actionLabels, record, recordEndpoint, actionKey)}
                                    href={getEndpoint(actionLabels, record, recordEndpoint, actionKey)}
                                    className={`btn btn-sm m-1 ${actionLabels[actionKey].classes}`}
                                >
                                    {actionLabels[actionKey].label}
                                </Link>
                            ))
                        }
                    </div>
            }
        </>
    );
}

export default AutoRecordActionSection;
