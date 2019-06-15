import React from 'react';

function FormElement(props) {
    const bodyClass = props.bodyClass || '';
    return (
        <div className='field is-horizontal' style={{ alignItems: 'center' }}>
            <div className='field-label is-normal is-paddingless'>
                <label className='label'>{props.label}</label>
            </div>
            <div className={'field-body ' + bodyClass}>
                {props.children}
            </div>
        </div>
    );
}

export default FormElement;
