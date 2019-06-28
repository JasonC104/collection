import React from 'react';
import './styles.scss';

function ItemListWidget(props) {
    const itemComponents = props.items.map(item => {
        return (
            <div key={item.title} className='widget-item' onClick={() => props.onClick(item)}>
                <img className='widget-item-img' src={item.imageUrl} alt={item.title} title={item.title} />
            </div>
        );
    });

    return (
        <div className='item-list-widget' style={{ width: props.width, height: '94%' }}>
            {itemComponents}
        </div>
    );
}

export default ItemListWidget;
