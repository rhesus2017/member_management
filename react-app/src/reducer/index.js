import { MENU_OPEN_CLOSE } from '../action';
import { combineReducers } from 'redux';

const MenuOpenCloseInit = {
    open: true 
};

const MenuOpenClose = (state = MenuOpenCloseInit, action) => {
    switch(action.type) {
        case MENU_OPEN_CLOSE:
            return {
                ...state, open: !state.open
            };
        default:
            return state;
    }
}

const MenuOpenCloseApp = combineReducers({
    MenuOpenClose
});

export default MenuOpenCloseApp;