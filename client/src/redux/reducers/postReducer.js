const SET_POST = 'SET-POST';
const TOGGLE_FETCHING = 'TOGGLE-FETCHING';
const SET_COMMENTS = 'SET-COMMENTS';
const ADD_COMMENT_TEXT = 'ADD-COMMENT-TEXT';
const ADD_COMMENT = 'ADD-COMMENT';
const ADD_LIKE = 'ADD-LIKE';
const DELETE_LIKE = 'DELETE-LIKE';
const ADD_COMMENTS_LIST = 'ADD-COMMENTS-LIST';
const DELETE_COMMENT = 'DELETE-COMMENT';
const SET_REPLY = 'SET-REPLY';
const ADD_THREAD_LIST = 'ADD-THREAD-LIST';
const DELETE_COMMENT_REPLY = 'DELETE-COMMENT-REPLY';
const ADD_REPLY = 'ADD-REPLY';

let initState = {
    postData: '',
    postComments: [],
    commentUpdateText: '',
    isFetching: true,
    totalCount: 10,
    limit: 1,
    pages: 1,
    currentPage: 1,
};



const postReducer = (state = initState, action) => {
    
    switch(action.type) {

        case ADD_REPLY:
        const updatedReplyComments = state.postComments.map(comment => {
            if (comment.id === action.newReplyData.commentId) {
                const updatedThread = {
                    ...comment.thread,
                    items: comment.thread && comment.thread.items
                      ? [...comment.thread.items, action.newReplyData]
                      : [action.newReplyData]
                  }; 
                return {
                    ...comment,
                    thread: updatedThread
                };
            } else {
                return comment;
            }
        });
        return {
            ...state,
            postComments: updatedReplyComments,
        };

        case DELETE_COMMENT_REPLY:
            
        const postComments = [...state.postComments];
        const commentIndex = postComments.findIndex(comment => comment.id === action.commentId);
        
        const comment = { ...postComments[commentIndex] };

        const updatedThread = {
            ...comment.thread,
            items: comment.thread.items.filter(item => item.id !== action.replyId)
        };

        const updatedThreadComments = [
            ...postComments.slice(0, commentIndex),
            { ...comment, thread: updatedThread },
            ...postComments.slice(commentIndex + 1)
        ];

        return {
            ...state,
            postComments: updatedThreadComments
        };

        case ADD_THREAD_LIST:

        return {
            ...state,
            postComments: state.postComments.map(comment => {
              if (comment.id === action.commentId) {
                return {
                  ...comment,
                  thread: {
                    ...comment.thread,
                    items: [...comment.thread.items, ...action.commentThread],
                    currentPage: state.currentPage + 1
                  }
                }
              } else {
                return comment
              }
            })
        };

        case SET_REPLY:
        const updatedPostComments = state.postComments.map(comment => {
            if (comment.id === action.commentId) {
            return { ...comment, thread: action.replyData };
            } else {
            return comment;
            }
        });
        return { ...state, postComments: updatedPostComments };

        case ADD_LIKE: 

        return {
            ...state,
            postData: { 
                ...state.postData,
                like: true,
                likes: state.postData.likes + 1
            },
        };
        case DELETE_LIKE: 

        return {
            ...state,
            postData: { 
                ...state.postData,
                like: false,
                likes: state.postData.likes - 1
            },
        };

        case ADD_COMMENT: 

        return {
            ...state,
            postComments: [...state.postComments, action.comment],
            commentUpdateText: ''
        };

        case ADD_COMMENTS_LIST: 

        const addCommentsData = action.postComments.filter((comment) => {
            return !state.postComments.some((oldComments) => oldComments.id === comment.id);
        });
      
        return {
            ...state,
            postComments: [...state.postComments, ...addCommentsData],
            currentPage: state.currentPage + 1
        };

        case ADD_COMMENT_TEXT: 
        return {
            ...state,
            commentUpdateText: action.commentText
        };

        case SET_COMMENTS: 
        return {
            ...state,
            postComments: action.postComments,
            totalCount: action.totalCount,
            limit: action.limit,
            pages: action.pages,
            currentPage: 1,
        };
    
        case SET_POST: 
        return {
            ...state,
            postData: action.postData,
        };

        case DELETE_COMMENT: 
        let newCommentsData = state.postComments.filter(comment => comment.id !== +action.commentId);
        return {
            ...state,
            postComments: newCommentsData,
           
        };

        case TOGGLE_FETCHING: 
        return {
            ...state,
            isFetching: action.isFetching
        };
        
        default:
            return state;
    }
}

export const addReply = (newReplyData) => {
    return {
        type: ADD_REPLY,
        newReplyData,
    }
}

export const deleteCommentReply = (replyId, commentId) => {
    return {
        type: DELETE_COMMENT_REPLY,
        replyId,
        commentId
    }
}

export const addThreadList = (commentId, commentThread) => {
    return {
        type: ADD_THREAD_LIST,
        commentId,
        commentThread
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

export const addComment = (comment) => {
    return {
        type: ADD_COMMENT,
        comment
    }
}

export const addCommentText = (commentText) => {
    return {
        type: ADD_COMMENT_TEXT,
        commentText: commentText
    }
}

export const setComments = (postComments, totalCount, pageSize, pages) => {
    return {
        type: SET_COMMENTS,
        postComments,
        totalCount,
        pageSize,
        pages
    }
}

export const setPost = (postData) => {
    return {
        type: SET_POST,
        postData: postData,
    }
}

export const setReply = (commentId, replyData) => {
    return {
        type: SET_REPLY,
        commentId,
        replyData
    }
}

export const toggleFetching = (isFetching) => {
    return {
        type: TOGGLE_FETCHING,
        isFetching
    }
}

export const addCommentsList = (postComments) => {
    return {
        type: ADD_COMMENTS_LIST,
        postComments
    }
}

export const deleteComment = (commentId) => {
    return {
        type: DELETE_COMMENT,
        commentId
    }
}


export default postReducer;