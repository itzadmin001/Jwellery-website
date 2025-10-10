import React from 'react'

function Card(props) {
    return (
        <div className='shadow min-h-screen rounded py-8'>
            {props.children}
        </div>
    )
}

export default Card
