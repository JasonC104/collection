import React from 'react';

function Icon(props) {
    const title = props.title ? props.title : '';
    const className = props.className ? props.className : '';
    const handleClick = props.onClick ? props.onClick : null;
    return (
        <span title={title} className={'icon ' + className} onClick={handleClick}>
            <i className={props.icon} />
        </span>
    );
}

export default Icon;
