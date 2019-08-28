import React, { useState } from 'react';
import { Modal } from '.';
import { Form, Icon } from '../elements';
import './styles.scss';

export default function FormModal(props) {

    const [item, setItem] = useState(props.item);
    const onChange = (e) => setItem({ ...item, [e.target.name]: e.target.value });

    const enableSave = props.validateItem(item);

    return (
        <Modal
            title={props.title}
            header={props.header}
            body={<Form item={item} schema={props.schema} onChange={onChange} />}
            footer={[
                <button key='back' className='button is-danger' onClick={() => props.previousStep(item)}>
                    Back
                </button>,
                <button key='save' className='button is-success' disabled={!enableSave} onClick={() => props.createItem(item)}>
                    <Icon icon='fas fa-save' />
                </button>
            ]}
        />
    );
}
