import { ActionTypes } from "../actions";

export function itemsReducer(state, action) {
    switch (action.type) {
        case ActionTypes.SET_FILTERED_GAMES:
            return { ...state, filteredGames: action.payload };
        case ActionTypes.SET_GAMES:
            return { ...state, games: action.payload, filteredGames: action.payload };
        default:
            return (state) ? state : { games: [], filteredGames: [] };
    }
}
