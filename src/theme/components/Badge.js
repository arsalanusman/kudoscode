import React from 'react';

const Badge = ({ title,img,url,slug }) => {
    return (
        <div className="badge">
            <div className="badge_content">
                <a className="url-i" href={url}>{slug}</a>
                <p>{title}</p>
            </div>
            <img src={img} alt={title} />
        </div>
    );
}

export default Badge;

