import { MENU_OPEN_CLOSE } from '../action';
import { USER_NAME_SETTING } from '../action';
import { GET_PAGINATION } from '../action';
import { combineReducers } from 'redux';


const getStorage = (item) => { return JSON.parse(window.localStorage.getItem(item)) }


let MenuOpenCloseInit = {
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


let UserNameSettingInit = {
    name: getStorage('userName')
};
const UserNameSetting = (state = UserNameSettingInit, action) => {
    switch(action.type) {
        case USER_NAME_SETTING:
            return {
                ...state, name: getStorage('userName')
            };
        default:
            return state;
    }
}


let GetPaginationInit = {
    pager: 1
};
const GetPagination = (state = GetPaginationInit, action) => {
    switch(action.type) {
        case GET_PAGINATION:
            return {
                ...state, pager: action.payload
            };
        default:
            return state;
    }
}


const ReducersApp = combineReducers({
    MenuOpenClose, UserNameSetting, GetPagination
});


export default ReducersApp;
