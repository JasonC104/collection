import React from 'react';

function Icon(props) {
    const className = props.className ? props.className : '';
    const handleClick = props.onClick ? props.onClick : null;
    return (
        <span className={'icon ' + className} onClick={handleClick}>
            <i className={props.icon}/>
        </span>
    );
}

export default Icon;
