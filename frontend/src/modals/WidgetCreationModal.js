import React from 'react';
import { connect } from 'react-redux';
import WidgetCreationForm from './WidgetCreationForm';
import { ChartCreator } from '../helpers';

class WidgetCreationModal extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = { widgetData: {}, showWidget: false, widget: {} }
        this.state = { ...this.initialState };
    }

    handleChange(e) {
        const { name, value } = e.target;
        const widgetData = {
            ...this.state.widgetData,
            [name]: value
        };
        this.setState({ widgetData });
    }

    addWidgetToDashboard() {
        this.props.addWidget(this.state.widget);
        this.props.closeModal();
        this.setState({ ...this.initialState });
    }

    previewWidget(e) {
        e.preventDefault();
        console.log(this.state.widgetData);

        const widgetData = this.state.widgetData;
        switch (widgetData['Widget Type']) {
            case 'chart':
                const dataset = this.props[widgetData['Data Set']];
                const widget = ChartCreator.createWidgetData(dataset, widgetData['Chart Type'], widgetData['Attribute'], null);
                widget.props.width = 200;
                widget.props.height = 200;
                this.setState({ showWidget: true, widget });
                break;
            case 'news':
                break;
            default:
        }
        return null;
    }

    render() {

        const props = this.props;
        const active = props.active ? 'is-active' : '';
        let widget = null;
        let enableAddWidgetButton = false;
        if (this.state.showWidget) {
            widget = React.createElement(this.state.widget.type, this.state.widget.props);
            enableAddWidgetButton = true;
        }

        return (
            <div className={'modal ' + active}>
                <div className='modal-background' onClick={() => props.closeModal()} />
                <form className='modal-card' style={{ width: '80%', height: '80%' }} onSubmit={e => this.previewWidget(e)}>
                    <header className='modal-card-head'>
                        <p className='modal-card-title'>Create a new widget</p>
                        <button className='delete' onClick={() => props.closeModal()} />
                    </header>
                    <section className='modal-card-body is-flex'>
                        <WidgetCreationForm selected={this.state.widgetData} handleChange={e => this.handleChange(e)} />
                        {widget}
                    </section>
                    <footer className='modal-card-foot is-flex-end'>
                        <input className='button is-success' type="submit" value="Preview Widget" />
                        <button className='button is-success' disabled={!enableAddWidgetButton} onClick={() => this.addWidgetToDashboard()}>
                            Add Widget
                        </button>
                    </footer>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        games: state.items.games
    };
}

export default connect(mapStateToProps)(WidgetCreationModal);
