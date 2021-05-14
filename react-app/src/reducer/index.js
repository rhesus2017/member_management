import { MENU_OPEN_CLOSE } from '../action';
import { combineReducers } from 'redux';

const MenuInitialState = {
    open: true 
};

const MenuClick = (state = MenuInitialState, action) => {
    switch(action.type) {
        case MENU_OPEN_CLOSE:
            return {
                ...state, open: !state.open
            };
        default:
            return state;
    }
}

const MenuClickApp = combineReducers({
    MenuClick
});

export default MenuClickApp;