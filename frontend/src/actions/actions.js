import * as ActionTypes from './actionTypes';

export function changeGameRequirements(requirements) {
    return { type: ActionTypes.CHANGE_GAME_REQUIREMENTS, payload: requirements };
}

export function removeGameRequirements() {
    return { type: ActionTypes.REMOVE_GAME_REQUIREMENTS };
}

export function setFilteredGames(games) {
    return { type: ActionTypes.SET_FILTERED_GAMES, payload: games };
}

export function setGames(games) {
    return { type: ActionTypes.SET_GAMES, payload: games };
}
