import { MENU_OPEN_CLOSE } from '../action';
import { USER_NAME_SETTING } from '../action';
import { combineReducers } from 'redux';

const UserName = window.localStorage.getItem("UserName");


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


const UserNameSettingInit = {
    name: UserName
};
const UserNameSetting = (state = UserNameSettingInit, action) => {

    switch(action.type) {
        case USER_NAME_SETTING:
            return {
                ...state, name: UserName
            };
        default:
            return state;
    }
}


const ReducersApp = combineReducers({
    MenuOpenClose, UserNameSetting
});
export default ReducersApp;


