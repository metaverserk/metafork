import React, {useState} from 'react';
import { connect } from 'react-redux';
import { addPost, addUserPostsList } from '../../../../../redux/reducers/profileReducer';
import PostFragment from './postFragment';
import { createUserPost, getUserPostsPage, uploadPostImage, uploadPostVideo } from '../../../../../api/profile';
import showNotification from '../../../../../components/Notify';


const PostContainer = ({
        pages,
        isFetching,
        authUserId,
        postData,
        addPost,
        currentPage,
        addUserPostsList,
        userId,
    }) => {

    const [postFile, setPostFile] = useState('');
    const [postFileType, setPostFileType] = useState('');
    const [uploadFetching, setUploadFetching] = useState(false);

    // Отправка поста на сервер
    const addPostBackend = async newPostData => {
        try {
            const response = await createUserPost(newPostData);
            addPost(response.data);
            setPostFile('');
            showNotification('Опубликовано');
        } catch (error) {
            console.log(error);
        }
    };
    
    // Добавление страницы
    const addPageBackend = async () => {
        try {
            const requestData = { userId };
            const response = await getUserPostsPage(currentPage, requestData);
            addUserPostsList(response.data.items);
        } catch (error) {
            console.log(error);
        }
    };
    
    // Загрузка изображения к посту
    const uploadPostImageBackend = async file => {
        try {
            setUploadFetching(true)
            const response = await uploadPostImage(file);
            setPostFile(response.data);
            setPostFileType(response.headers['content-type'].split("/")[0]);
        } catch (error) {
            console.log(error);
        } finally {
            setUploadFetching(false)
        }
    };

    // Загрузка видео к посту
    const uploadPostVideoBackend = async file => {
        try {
            setUploadFetching(true)
            const response = await uploadPostVideo(file);
            console.log(response)
            setPostFile(response.data);
            setPostFileType(response.headers['content-type'].split("/")[0]);
        } catch (error) {
            showNotification(error.response.data.error)
            console.log(error);
        } finally {
            setUploadFetching(false)
        }
    };

    return (
        <PostFragment
            addPostBackend={addPostBackend}
            addPageBackend={addPageBackend}
            uploadPostImageBackend={uploadPostImageBackend}
            uploadPostVideoBackend={uploadPostVideoBackend}
            postData={postData}
            authUserId={authUserId}
            userId={userId}
            isFetching={isFetching}
            pages={pages}
            currentPage={currentPage}
            postFile={postFile}
            postFileType={postFileType}
            setPostFile={setPostFile}
            uploadFetching={uploadFetching}
        />
    );
};

const mapStateToProps = state => ({
    postData: state.profile.postData,
    isFetching: state.profile.isFetching,
    totalCount: state.profile.totalCount,
    currentPage: state.profile.currentPage,
    pages: state.profile.pages,
    authUserId: state.auth.authUserId,
    postImage: state.profile.postImage
});

export default connect(mapStateToProps, {
    addPost,
    addUserPostsList
})(PostContainer);