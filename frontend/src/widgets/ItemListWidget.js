import React from 'react';
import { gameImageResize } from '../helpers';
import './styles.scss';

const modalElements = [
    { key: 'summary', label: 'Description', type: 'text' },
    { key: 'platforms', label: 'Platforms', type: 'text' },
    { key: 'releaseDate', label: 'Release Date', type: 'text' }
];

function ItemListWidget(props) {
    const itemComponents = props.items.map(item => {
        const modalItem = { 
            ...item, 
            imageUrl: gameImageResize(item.imageUrl, 't_720p'),
            platforms: item.platforms.toString()
        }
        return (
            <div key={item.title} className='widget-item' onClick={() => props.showModal(modalItem, modalElements)}>
                <img className='widget-item-img' src={item.imageUrl} alt={item.title} />
            </div>
        );
    });

    return (
        <div>
            <h1 className="title is-6 is-marginless">{props.title}</h1>
            <div className='item-list-widget' style={{ width: props.width, height: props.height }} >
                {itemComponents}
            </div>
        </div>
    );
}

export default ItemListWidget;
