import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PostFragment from './components/postFragment';

import { addLikePost, deleteLikePost } from '../../../api/other'
import { getPost, getComments, createPostComment, deletePostComment, getCommentsPage, getReply, getReplyPage, deleteReply, createReply } from '../../../api/posts';

import { useParams } from 'react-router-dom';
import { setPost, setComments, toggleFetching, addCommentText, addComment, addLike, deleteLike, addCommentsList, deleteComment, setReply, addThreadList, deleteCommentReply, addReply } from '../../../redux/reducers/postReducer';

const Post = ({
        postData,
        postComments,
        isFetching,
        toggleFetching,
        addCommentText,
        commentUpdateText,
        authUserId,
        currentPage,
        pages,
        setPost,
        setComments,
        addComment,
        addLike,
        deleteLike,
        addCommentsList,
        deleteComment,
        setReply,
        addThreadList,
        deleteCommentReply,
        addReply,
        socket
    }) => {

    const { postId } = useParams();

    if (!/^\d+$/.test(postId)) {
        window.location.replace('/feed'); 
    }

    useEffect(() => {
        
        fetchPost();
        fetchComments();

        return () => {
            setPost([]);
            setComments([]);
            toggleFetching(true);
        }
    }, [postId]);

    // Получение данных о публикации
    const fetchPost = async () => {
        try {
            const requestData = { postId };
            const responsePost = await getPost(requestData);
            setPost(responsePost.data);
        } catch (error) {
            if (error.response.status === 404) {
                window.location.replace('/feed'); 
            } else {
                console.log(error);
            }
        }
    }

    // Получение данных о комментариях
    const fetchComments = async () => {
        try {
            const requestData = { postId };
            const responseComments = await getComments(requestData);
            const { items, totalCount, limit, pages } = responseComments.data;
            setComments(items, totalCount, limit, pages);
        } catch (error) {
            console.log(error);
        } finally {
            toggleFetching(false);
        }
    }

    // Добавление комментария на сервер
    const addCommentBackend = async (newCommentData) => {
        try {
            const responseCreateComment = await createPostComment(newCommentData);
            addComment(responseCreateComment.data);
            socket.emit('addNotifyUnread', newCommentData.userId);
        } catch (error) {
            console.log(error);
        }
    };

    // Добавление ответа на сервер
    const addReplyBackend = async (newReplyData) => {
        try {
            const responseCreateReply = await createReply(newReplyData);
            addReply(responseCreateReply.data);
            socket.emit('addNotifyUnread', newReplyData.replyUserId);
        } catch (error) {
            console.log(error);
        }
    };

    // Получение ответов с сервера
    const getReplyBackend = async (commentId) => {
        try {
            const requestData = { commentId };
            const responseGetReply = await getReply(requestData);
            setReply(commentId, responseGetReply.data);
        } catch (error) {
            console.log(error);
        }
    };

    // Удаление ответа с сервера
    const deleteReplyBackend = async (replyId, commentId) => {
        try {
            const requestData = { replyId };
            const responseDeletePostCommentReply = await deleteReply(requestData);
            deleteCommentReply(replyId, commentId);
        } catch (error) {
            console.log(error);
        }
    };

    // Добавление страниц к ответам
    const addPageReplyBackend = async (commentId, currentPage) => {
        try {
            const requestData = { commentId };
            const responseAddReplyPage = await getReplyPage(currentPage, requestData);
            addThreadList(commentId, responseAddReplyPage.data.items);
        } catch (error) {
            console.log(error);
        }
    };

    // Лайк поста
    const likeBackend = async (postId) => {
        try {
            const requestData = { postId };
            const responseAddLikePost = await addLikePost(requestData);
            addLike(postId);
        } catch (error) {
            console.log(error);
        }
    };

    // Удаление лайка с поста
    const deleteLikeBackend = async (postId) => {
        try {
            const requestData = { postId };
            const responseDeleteLikePost = await deleteLikePost(requestData);
            deleteLike(postId);
        } catch (error) {
            console.log(error);
        }
    };

    // Удаление комментария с сервера
    const deleteCommentBackend = async (commentId) => {
        try {
            const requestData = { commentId };
            const responseDeletePostComment = await deletePostComment(requestData);
            deleteComment(commentId);
        } catch (error) {
            console.log(error);
        }
    };

    // Добавление страницы комментариев
    const addPageBackend = async () => {
        try {
            const requestData = { postId };
            const responseAddComments = await getCommentsPage(currentPage, requestData);
            addCommentsList(responseAddComments.data.items);
        } catch (error) {
            console.log(error);
        }
    };
    
    return (
        <PostFragment
            postData={postData}
            isFetching={isFetching}
            postId={postId}
            postComments={postComments}
            commentUpdateText={commentUpdateText}
            addCommentText={addCommentText}
            pages={pages}
            addCommentBackend={addCommentBackend}
            likeBackend={likeBackend}
            deleteLikeBackend={deleteLikeBackend}
            deleteCommentBackend={deleteCommentBackend}
            authUserId={authUserId}
            addPageBackend={addPageBackend}
            getReplyBackend={getReplyBackend}
            addPageReplyBackend={addPageReplyBackend}
            deleteReplyBackend={deleteReplyBackend}
            addReplyBackend={addReplyBackend}
            currentPage={currentPage}
        />
    );
};

const mapStateToProps = state => ({
    postData: state.post.postData,
    postComments: state.post.postComments,
    isFetching: state.post.isFetching,
    commentUpdateText: state.post.commentUpdateText,
    authUserId: state.auth.authUserId,
    currentPage: state.post.currentPage,
    pages: state.post.pages
});

export default connect(mapStateToProps, {
    setPost,
    setComments,
    toggleFetching,
    addCommentText,
    addComment,
    addLike,
    deleteLike,
    addCommentsList,
    deleteComment,
    setReply,
    addThreadList,
    deleteCommentReply,
    addReply
})(Post);