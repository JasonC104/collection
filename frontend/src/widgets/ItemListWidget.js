import React from 'react';
import { gameImageResize } from '../helpers';
import './styles.scss';

const modalElements = [
    { key: 'summary', label: 'Description', type: 'text' },
    { key: 'genres', label: 'Genres', type: 'text' },
    { key: 'themes', label: 'Themes', type: 'text' },
    { key: 'platforms', label: 'Platforms', type: 'text' },
    { key: 'releaseDate', label: 'Release Date', type: 'text' },
];

function ItemListWidget(props) {
    const itemComponents = props.items.map(item => {
        const modalItem = {
            ...item,
            imageUrl: gameImageResize(item.imageUrl, 't_720p'),
            platforms: item.platforms.toString(),
            genres: item.genres.toString(),
            themes: item.themes.toString()
        }
        return (
            <div key={item.title} className='widget-item' onClick={() => props.onClick(modalItem, modalElements)}>
                <img className='widget-item-img' src={item.imageUrl} alt={item.title} title={item.title} />
            </div>
        );
    });

    return (
        <div className='is-flex' style={{height: '94%'}}>
            <div className='item-list-widget' style={{ width: props.width }}>
                {itemComponents}
            </div>
        </div>
    );
}

export default ItemListWidget;
