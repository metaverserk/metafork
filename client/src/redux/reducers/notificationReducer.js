const SET_NOTIFICATIONS = 'SET-NOTIFICATIONS';
const SET_TOOGLE_FETCHING = 'SET-TOOGLE-FETCHING';
const ADD_NOTIFICATION_LIST = 'ADD-NOTIFICATION-LIST'

let initState = {
    notificationData: [],
    totalCount: 10,
    limit: 1,
    pages: 1,
    currentPage: 1,
    isFetching: true,
};

const notificationReducer = (state = initState, action) => {

    switch(action.type) {

        case ADD_NOTIFICATION_LIST: 

        return {
            ...state,
            currentPage: state.currentPage + 1,
            notificationData: [...state.notificationData, ...action.notificationData],
        };

        case SET_TOOGLE_FETCHING: 
        return {
            ...state,
            isFetching: action.isFetching
        };

        case SET_NOTIFICATIONS:
            return {
                ...state,
                notificationData: action.notificationData,
                totalCount: action.totalCount,
                limit: action.limit,
                pages: action.pages,
                currentPage: 1,
            }
        
        default:

            return state;

    }
}

export const setNotifications = (notificationData, totalCount, limit, pages, currentPage) => {
    return {
        type: SET_NOTIFICATIONS,
        notificationData,
        totalCount,
        limit,
        pages,
        currentPage
    }
}

export const setToogleFetching = (isFetching) => {
    return {
        type: SET_TOOGLE_FETCHING,
        isFetching
    }
}

export const addNotificationList = (notificationData) => {
    return {
        type: ADD_NOTIFICATION_LIST,
        notificationData
    }
}

export default notificationReducer;