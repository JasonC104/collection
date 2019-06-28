import * as ActionTypes from './actionTypes';

export function changeGameRequirements(requirements) {
    return { type: ActionTypes.CHANGE_GAME_REQUIREMENTS, requirements };
}

export function removeGameRequirements() {
    return { type: ActionTypes.REMOVE_GAME_REQUIREMENTS };
}

export function setFilteredGames(games) {
    return { type: ActionTypes.SET_FILTERED_GAMES, games };
}

export function setGames(games) {
    return { type: ActionTypes.SET_GAMES, games };
}

export function addWidgetData(widgetData) {
    return { type: ActionTypes.ADD_WIDGET_DATA, widgetData };
}

export function setWidgetsData(widgetsData) {
    return { type: ActionTypes.SET_WIDGETS_DATA, widgetsData };
}

export function removeWidgetData(index) {
    return { type: ActionTypes.REMOVE_WIDGET_DATA, index };
}

export function showItemModal(item, elements) {
    return { type: ActionTypes.SHOW_ITEM_MODAL, item, elements };
}

export function updateItemModal(update) {
    return { type: ActionTypes.UPDATE_ITEM_MODAL, update };
}

export function closeItemModal() {
    return { type: ActionTypes.CLOSE_ITEM_MODAL };
}
