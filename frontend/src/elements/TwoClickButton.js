import React, { useState } from 'react';

export default function TwoClickButton(props) {

    const [clicked, setClicked] = useState(false);

    const buttonClick = () => {
        if (clicked) {
            setClicked(false);
            props.onClick();
        } else {
            setClicked(true);
        }
    }

    const activeTooltip = (clicked) ? 'tooltip' : '';
    const className = (props.className) ? props.className : '';
    return (
        <button className={`button is-tooltip-left ${activeTooltip} ${className}`}
            data-tooltip='Click again to confirm' onClick={buttonClick}>
            {props.children}
        </button>
    );
}
