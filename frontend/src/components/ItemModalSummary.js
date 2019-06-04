import React from 'react';
import Rating from "react-rating";
import { FormElement, Icon } from '../elements';

function ItemModalSummary(props) {
    const item = props.item;
    return (
        <div className='is-flex' style={{ width: '100%' }}>
            <div style={{ width: '300px' }}>
                <img className='modal-pic' src={item.imageUrl} alt={item.title} />
            </div>
            <div style={{ marginLeft: '10px', width: '100%' }}>
                <h1 className='title'>{item.title}</h1>

                <FormElement label='Platform'>
                    <p>{item.platform}</p>
                </FormElement>

                <FormElement label='Cost'>
                    <Icon icon='fas fa-dollar-sign' />
                    <p>{item.cost}</p>
                </FormElement>

                <FormElement label='Type'>
                    <p>{item.type}</p>
                </FormElement>

                <FormElement label='Purchase Date'>
                    <p>{item.purchaseDate}</p>
                </FormElement>

                <FormElement label='Rating'>
                    <Rating readonly initialRating={item.rating} emptySymbol="far fa-star fa-lg rating-icon"
                        fullSymbol="fas fa-star fa-lg rating-icon" />
                </FormElement>

                <FormElement label='Completed'>
                    <label className="checkbox">
                        <input readOnly name='completed' type="checkbox" checked={item.completed} />
                    </label>
                </FormElement>

                <FormElement label='Gift'>
                    <label className="checkbox">
                        <input readOnly name='gift' type="checkbox" checked={item.gift} />
                    </label>
                </FormElement>
            </div>
        </div>
    );
}

export default ItemModalSummary;
