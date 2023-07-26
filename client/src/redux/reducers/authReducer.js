const SET_WALLET_CONNECTION_URL = 'SET-WALLET_CONNECTION_URL';
const SET_WALLET = 'SET-WALLET';
const AUTH_WALLET = 'AUTH-WALLET';
const SET_CONNECTION_RESTORED = 'SET-CONNECTION-RESTORED';
const SET_AUTH_USER_ID = 'SET-AUTH-USER_ID';
const SET_UNREAD_DIALOG = 'SET-UNREAD-DIALOG';
const SET_UNREAD_NOTIFY = 'SET-UNREAD-NOTIFY';
const SET_UPDATE_SETTINGS = 'SET-UPDATE-SETTINGS';
const SET_UPDATE_SOCIAL = 'SET-UPDATE-SOCIAL';
const CHANGE_AUTH_AVATAR = 'CHANGE-AUTH-AVATAR';

let initState = {
    walletList: [
        {
            name: 'Tonkeeper',
            bridgeUrl: 'https://bridge.tonapi.io/bridge',
            universalLink: 'https://app.tonkeeper.com/ton-connect',
            walletJsBridgeKey: 'tonkeeper',
        },
        {
            name: 'Tonhub',
            bridgeUrl: 'https://connect.tonhubapi.com/tonconnect',
            universalLink: 'https://tonhub.com/ton-connect',
            walletJsBridgeKey: 'tonhub',
        },
    ],
    setWalletName: '',
    setWalletUrl: '',
    setModalActive: false,
    walletConnectionUrl: null,
    wallet: null,
    connectionRestored: false,
    authUserId: null,
    authUserAvatar: null,
    authUserName: null,
    authUserVerify: null,
    authUserStatus: null,
    isUnreadDialog: null,
    isUnreadNotify: null,
    social: null

};

const authReducer = (state = initState, action) => {

    switch(action.type) {

        case CHANGE_AUTH_AVATAR: 
            return {
                ...state,
                authUserAvatar: action.avatarUrl
            };

        case SET_UPDATE_SETTINGS:
            return {
                ...state,
                authUserName: action.updateSettingsData.name,
                authUserStatus: action.updateSettingsData.status
            }

        case SET_UPDATE_SOCIAL:
            return {
                ...state,
                social: 
                    {
                      telegram: action.updateSocialData.telegram,
                      instagram: action.updateSocialData.instagram,
                      twitter: action.updateSocialData.twitter,
                      discord: action.updateSocialData.discord,
                      youtube: action.updateSocialData.youtube,
                      tiktok: action.updateSocialData.tiktok,
                      vk: action.updateSocialData.vk,
                      link: action.updateSocialData.link,
                    }
            }


        case SET_UNREAD_DIALOG: 
        return {
            ...state,
            isUnreadDialog: action.unreadDialogData
        };
        case SET_UNREAD_NOTIFY: 
        return {
            ...state,
            isUnreadNotify: action.unreadNotifyData
        };

        case SET_AUTH_USER_ID: 
            return {
                ...state,
                authUserId: action.userData.id,
                authUserAvatar: action.userData.avatar,
                authUserName: action.userData.name,
                authUserVerify: action.userData.verify,
                authUserStatus: action.userData.status,
                social: 
                    {
                      telegram: action.userData.telegram,
                      instagram: action.userData.instagram,
                      twitter: action.userData.twitter,
                      discord: action.userData.discord,
                      youtube: action.userData.youtube,
                      tiktok: action.userData.tiktok,
                      vk: action.userData.vk,
                      link: action.userData.link,
                    }
                

            };
        case AUTH_WALLET: 
            return {
                ...state,
                wallet: action.wallet,
            };
        case SET_WALLET: 
            return {
                ...state,
                setWalletName: action.walletName,
            };
            
        case SET_WALLET_CONNECTION_URL: 
            return {
                ...state,
                walletConnectionUrl: action.walletConnectionUrl
            };

        case SET_CONNECTION_RESTORED: 
            return {
                ...state,
                connectionRestored: action.connectionRestored
            };
        
        default:

            return state;

    }
}

export const changeAuthAvatar = (avatarUrl) => {
    return {
        type: CHANGE_AUTH_AVATAR,
        avatarUrl
    }
}


export const authWallet = (wallet) => {
    return {
        type: AUTH_WALLET,
        wallet
    }
}

export const setWallet = (walletName) => {
    return {
        type: SET_WALLET,
        walletName
        
    }
}

export const setWalletConnectionUrl = (walletConnectionUrl) => {
    return {
        type: SET_WALLET_CONNECTION_URL,
        walletConnectionUrl
    }
}

export const setConnectionRestored = (connectionRestored) => {
    return {
        type: SET_CONNECTION_RESTORED,
        connectionRestored
    }
}

export const setAuthUserId = (userData) => {
    return {
        type: SET_AUTH_USER_ID,
        userData
    }
}

export const setUnreadDialog = (unreadDialogData) => {
    return {
        type: SET_UNREAD_DIALOG,
        unreadDialogData
    }
}

export const setUnreadNotify = (unreadNotifyData) => {
    return {
        type: SET_UNREAD_NOTIFY,
        unreadNotifyData
    }
}

export const setSettings = (updateSettingsData) => {
    return {
        type: SET_UPDATE_SETTINGS,
        updateSettingsData
    }
}

export const setSocial = (updateSocialData) => {
    return {
        type: SET_UPDATE_SOCIAL,
        updateSocialData
    }
}

export default authReducer;