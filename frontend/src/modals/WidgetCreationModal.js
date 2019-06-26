import React from 'react';
import { connect } from 'react-redux';
import WidgetCreationForm from './WidgetCreationForm';
import { ChartCreator, WidgetCreator } from '../helpers';

class WidgetCreationModal extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = { widgetInfo: {}, showWidget: false, widget: {} }
        this.state = { ...this.initialState };
    }

    handleChange(e) {
        const { name, value } = e.target;
        const widgetInfo = {
            ...this.state.widgetInfo,
            [name]: value
        };
        this.setState({ widgetInfo });
    }

    addWidgetToDashboard() {
        this.props.addWidget(this.state.widgetInfo, this.state.widget);
        this.props.closeModal();
        this.setState({ ...this.initialState });
    }

    previewWidget(e) {
        e.preventDefault();

        const widgetInfo = this.state.widgetInfo;
        switch (widgetInfo['Widget Type']) {
            case 'chart':
                const dataset = this.props[widgetInfo['Data Set']];
                const widget = ChartCreator.createWidgetData(dataset, widgetInfo, null);
                this.setState({ showWidget: true, widget });
                break;
            case 'news':
                break;
            case 'other':
                WidgetCreator.createItemList(widgetInfo, () => { }).then(widget => {
                    this.setState({ showWidget: true, widget });
                });
                break;
            default:
        }
        return null;
    }

    render() {

        const props = this.props;
        const active = props.active ? 'is-active' : '';
        let widget = <div></div>;
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
                        <WidgetCreationForm widgetInfo={this.state.widgetInfo} handleChange={e => this.handleChange(e)} />
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
