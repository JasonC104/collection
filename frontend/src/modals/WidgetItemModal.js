import React from 'react';
import { Modal } from '.';
import { Form } from '../elements';
import './styles.scss';

/**
 * @param {{item: any, schema: [any], onDelete: function, header: any}} props 
 */
export default function ItemModal(props) {
    return (
        <Modal
            title=''
            header={props.header}
            body={<Form item={props.item} schema={props.schema} onChange={null} />}
            footer={
                <button className='button is-success'>
                    <p>Add to Wishlist</p>
                </button>
            }
        />
    );
}
