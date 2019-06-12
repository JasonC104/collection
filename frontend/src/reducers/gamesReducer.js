import { ActionTypes } from "../actions";

export function gamesReducer(state, action) {
    switch (action.type) {
        case ActionTypes.SET_GAMES:
            return action.payload;
        default:
            return (state) ? state : [];
    }
}
