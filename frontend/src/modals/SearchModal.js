import React from 'react';
import ItemCreationSearch from './ItemCreationSearch';
import Modal from './Modal2';
import './styles.scss';

export default function SearchModal(props) {
    return (
        <Modal
            title={props.title}
            header={props.header}
            body={
                <ItemCreationSearch searchText={props.itemTitle} searchResults={props.searchResults}
                    nextStep={props.doneSearch} search={props.search} />
            }
            footer={props.footer}
        />
    );
}
