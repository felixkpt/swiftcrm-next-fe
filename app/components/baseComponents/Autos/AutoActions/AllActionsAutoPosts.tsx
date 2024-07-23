import React from 'react'
import AutoPost from '../AutoPost'

type Props = {
    modelID: string
}

const AllActionsAutoPosts = ({ modelID }: Props) => {
    return (
        <>
            <AutoPost modelID={`${modelID}CreateOrUpdate`} />
            <AutoPost modelID={`${modelID}UpdateStatus`} />
            <AutoPost modelID={`${modelID}Archive`} />
            <AutoPost modelID={`${modelID}Delete`} />
        </>
    )
}

export default AllActionsAutoPosts