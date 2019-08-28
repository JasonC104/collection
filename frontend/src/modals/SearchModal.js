import React from 'react';
import { Modal } from '.';
import ItemCreationSearch from './ItemCreationSearch';
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
