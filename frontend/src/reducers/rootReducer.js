import { combineReducers } from 'redux';
import { itemRequirementsReducer } from './itemRequirementsReducer';
import { itemsReducer } from './itemsReducer';
import { modalsReducer } from './modalsReducer';
import { widgetsDataReducer } from './widgetsDataReducer';

export const rootReducer = combineReducers({
    itemRequirements: itemRequirementsReducer,
    items: itemsReducer,
    modals: modalsReducer,
    widgetsData: widgetsDataReducer
});
