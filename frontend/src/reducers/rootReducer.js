import { combineReducers } from 'redux';
import { itemRequirementsReducer } from './itemRequirementsReducer';
import { itemsReducer } from './itemsReducer';

export const rootReducer = combineReducers({
    itemRequirements: itemRequirementsReducer,
    items: itemsReducer,
});
