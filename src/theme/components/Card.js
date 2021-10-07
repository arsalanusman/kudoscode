import React from 'react';

const Card = (state ) => {
    return (
       <div className="round-col">{state.children}</div>
    );
}

export default Card;

