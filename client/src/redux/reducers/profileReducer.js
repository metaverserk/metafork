const ADD_POST = 'ADD-POST';
const SET_USER_PROFILE = 'SET-USER-PROFILE';
const SET_USER_POSTS = 'SET-USER-POSTS';
const SET_TOGGLE_FETCHING = 'SET-TOGGLE-FETCHING';
const DELETE_POST = 'DELETE-POST';
const ADD_USER_POSTS_LIST = 'ADD-USER-POSTS-LIST';
const FOLLOW = 'FOLLOW';
const UNFOLLOW = 'UNFOLLOW';
const ADD_LIKE = 'ADD-LIKE';
const DELETE_LIKE = 'DELETE-LIKE';
const CHANGE_AVATAR = 'CHANGE-AVATAR';
const SET_NFT = 'SET-NFT';
const ADD_NFT_LIST = 'ADD-NFT-LIST';
const EDIT_POST = 'EDIT_POST';
const SET_JETTONS = 'SET-JETTONS'

let initState = {
    profile: {
        wallet: null,
    },
    social: [],
    nft: [],
    jettons: [],
    postData: [],
    isFetching: true,
    totalCount: 10,
    limit: 1,
    pages: 1,
    currentPage: 1,
};

const profileReducer = (state = initState, action) => {

    switch(action.type) {

        case EDIT_POST: 
        return {
            ...state,
            postData: state.postData.map(post => {
            if (post.id === action.editPostData.id) {
                return {
                ...post,
                text: action.editPostData.text
                };
            }
            return post;
            })
        }; 

        case ADD_NFT_LIST: 
        const newNftData = action.nftData.filter((nft) => {
            return !state.nft.some((oldNft) => oldNft.address === nft.address);
        });
        return {
            ...state,
            nft: [...state.nft, ...newNftData],
        };

        case SET_NFT: 
        
        return {
            ...state,
            nft: action.nft
        };

        case SET_JETTONS: 
        
        return {
            ...state,
            jettons: action.jettons
        };

        case CHANGE_AVATAR: 
        let postChangeAvatars = state.postData.map(post => {
            return {
                ...post,
                avatar: action.response
            }
        });

        return {
            ...state,
            profile: {
                ...state.profile,
                avatar: action.response
            },
            postData: postChangeAvatars
        };
    
        case FOLLOW: 
        return {
            ...state,
            profile: {
            ...state.profile,
            followed: true
            }
        };
        case UNFOLLOW: 
        return {
            ...state,
            profile: {
            ...state.profile,
            followed: false
            }
        };

        case ADD_LIKE: 
        return {
            ...state,
            postData: state.postData.map(post => {
                if (post.id === action.postId) {
                    return {...post, like: true, likes: post.likes + 1}
                }
                return post;
            })
        };
        case DELETE_LIKE: 
        return {
            ...state,
            postData: state.postData.map(post => {
                if (post.id === action.postId) {
                    return {...post, like: false, likes: post.likes - 1}
                }
                return post;
            })
        };

        case ADD_POST: 
        return {
            ...state,
            postData: [action.post, ...state.postData],
            addPostUpdateText: '',
        };

        // case SET_USER_PROFILE: 
        // return {
        //     ...state,
        //     profile: action.profile,
        // };

        case SET_USER_PROFILE:

            return {
                ...state,
                profile: {
                    avatar: action.profile.avatar,
                    avatarType: action.profile.avatarType,
                    followed: action.profile.followed,
                    followedCount: action.profile.followedCount,
                    followerCount: action.profile.followerCount,
                    id: action.profile.id,
                    name: action.profile.name,
                    postCount: action.profile.postCount,
                    rating: action.profile.rating,
                    status: action.profile.status,
                    userId: action.profile.userId,
                    verify: action.profile.verify,
                    wallet: action.profile.wallet,
                },
                social: action.profile.social

      

              
            }

        case SET_USER_POSTS: 
        return {
            ...state,
            postData: [...action.postData],
            totalCount: action.totalCount,
            limit: action.limit,
            pages: action.pages,
            currentPage: 1,
        };

        case ADD_USER_POSTS_LIST: 
        const addNewPostData = action.postData.filter((post) => {
            return !state.postData.some((oldPost) => oldPost.id === post.id);
        });
        return {
            ...state,
            currentPage: state.currentPage + 1,
            postData: [...state.postData, ...addNewPostData],
        }; 

        case SET_TOGGLE_FETCHING: 
        return {
            ...state,
            isFetching: action.isFetching
        };

        case DELETE_POST: 
        let newPostData = state.postData.filter(post => post.id !== +action.postId);
        
        return {
            ...state,
            postData: newPostData,
           
        };
        
        default:

            return state;

    }
}


export const editPost = (editPostData) => {
   
    return {
        type: EDIT_POST,
        editPostData
    }
}

export const addNftList = (nftData) => {
   
    return {
        type: ADD_NFT_LIST,
        nftData
    }
}

export const setNft = (nft) => {
    return {
        type: SET_NFT,
        nft
    }
}

export const setJettons = (jettons) => {
    return {
        type: SET_JETTONS,
        jettons
    }
}


export const changeAvatar = (response) => {
    return {
        type: CHANGE_AVATAR,
        response
    }
}

export const follow = () => {
    return {
        type: FOLLOW
    }
}

export const unFollow = () => {
    return {
        type: UNFOLLOW
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

export const addPost = (post) => {

    return {
        type: ADD_POST,
        post
    }
}

export const setUserProfile = (profile) => {
    return {
        type: SET_USER_PROFILE,
        profile
    }
}

export const setUserPosts = (postData, totalCount, limit, pages) => {
    return {
        type: SET_USER_POSTS,
        postData: postData,
        totalCount,
        limit,
        pages
    }
}

export const setToggleFetching = (isFetching) => {
    return {
        type: SET_TOGGLE_FETCHING,
        isFetching
    }
}

export const deletePost = (postId) => {
    return {
        type: DELETE_POST,
        postId
    }
}

export const addUserPostsList = (postData) => {
    return {
        type: ADD_USER_POSTS_LIST,
        postData
    }
}


export default profileReducer;