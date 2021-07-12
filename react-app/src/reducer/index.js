import { MENU_OPEN_CLOSE } from '../action';
import { USER_NAME_SETTING } from '../action';
import { MEMBER_PAGINATION } from '../action';
import { MESSAGE_PAGINATION } from '../action';
import { RECENT_MESSAGE } from '../action';
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


let MemberPaginationInit = {
    pager: 1
};
const MemberPagination = (state = MemberPaginationInit, action) => {
    switch(action.type) {
        case MEMBER_PAGINATION:
            return {
                ...state, pager: action.payload
            };
        default:
            return state;
    }
}


let MessagePaginationInit = {
    pager: 1
};
const MessagePagination = (state = MessagePaginationInit, action) => {
    switch(action.type) {
        case MESSAGE_PAGINATION:
            return {
                ...state, pager: action.payload
            };
        default:
            return state;
    }
}


let RecentMessageInit = {
    check: false
};
const RecentMessage = (state = RecentMessageInit, action) => {
    switch(action.type) {
        case RECENT_MESSAGE:
            return {
                ...state, check: action.payload
            };
        default:
            return state;
    }
}


const ReducersApp = combineReducers({
    MenuOpenClose, UserNameSetting, MemberPagination, MessagePagination, RecentMessage
});


export default ReducersApp;
