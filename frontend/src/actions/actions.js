import * as ActionTypes from './actionTypes';

export function setGames(games) {
    return { type: ActionTypes.SET_GAMES, payload: games };
}
