import * as ItemApi from '../api/itemApi';
import { ItemListWidget } from '../widgets';

export async function createItemList(widgetInfo, onClick) {
    let items = [];
    const widgetType = widgetInfo['Widget'];
    switch (widgetType) {
        case 'Anticipated Games':
            await ItemApi.anticipatedGames(games => {
                items = games;
            });
            break;
        case 'Highly Rated Games':
            await ItemApi.highlyRated(games => {
                items = games;
            });
            break;
        default:
            break;
    }

    return {
        type: ItemListWidget,
        props: {
            title: widgetType,
            items,
            onClick,
            width: 220,
            height: 350
        }
    }
}
