import { ItemListWidget } from '../widgets';

export function createItemList(widgetData, onClick) {
    return {
        type: ItemListWidget,
        props: {
            title: widgetData['Title'],
            items: widgetData.data,
            onClick,
            width: 220,
            height: 350
        }
    }
}
