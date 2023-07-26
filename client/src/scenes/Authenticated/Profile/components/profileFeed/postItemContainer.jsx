import React, {useState} from 'react';
import { connect } from 'react-redux';
import PostItem from '../../../../../components/Post';

import { deleteUserPost, editUserPost } from '../../../../../api/profile';
import { addLikePost, deleteLikePost } from '../../../../../api/other';

import { deletePost, addLike, deleteLike, editPost } from '../../../../../redux/reducers/profileReducer';
import showNotification from '../../../../../components/Notify';

const PostItemContainer = ({
        postData,
        deletePost,
        addLike,
        deleteLike,
        id,
        text,
        date,
        name,
        avatar,
        avatarType,
        postUserId,
        verify,
        likes,
        comments,
        wallet,
        userId,
        authUserId,
        like,
        file,
        fileType,
        editPost,
        muteSound,
        setMuteSound
    }) => {


    // Редактирование поста на сервере
    const editPostBackend = async (editPostData) => {
        try {
            const requestData = { editPostData }
            const response = await editUserPost(requestData)
            editPost(editPostData)
            showNotification('Публикация изменена');
        } catch (error) {
            console.log(error)
        }
    }

    // Удаление поста с сервера
    const deletePostBackend = async (postId) => {
        try {
            const requestData = { postId };
            const response = await deleteUserPost(requestData);
            deletePost(postId);
            showNotification('Публикация удалена');
        } catch (error) {
            console.log(error);
        }
    };

    // Лайк на пост
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
        <PostItem
            id={id}
            text={text}
            date={date}
            name={name}
            avatar={avatar}
            avatarType={avatarType}
            postUserId={postUserId}
            verify={verify}
            likes={likes}
            comments={comments}
            wallet={wallet}
            userId={userId}
            authUserId={authUserId}
            like={like}
            file={file}
            fileType={fileType}
            postData={postData}
            deletePostBackend={deletePostBackend}
            likeBackend={likeBackend}
            deleteLikeBackend={deleteLikeBackend}
            editPostBackend={editPostBackend}
            muteSound={muteSound}
            setMuteSound={setMuteSound}
        />
    );
};

const mapStateToProps = (state) => ({
    postData: state.profile.postData,
});

export default connect(mapStateToProps, { addLike, deleteLike, deletePost, editPost })(PostItemContainer);