import React from 'react'

type Props = {}

const PageHeader = (props: Props) => {
    return (
        <div>
            <h2 className='cursor-default'>PageHeader</h2>

            <div className="toast toast-top toast-end">
                <div className="alert alert-info">
                    <span>New mail arrived.</span>
                </div>
                <div className="alert alert-success">
                    <span>Message sent successfully.</span>
                </div>
            </div>
        </div>
    )
}

export default PageHeader