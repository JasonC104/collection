import { ActionTypes } from "../actions";

const initialState = { gameRequirements: {} };

export function itemRequirementsReducer(state, action) {
    switch (action.type) {
        case ActionTypes.CHANGE_GAME_REQUIREMENTS:
            return { ...state, gameRequirements: action.requirements };
        case ActionTypes.REMOVE_GAME_REQUIREMENTS:
            return initialState;
        default:
            return (state) ? state : initialState;
    }
}
