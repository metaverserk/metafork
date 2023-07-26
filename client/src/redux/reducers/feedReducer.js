const SET_POSTS = 'SET-POSTS';
const TOOGLE_FETCHING = 'TOOGLE-FETCHING';
const ADD_POSTS_LIST = 'ADD-POSTS-LIST';
const ADD_LIKE = 'ADD-LIKE';
const DELETE_LIKE = 'DELETE-LIKE';
const SET_PAGES = 'SET-PAGES'

let initState = {
    feedData: [],
    isFetching: true,
    totalCount: 10,
    limit: 1,
    pages: 1,
    currentPage: 1,
};


const feedReducer = (state = initState, action) => {

    switch(action.type) {
        case SET_PAGES:
            return {
                ...state,
                currentPage: action.currentPage,
                pages: action.pages
            };
        case ADD_LIKE: 
            return {
                ...state,
                feedData: state.feedData.map(post => {
                    if (post.id === action.postId) {
                        return {...post, like: true, likes: post.likes + 1}
                    }
                    return post;
                })
            };
        case DELETE_LIKE: 
            return {
                ...state,
                feedData: state.feedData.map(post => {
                    if (post.id === action.postId) {
                        return {...post, like: false, likes: post.likes - 1}
                    }
                    return post;
                })
            };

        case SET_POSTS: 
            return {
                ...state,
                feedData: action.feedData,
                totalCount: action.totalCount,
                limit: action.limit,
                pages: action.pages,
                currentPage: 1,
            };

        case ADD_POSTS_LIST: 
        const newFeedData = action.feedData.filter((post) => {
            return !state.feedData.some((oldPost) => oldPost.id === post.id);
        });

            return {
                ...state,
                currentPage: state.currentPage + 1,
                feedData: [...state.feedData, ...newFeedData],
            };

        case TOOGLE_FETCHING: 
            return {
                ...state,
                isFetching: action.isFetching
            };
        
        default:

            return state;

    }
}

export const addLike = (postId) => {
    return {
        type: ADD_LIKE,
        postId
    }
}

export const deleteLike = (postId) => {
    return {
        type: DELETE_LIKE,
        postId
    }
}

export const setPosts = (feedData, totalCount, limit, pages) => {
    return {
        type: SET_POSTS,
        feedData: feedData,
        totalCount,
        limit,
        pages
    }
}

export const setToogleFetching = (isFetching) => {
    return {
        type: TOOGLE_FETCHING,
        isFetching
    }
}

export const addPostsList = (feedData) => {
    return {
        type: ADD_POSTS_LIST,
        feedData
    }
}

export const setPages = (currentPage, pages) => {
    return {
        type: SET_PAGES,
        currentPage,
        pages
    }
}


export default feedReducer;