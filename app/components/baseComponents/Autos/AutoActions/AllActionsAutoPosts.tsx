import React from 'react'
import AutoPost from '../AutoPost'

type Props = {
    modelID: string
}

const AllActionsAutoPosts = ({ modelID }: Props) => {
    return (
        <>
            <AutoPost modelID={`${modelID}_CreateOrUpdate`} />
            <AutoPost modelID={`${modelID}_UpdateStatus`} />
            <AutoPost modelID={`${modelID}_Archive`} />
            <AutoPost modelID={`${modelID}_Delete`} />
        </>
    )
}

export default AllActionsAutoPosts