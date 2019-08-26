import React from 'react';
import DatePicker from "react-datepicker";
import Rating from "react-rating";
import { FormElement, Icon } from '.';

/**
 * 
 * @param {{
 *  item: any,
 *  schema: {type: string, key: string, label: string, readonly: boolean}, 
 *  onChange: function
 * }} props 
 */
export default function Form(props) {
    const item = props.item;
    const formComponents = props.schema.map(schema => {
        if (!schema.readonly) schema.readonly = false;
        return getFormElement(item, schema, props.onChange)
    });

    return (
        <div className='is-flex' style={{ width: '100%' }}>
            <div style={{ width: '300px' }}>
                <img className='modal-pic' src={item.image.portrait} alt={item.title} />
            </div>
            <div style={{ marginLeft: '10px', width: '100%' }}>
                <h1 className='title'>{item.title}</h1>
                {formComponents}
            </div>
        </div>
    );
}

function getFormElement(item, schema, onChange) {
    const props = { value: item[schema.key], schema, onChange };
    let body;
    switch (schema.type) {
        case 'text':
            body = <FormText {...props} />;
            break;
        case 'money':
            body = <FormMoney {...props} />;
            break;
        case 'checkbox':
            body = <FormCheckbox {...props} />;
            break;
        case 'radio':
            body = <FormRadioButtons {...props} />;
            break;
        case 'list':
            body = <FormList {...props} />;
            break;
        case 'rating':
            body = <FormRating {...props} />;
            break;
        case 'date':
            body = <FormDate {...props} />;
            break;
        default:
            return;
    }
    return <FormElement key={schema.label} label={schema.label}>
        {body}
    </FormElement>;
}

function FormText(props) {
    if (props.schema.readonly) {
        return <p>{props.value}</p>;
    } else {
        return <input name={props.schema.key} className='input' type='text' placeholder='' autoComplete='off'
            value={props.value} onChange={props.onChange} />;
    }
}

function FormMoney(props) {
    if (props.schema.readonly) {
        return (
            <div className='is-flex'>
                <Icon icon='fas fa-dollar-sign' />
                <p>{props.value.toFixed(2)}</p>
            </div>
        );
    } else {
        return (
            <div className='control has-icons-left' style={{ width: '100px' }}>
                <input name={props.schema.key} className='input' maxLength='6' type='text' placeholder='0'
                    autoComplete='off' value={props.value} onChange={props.onChange} />
                <Icon className='is-left' icon='fas fa-dollar-sign' />
            </div>
        );
    }
}

// TODO Test if this works with the readonly prop
function FormCheckbox(props) {
    const onChange = (e) => props.onChange(
        { target: { name: props.schema.key, value: (e.target.value === 'on') } }
    );
    return (
        <label className="checkbox">
            <input name={props.schema.key} type="checkbox" checked={props.value}
                readOnly={props.schema.readonly} onChange={onChange} />
        </label>
    );
}

function FormRadioButtons(props) {
    const radioButtons = props.schema.options.map(o =>
        <label key={o} className="radio">
            <input name={props.schema.key} type="radio" value={o}
                readOnly={props.schema.readonly} onChange={props.onChange} />
            {o}
        </label>
    );
    return (
        <div className="control">
            {radioButtons}
        </div>
    );
}

function FormList(props) {
    if (props.schema.readonly) {
        return <p>{props.value.toString()}</p>;
    } else {
        const options = props.schema.options.map(o => <option key={o}>{o}</option>);
        return (
            <div className='select'>
                <select name={props.schema.key} value={props.value} onChange={props.onChange}>
                    {options}
                </select>
            </div>
        );
    }
}

// TODO Test if this works with the readonly prop
function FormRating(props) {
    return <Rating readonly={props.schema.readonly} placeholderRating={props.value}
        onChange={value => props.onChange({ target: { name: props.schema.key, value } })}
        emptySymbol="far fa-star fa-lg rating-icon" fullSymbol="fas fa-star fa-lg has-text-link" placeholderSymbol="fas fa-star fa-lg rating-icon" />;
}

/**
 * This Component cannot be readonly
 * @param {*} props 
 */
function FormDate(props) {
    return <DatePicker className="input" todayButton="Today" selected={props.value}
        dateFormat='MMM dd, yyyy' popperPlacement="right" placeholderText="Click to select a date"
        onChange={value => props.onChange({ target: { name: props.schema.key, value } })} />
}
