import React, { useState } from 'react';
import WidgetCreationForm from './WidgetCreationForm';
import { Modal } from '.';
import { FormElement } from '../elements';
import './styles.scss';

export default function WidgetCreationModal(props) {
    const [widget, setWidget] = useState(null);
    const [widgetInfo, setWidgetInfo] = useState({});
    const onChange = (e) => setWidgetInfo({ ...widgetInfo, [e.target.name]: e.target.value });
    const previewWidget = (e) => {
        e.preventDefault();
        props.calculateWidgetData([widgetInfo]).then(widgets => {
            if (widgets.length === 1 && widgets[0]) {
                const widget = widgets[0];
                widget.props.onClick = null;
                setWidget(widget);
                setWidgetInfo({ ...widgetInfo, 'Title': getDefaultTitle(widgetInfo) });
            }
        });
    }
    const addWidget = () => props.addWidget(widgetInfo, widget);

    let widgetPreview = null;
    let enableAddWidgetButton = false;
    if (widget) {
        widgetPreview = (
            <div key='widgetPreview' className='widget-preview'>
                <FormElement key='Title' label='Title'>
                    <input name='Title' className='input' type='text' autoComplete="off"
                        value={widgetInfo['Title'] || ''} onChange={onChange} />
                </FormElement>
                {React.createElement(widget.type, widget.props)}
            </div>
        );
        enableAddWidgetButton = true;
    }

    return (
        <form onSubmit={previewWidget}>
            <Modal
                title='Create a new widget'
                header={props.header}
                body={[
                    <WidgetCreationForm key='WidgetCreationForm' widgetInfo={widgetInfo} handleChange={onChange} />,
                    widgetPreview
                ]}
                footer={[
                    <input key='PreviewWidgetButton' className='button is-success' type="submit" value="Preview Widget" />,
                    <button key='AddWidgetButton' className='button is-success' disabled={!enableAddWidgetButton} onClick={addWidget}>
                        Add Widget
                    </button>
                ]}
            />
        </form>
    );
}

function getDefaultTitle(widgetInfo) {
    let dataSet = '';
    switch (widgetInfo['Data Set']) {
        case 'games':
            dataSet = 'Games';
            break;
        case 'movies':
            dataSet = 'Movies';
            break;
        default:
    }
    switch (widgetInfo['Chart Type']) {
        case 'PieWidget': return `${dataSet} Pie Chart`;
        case 'BarWidget': return `${dataSet} Bar Chart`;
        default:
    }
    if (widgetInfo['Widget'])
        return `${widgetInfo['Widget']} ${dataSet}`;

    return '';
}
