import React from 'react';

function Steps(props) {
    const stepElements = props.stepData.map((data, index) => {
        const [marker, text] = data;
        const activeClass = (index === props.currentStep) ? 'is-active' : '';
        return (
            <li key={index} className={'steps-segment ' + activeClass}>
                <span className="steps-marker">{marker}</span>
                <div className="steps-content">
                    <p className='is-size-7'>{text}</p>
                </div>
            </li>
        );
    });
    const style = { width: '120%' };
    return (
        <ul className={'steps has-content-centered has-gaps is-marginless ' + props.className} style={style}>
            {stepElements}
        </ul>
    );
}

export default Steps;
