const FOLLOW = 'FOLLOW';
const UNFOLLOW = 'UNFOLLOW';
const SET_USERS = 'SET-USERS';
const TOOGLE_FETCHING = 'TOOGLE-FETCHING';
const ADD_PAGE = 'ADD-PAGE';
const ADD_USERS_LIST = 'ADD-USERS-LIST';


let initState = {
    usersData: [ ],
    isFetching: true,
    totalCount: 10,
    limit: 1,
    pages: 1,
    currentPage: 1,
};

const usersReducer = (state = initState, action) => {
    
    switch(action.type) {
        case FOLLOW: 
            return {
                ...state,
                usersData: state.usersData.map(user => {
                    if (user.id === action.id) {
                        return {...user, followed: true}
                    }
                    return user;
                })
            };
        case UNFOLLOW: 
        return {
            ...state,
            usersData: state.usersData.map(user => {
                if (user.id === action.id) {
                    return {...user, followed: false}
                }
                return user;
            })
        };
        case SET_USERS: 
        return {
            ...state,
            usersData: action.usersData,
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
        case ADD_USERS_LIST: 
        const newUsersData = action.usersData.filter(user => !state.usersData.some(u => u.id === user.id));
        return {
            ...state,
            currentPage: state.currentPage + 1,
            usersData: [...state.usersData, ...newUsersData],
        }; 

        default:

            return state;

    }
}

export const follow = (id) => {
    return {
        type: FOLLOW,
        id
    }
}

export const unFollow = (id) => {
    return {
        type: UNFOLLOW,
        id
    }
}

export const setUsers = (usersData, totalCount, pageSize, pages) => {
    return {
        type: SET_USERS,
        usersData,
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

export const addUsersList = (usersData) => {
    return {
        type: ADD_USERS_LIST,
        usersData
    }
}



export default usersReducer;