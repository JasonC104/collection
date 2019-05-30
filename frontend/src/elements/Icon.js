import React from 'react';

function Icon(props) {
    const className = `icon ${props.className}`;
    const handleClick = props.onClick ? props.onClick : null;
    return (
        <span className={className} onClick={handleClick}>
            <i className={props.icon}/>
        </span>
    );
}

export default Icon;
