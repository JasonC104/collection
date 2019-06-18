import React from 'react';
import { FormElement } from '../elements';

const fieldLabels = {
    'chart': 'Chart',
    'news': 'News',
    'other': 'Other',
    'games': 'Games',
    'movies': 'Movies',
    'BarWidget': 'Bar',
    'PieWidget': 'Pie',
    'platform': 'Platform',
    'completed': 'Completed',
    'gift': 'Gift',
    'type': 'Type',
    'cost': 'Cost',
    'purchaseDate': 'Purchase Date',
};

const formFields = [{
    options: ['chart', 'news', 'other'],
    label: 'Widget Type',
    chart: [{
        options: ['games', 'movies'],
        label: 'Data Set',
    },
    {
        options: ['PieWidget', 'BarWidget'],
        label: 'Chart Type',
        PieWidget: [{
            options: ['platform', 'completed', 'gift'],
            label: 'Attribute'
        }],
        BarWidget: [{
            options: ['platform', 'type', 'cost'],
            label: 'Attribute'
        }, {
            options: ['purchaseDate'],
            label: 'X-Axis',
            'purchaseDate': [{
                options: [3, 6, 12],
                label: 'Duration'
            }]
        }],
    }],
    news: [],
    other: []
}];

function getLabel(field) {
    return fieldLabels[field];
}

/* TODO
    colours template
*/

class WidgetCreationForm extends React.Component {

    constructor(props) {
        super(props);
    }

    generateFormElements(fields) {
        const widgetInfo = this.props.widgetInfo;
        let form = [];
        let selectedAll = true;
        fields.forEach(field => {
            // Set the select dropdown value if it exists
            let selectedValue = '';
            if (widgetInfo[field.label]) {
                selectedValue = widgetInfo[field.label];
            } else {
                // boolean for checking if all select dropdowns have values
                selectedAll = false;
            }

            const options = field.options.map(option => {
                const label = getLabel(option) || option;
                return <option key={label} value={option}>{label}</option>;
            });
            // add an initial null option
            options.unshift(<option key='null-option' hidden defaultValue value=''>Select an option</option>)

            form.push(
                <FormElement key={field.label} label={field.label} bodyClass='is-flex-grow-2'>
                    <div className='select'>
                        <select required name={field.label} value={selectedValue} onChange={e => this.props.handleChange(e)}>
                            {options}
                        </select>
                    </div>
                </FormElement>
            );
        });

        // if all form elements have been filled
        if (selectedAll) {
            fields.forEach(field => {
                const selectedField = field[widgetInfo[field.label]];
                if (selectedField) {
                    form = form.concat(this.generateFormElements(selectedField));
                }
            });
        }
        return form;
    }

    render() {
        const form = this.generateFormElements(formFields);
        return (
            <div style={{ width: '50%' }}>
                {form}
            </div>
        );
    }
}

export default WidgetCreationForm;
