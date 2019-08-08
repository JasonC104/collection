import { GamesApi } from '../api';
import { ItemListWidget } from '../widgets';

export async function createItemList(widgetInfo, onClick) {
    let items = [];
    const widgetType = widgetInfo['Widget'];
    switch (widgetType) {
        case 'Anticipated Games':
            await GamesApi.anticipatedGames(games => {
                items = games;
            });
            break;
        case 'Popular Games':
            await GamesApi.popular(games => {
                items = games;
            });
            break;
        case 'Recently Released Games':
            await GamesApi.recentlyReleased(games => {
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
