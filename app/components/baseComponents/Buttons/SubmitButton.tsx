type Props = {
    title?: string;
    loading: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    type?: 'primary' | 'success' | 'error' | 'info' | 'warning';
    onClick?: () => void;
};

const SubmitButton = ({ title, loading, size = 'md', type = 'success', onClick }: Props) => {
    const sizeClass = size === 'xs' ? 'btn-xs' : size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : 'btn-md';
    const typeClass = type === 'primary' ? 'btn-primary' :
        type === 'error' ? 'btn-error' :
            type === 'info' ? 'btn-info' :
                type === 'warning' ? 'btn-warning' :
                    'btn-success'; // Default type

    return (
        <div>
            <button className={`btn ${typeClass} ${sizeClass}`} type="submit" disabled={loading} onClick={onClick}
            >
                {loading ? 'Loading...' : title || 'Submit'}
            </button>
        </div>
    );
};

export default SubmitButton;
