export const MENU_OPEN_CLOSE = 'MENU_OPEN_CLOSE';
export const USER_NAME_SETTING = 'USER_NAME_SETTING';

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