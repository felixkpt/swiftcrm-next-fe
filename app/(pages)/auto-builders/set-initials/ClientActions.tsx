'use client'
import React from 'react'

type Props = {
    runBuilderSeeder: () => void
}

const ClientActions = ({ runBuilderSeeder }: Props) => {
    return (
        <div>
            <ul>
                <li>
                    <button className='btn btn-primary btn-sm' onClick={() => {runBuilderSeeder()}}>Model builder seeder</button>
                    <p>
                        This will run initial models/pages for the app, user model, builder models etc
                    </p>
                </li>
            </ul>
        </div>
    )
}

export default ClientActions