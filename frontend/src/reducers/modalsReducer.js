import { ActionTypes } from "../actions";

const defaultState = {
    itemModal: { active: false }
};

export function modalsReducer(state, action) {
    switch (action.type) {
        case ActionTypes.SHOW_ITEM_MODAL:
            return {
                ...state,
                itemModal: {
                    active: true,
                    item: action.item,
                    elements: action.elements
                }
            };
        case ActionTypes.CLOSE_ITEM_MODAL:
            return {
                ...state,
                itemModal: { active: false }
            };
        default:
            return (state) ? state : defaultState;
    }
}