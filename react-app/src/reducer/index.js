import { MENU_OPEN_CLOSE } from '../action';
import { USER_NAME_SETTING } from '../action';
import { USER_ID_SETTING } from '../action';
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


const UserNameSettingInit = {
    name: JSON.parse(window.localStorage.getItem('userName'))
};
const UserNameSetting = (state = UserNameSettingInit, action) => {
    switch(action.type) {
        case USER_NAME_SETTING:
            return {
                ...state, name: JSON.parse(window.localStorage.getItem('userName'))
            };
        default:
            return state;
    }
}


const UserIdSettingInit = {
    id: JSON.parse(window.localStorage.getItem('userId'))
};
const UserIdSetting = (state = UserIdSettingInit, action) => {
    switch(action.type) {
        case USER_ID_SETTING:
            return {
                ...state, id: JSON.parse(window.localStorage.getItem('userId'))
            };
        default:
            return state;
    }
}


const ReducersApp = combineReducers({
    MenuOpenClose, UserNameSetting, UserIdSetting
});
export default ReducersApp;


