import React from 'react';
import { connect } from 'react-redux';
import { Actions } from '../actions';
import { Modal } from '.';
import ItemModalSummary from './ItemModalSummary';
import './styles.scss';

function ItemModal(props) {
    return (
        <Modal
            active={props.itemModal.active}
            closeModal={props.closeModal}
            body={<ItemModalSummary item={props.itemModal.item} elements={props.itemModal.elements} />}
            footer={props.footer}
        />
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
