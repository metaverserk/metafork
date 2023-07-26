const ADD_MESSAGE = 'ADD-MESSAGE';
const SET_MESSAGES = 'SET-MESSAGES';
const TOOGLE_FETCHING = 'TOOGLE-FETCHING'
const ADD_PAGE = 'ADD-PAGE';
const ADD_MESSAGE_LIST = 'ADD-MESSAGE-LIST';
const SET_USER_DATA = 'SET-USER-DATA';
const DELETE_USER_DATA = 'DELETE-USER-DATA';

let initState = {
    dialogData: [],
    isFetching: true,
    totalCount: 10,
    limit: 1,
    pages: 4,
    currentPage: 1,
    roomId: null,
    userName: null,
    userWallet: null

};

const dialogReducer = (state = initState, action) => {

    switch(action.type) {

        case SET_USER_DATA: 
          
        return {
            ...state,
            userName: action.userData.name,
            userWallet: action.userData.wallet
        };

        case DELETE_USER_DATA: 
          
        return {
            ...state,
            userName: null,
            userWallet: null
        };

        case SET_MESSAGES: 
          
        return {
            ...state,
            dialogData: action.dialogData,
            totalCount: action.totalCount,
            limit: action.limit,
            pages: action.pages,
            currentPage: 1,
            roomId: action.roomId,
        };


        case ADD_PAGE: 
            return {
                ...state,
                currentPage: state.currentPage + 1
            };
            
        case ADD_MESSAGE_LIST: 


        const newDialogData = action.dialogData.filter((dialog) => {
            return !state.dialogData.some((oldDialog) => oldDialog.id === dialog.id);
        });
    
        return {
            ...state,
            dialogData: [...state.dialogData, ...newDialogData,],
        };

        case TOOGLE_FETCHING: 
            return {
                ...state,
                isFetching: action.isFetching
            };

        case ADD_MESSAGE: 
            return {
                ...state,
                dialogData: [action.newMessageData, ...state.dialogData,]
            };
        
        default:

            return state;

    }
}


export const addPage = () => {
    return {
        type: ADD_PAGE
    }
}

export const deleteUserData = () => {
    return {
        type: DELETE_USER_DATA
    }
}

export const setUserData = (userData) => {
    return {
        type: SET_USER_DATA,
        userData
    }
}

export const addMessageList = (dialogData) => {
    return {
        type: ADD_MESSAGE_LIST,
        dialogData
    }
}

export const setMessages = (dialogData, totalCount, pageSize, pages, roomId) => {
    return {
        type: SET_MESSAGES,
        dialogData,
        totalCount,
        pageSize,
        pages,
        roomId,
    }
}

export const setToogleFetching = (isFetching) => {
    return {
        type: TOOGLE_FETCHING,
        isFetching
    }
}

export const addMessage = (newMessageData) => {
    return {
        type: ADD_MESSAGE,
        newMessageData
    }
}

export default dialogReducer;