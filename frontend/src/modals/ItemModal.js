import React from 'react';
import { Modal } from '.';
import { Form, Icon, TwoClickButton } from '../elements';
import './styles.scss';

/**
 * @param {{item: any, schema: [any], onDelete: function, header: any}} props 
 */
export default function ItemModal(props) {
    return (
        <Modal
            title=''
            header={props.header}
            body={<Form item={props.item} schema={props.schema} onChange={props.onUpdate} />}
            footer={
                <TwoClickButton className='is-danger' onClick={props.onDelete}>
                    <Icon icon='fas fa-trash' />
                </TwoClickButton>
            }
        />
    );
}
