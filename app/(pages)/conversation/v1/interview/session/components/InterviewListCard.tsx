import Link from 'next/link'
import React from 'react'

type Props = {
  interview: any
}

const InterviewListCard = ({ interview }: Props) => {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold">{`Interview ID: ${interview.id}`}</h3>
      <p>Status ID: {interview.status_id}</p>
      <p>Created At: {interview.created_at}</p>
      <p>Updated At: {interview.updated_at}</p>
      <Link
        href={`/conversation-app/interview/results/${interview.id}`}
        className="mt-4 text-blue-500 hover:underline"
      >
        View Details
      </Link>
      <hr className="my-4 border-1 border-gray-300" />
    </div>)
}

export default InterviewListCard