import { ActionTypes } from "../actions";

export function itemRequirementsReducer(state, action) {
    switch (action.type) {
        case ActionTypes.CHANGE_GAME_REQUIREMENTS:
            return { ...state, ...action.payload };
        case ActionTypes.REMOVE_GAME_REQUIREMENTS:
            return {};
        default:
            return (state) ? state : {};
    }
}
