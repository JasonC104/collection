import { ActionTypes } from "../actions";

export function itemsReducer(state, action) {
    switch (action.type) {
        case ActionTypes.SET_FILTERED_GAMES:
            return { ...state, filteredGames: action.games };
        case ActionTypes.SET_GAMES:
            return { ...state, games: action.games, filteredGames: action.games };
        default:
            return (state) ? state : { games: [], filteredGames: [] };
    }
}
