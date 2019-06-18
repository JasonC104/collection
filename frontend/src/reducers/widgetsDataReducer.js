import { ActionTypes } from "../actions";

export function widgetsDataReducer(state, action) {
    switch (action.type) {
        case ActionTypes.ADD_WIDGET_DATA:
            return [...state, action.widgetData];
        case ActionTypes.SET_WIDGETS_DATA:
            return action.widgetsData;
        case ActionTypes.REMOVE_WIDGET_DATA:
            const widgetsData = [...this.state.widgetsData];
            widgetsData.splice(action.index, 1);
            return widgetsData;
        default:
            return (state) ? state : [];
    }
}
