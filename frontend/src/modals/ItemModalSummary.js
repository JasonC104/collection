import React from 'react';
import Rating from "react-rating";
import { FormElement, Icon } from '../elements';

function ItemModalSummary(props) {
    const item = props.item;

    const formComponents = props.elements.map(element => {
        const value = item[element.key];
        let component = null;

        if (element.type === 'checkbox') {
            component = (
                <label className="checkbox">
                    <input readOnly type="checkbox" checked={value} />
                </label>
            );
        } else if (element.type === 'text') {
            component = <p>{value}</p>;
        } else if (element.type === 'money') {
            component = (
                <div className='is-flex'>
                    <Icon icon='fas fa-dollar-sign' />
                    <p>{value.toFixed(2)}</p>
                </div>
            );
        } else if (element.type === 'rating') {
            component = <Rating readonly initialRating={value}
                emptySymbol="far fa-star fa-lg rating-icon" fullSymbol="fas fa-star fa-lg rating-icon" />;
        }

        return (
            <FormElement key={element.label} label={element.label}>
                {component}
            </FormElement>
        );
    })

    return (
        <div className='is-flex' style={{ width: '100%' }}>
            <div style={{ width: '300px' }}>
                <img className='modal-pic' src={item.imageUrl} alt={item.title} />
            </div>
            <div style={{ marginLeft: '10px', width: '100%' }}>
                <h1 className='title'>{item.title}</h1>
                {formComponents}
            </div>
        </div>
    );
}

export default ItemModalSummary;
