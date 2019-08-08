import { ActionTypes } from "../actions";

export function itemsReducer(state, action) {
    switch (action.type) {
        case ActionTypes.SET_FILTERED_GAMES:
            return { ...state, filteredGames: action.games };
        default:
            return (state) ? state : { filteredGames: [] };
    }
}
