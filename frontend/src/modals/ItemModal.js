import React from 'react';
import { connect } from 'react-redux';
import { Actions } from '../actions';
import ItemModalSummary from './ItemModalSummary';
import './styles.scss';

function ItemModal(props) {

    if (!props.itemModal.active) return null;

    const item = props.itemModal.item;
    return (
        <div className={'modal is-active'}>
            <div className='modal-background' onClick={() => props.closeModal()} />
            <div className='modal-card'>
                <header className='modal-card-head'>
                    <p className='modal-card-title'></p>
                    <button className='delete' onClick={() => props.closeModal()} />
                </header>
                <section className='modal-card-body is-flex'>
                    <ItemModalSummary item={item} elements={props.itemModal.elements} />
                </section>
                <footer className='modal-card-foot is-flex-end'>
                    {props.footer}
                </footer>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        itemModal: state.modals.itemModal
    };
}

function mapDispatchToProps(dispatch) {
    return {
        closeModal: () => dispatch(Actions.closeItemModal()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemModal);
