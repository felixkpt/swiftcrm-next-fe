import Link from "next/link";
import { publish } from "../utils/helpers";

type AutoHeaderProps = {
    headerTitle: string;
    description?: string;
    modelID: string;
    showCreateButton?: boolean;
    createUri?: string; // Optional parameter for the create page URI
};

const AutoHeader = ({ headerTitle, description, modelID, showCreateButton, createUri }: AutoHeaderProps) => {
    const handleCreateClick = () => {
        publish(`${modelID}_newRecord`, null);
        publish(`${modelID}_showModal`, null);
    };

    return (
        <div className="flex items-center justify-between my-4">
            <div>
                <h2 className="text-2xl font-semibold">{headerTitle}</h2>
                {description && <p className="text-gray-500">{description}</p>}
            </div>
            {
                createUri ?
                    <Link href={createUri} className="btn btn-success btn-sm">
                        Create new
                    </Link>
                    :
                    (
                        showCreateButton && (
                            <button className="btn btn-success btn-sm" onClick={handleCreateClick}>
                                Create new
                            </button>
                        )
                    )}
        </div>
    );
};

export default AutoHeader;
