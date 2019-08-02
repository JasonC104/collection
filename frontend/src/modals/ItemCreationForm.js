import React from 'react';
import DatePicker from "react-datepicker";
import Rating from "react-rating";
import { FormElement, Icon } from '../elements';
import './styles.scss';

function ItemCreationForm(props) {
    const item = props.item;
    const platformOptions = props.platforms.map(p => <option key={p}>{p}</option>);
    return (
        <div className='is-flex' style={{ width: '100%' }}>
            <div style={{ width: '300px' }}>
                <img className='modal-pic' src={item.image.portrait} alt={item.title} />
            </div>
            <div style={{ marginLeft: '10px', width: '100%' }}>
                <h1 className='title'>{item.title}</h1>

                <FormElement label='Platform'>
                    <div className='select'>
                        <select name='platform' value={item.platform} onChange={(e) => props.handleChange(e)}>
                            {platformOptions}
                        </select>
                    </div>
                </FormElement>

                <FormElement label='Cost'>
                    <div className='control has-icons-left' style={{ width: '100px' }}>
                        <input name='cost' className='input' maxLength='6' type='text' placeholder='0'
                            value={item.cost} onChange={(e) => props.handleChange(e)} />
                        <Icon className='is-left' icon='fas fa-dollar-sign' />
                    </div>
                </FormElement>

                <FormElement label='Type'>
                    <div className="control">
                        <label className="radio">
                            <input name="type" type="radio" value='Physical' onChange={(e) => props.handleChange(e)} />
                            Physical
                        </label>
                        <label className="radio">
                            <input name="type" type="radio" value='Digital' onChange={(e) => props.handleChange(e)} />
                            Digital
                        </label>
                    </div>
                </FormElement>

                <FormElement label='Purchase Date'>
                    <div className='control'>
                        <DatePicker className="input" todayButton={"Today"} selected={item.purchaseDate}
                            dateFormat='MMM dd, yyyy' popperPlacement="right" placeholderText="Click to select a date"
                            onChange={date => props.handleChange({ target: { name: 'purchaseDate', value: date } })} />
                    </div>
                </FormElement>

                <FormElement label='Rating'>
                    <div className='control'>
                        <Rating initialRating={item.rating}
                            emptySymbol="far fa-star fa-lg rating-icon" fullSymbol="fas fa-star fa-lg rating-icon"
                            onChange={value => props.handleChange({ target: { name: 'rating', value } })} />
                    </div>
                </FormElement>

                <FormElement label='Completed'>
                    <div className='control'>
                        <label className="checkbox">
                            <input name='completed' type="checkbox" value={!item.completed}
                                onChange={(e) => props.handleChange(e)} />
                        </label>
                    </div>
                </FormElement>

                <FormElement label='Gift'>
                    <div className='control'>
                        <label className="checkbox">
                            <input name='gift' type="checkbox" value={!item.gift}
                                onChange={(e) => props.handleChange(e)} />
                        </label>
                    </div>
                </FormElement>
            </div>
        </div>
    );
}

export default ItemCreationForm;
