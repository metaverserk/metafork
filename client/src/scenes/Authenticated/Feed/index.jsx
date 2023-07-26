import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { connect } from 'react-redux';
import FeedFragment from './components/feedFragment';

import {addLikePost, deleteLikePost} from '../../../api/other'
import { getFollowingPosts, getAllPosts, getSearchPosts, getFollowingPostsPage, getSearchPostsPage, getAllPostsPage } from '../../../api/posts';

import { setPosts, setToogleFetching, addPostsList, addLike, deleteLike, setPages } from '../../../redux/reducers/feedReducer';


const Feed = ({
        feedData,
        isFetching,
        totalCount,
        currentPage,
        pages,
        authUserId,
        setPosts,
        setToogleFetching,
        addPostsList,
        addLike,
        deleteLike,
        setPages
    }) => {

    const { search } = useLocation();
    const { type } = queryString.parse(search);
    const { query } = queryString.parse(search);
    const navigate = useNavigate();

    useEffect(() => {

        document.title = 'Лента публикаций';
        let savedState = window.history.state;
        if (savedState && savedState.feedData) {
            setPosts(savedState.feedData);
            setPages(savedState.currentPage, savedState.pages)
            setToogleFetching(false);
            savedState = null;
          } else {
            fetchData();

        }

        if (!authUserId && !type && !query) {
            navigate('/feed?type=new', { replace: true });
        }
        
        return () => {
            setToogleFetching(true);
            setPosts([]);
        };
    }, [type]);



    // Получение данных обо всех постах
    const fetchData = async () => {
        try {
            const requestType = { type }
            const requestQuery = { query }
            let response;
            if (authUserId) {
                if (!type && !query) {
                    response = await getFollowingPosts(requestType);
                } else if (type === 'new' || type === 'popular') {
                    response = await getAllPosts(requestType);
                } else if (query) {
                    response = await getSearchPosts(requestQuery);
                } 
            } else {
                response = await getAllPosts(requestType);
            }
            const { items, totalCount, limit, pages } = response.data;
            setPosts(items, totalCount, limit, pages);
        } catch (error) {
            console.log(error);
        } finally {
            setToogleFetching(false);
        }
    };

    // Пагинация страниц
    const addPageBackend = async () => {
        try {
            const requestType = { type }
            const requestQuery = { query }
            let response;
            if (authUserId) {
                if (!type && !query) {
                    response = await getFollowingPostsPage(currentPage, requestType);
                } else if (type === 'new' || type === 'popular') {
                    response = await getAllPostsPage(currentPage, requestType);
                } else if (query) {
                    response = await getSearchPostsPage(currentPage, requestQuery);
                } 
            } else {
                response = await getAllPostsPage(currentPage, requestType);
            }
            addPostsList(response.data.items);
            
        } catch (error) {
            console.log(error);
        }
    };
    
    // Лайк поста
    const likeBackend = async (postId) => {
        try {
            const requestData = { postId };
            const response = await addLikePost(requestData);
            addLike(postId);
        } catch (error) {
            console.log(error);
        }
    };
    
    // Удаление лайка с поста
    const deleteLikeBackend = async (postId) => {
        try {
            const requestData = { postId };
            const response = await deleteLikePost(requestData);
            deleteLike(postId);
        } catch (error) {
            console.log(error);
        }
    }; 

    return (
        <FeedFragment
            feedData={feedData}
            isFetching={isFetching}
            totalCount={totalCount}
            currentPage={currentPage}
            pages={pages}
            authUserId={authUserId}
            addPageBackend={addPageBackend}
            likeBackend={likeBackend}
            deleteLikeBackend={deleteLikeBackend}
            setToogleFetching={setToogleFetching}
        />
    );
};

let mapStateToProps = (state) => ({
    feedData: state.feed.feedData,
    isFetching: state.feed.isFetching,
    totalCount: state.feed.totalCount,
    currentPage: state.feed.currentPage,
    pages: state.feed.pages,
    authUserId: state.auth.authUserId
});


export default connect(mapStateToProps, {
    setPosts,
    setToogleFetching,
    addPostsList,
    addLike,
    deleteLike,
    setPages
})(Feed);