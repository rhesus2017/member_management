export const MENU_OPEN_CLOSE = 'MENU_OPEN_CLOSE';
export const USER_NAME_SETTING = 'USER_NAME_SETTING';
export const MEMBER_PAGINATION = 'MEMBER_PAGINATION';
export const MESSAGE_PAGINATION = 'MESSAGE_PAGINATION';
export const RECENT_MESSAGE = 'RECENT_MESSAGE';

export function MenuOpenClose() {
    return {
        type: MENU_OPEN_CLOSE
    };
}
export function UserNameSetting() {
    return {
        type: USER_NAME_SETTING
    };
}
export function MemberPagination(pager) {
    return {
        type: MEMBER_PAGINATION,
        payload: pager
    };
}
export function MessagePagination(pager) {
    return {
        type: MESSAGE_PAGINATION,
        payload: pager
    };
}
export function RecentMessage(check) {
    return {
        type: RECENT_MESSAGE,
        payload: check
    };
}