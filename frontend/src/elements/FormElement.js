import React from 'react';

function FormElement(props) {
    return (
        <div className='field is-horizontal' style={{ alignItems: 'center' }}>
            <div className='field-label is-normal is-paddingless'>
                <label className='label'>{props.label}</label>
            </div>
            <div className='field-body'>
                {props.children}
            </div>
        </div>
    );
}

export default FormElement;
