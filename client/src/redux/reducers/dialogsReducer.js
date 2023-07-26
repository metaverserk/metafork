const SET_DIALOGS = 'SET-DIALOGS';
const TOOGLE_FETCHING = 'TOOGLE-FETCHING';
const ADD_PAGE = 'ADD-PAGE';
const ADD_DIALOGS_LIST = 'ADD-DIALOGS-LIST';

let initState = {
    dialogsData: [],
    isFetching: true,
    totalCount: 10,
    limit: 1,
    pages: 1,
    currentPage: 1,
};

const dialogsReducer = (state = initState, action) => {
    switch(action.type) {

        case SET_DIALOGS: 
        return {
            ...state,
            dialogsData: action.dialogsData,
            totalCount: action.totalCount,
            limit: action.limit,
            pages: action.pages,
            currentPage: 1,
        };
        case TOOGLE_FETCHING: 
        return {
            ...state,
            isFetching: action.isFetching
        };
        case ADD_PAGE: 
        return {
            ...state,
            currentPage: state.currentPage + 1
        };
        case ADD_DIALOGS_LIST: 

        return {
            ...state,
            currentPage: state.currentPage + 1,
            dialogsData: [...state.dialogsData, ...action.dialogsData],
        };
        
        default:

            return state;

    }
}


export const setDialogs = (dialogsData, totalCount, pageSize, pages) => {
    return {
        type: SET_DIALOGS,
        dialogsData,
        totalCount,
        pageSize,
        pages
    }
}

export const setToogleFetching = (isFetching) => {
    return {
        type: TOOGLE_FETCHING,
        isFetching
    }
}

export const addPage = () => {
    return {
        type: ADD_PAGE
    }
}

export const addDialogsList = (dialogsData) => {
    return {
        type: ADD_DIALOGS_LIST,
        dialogsData
    }
}

export default dialogsReducer;