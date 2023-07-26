import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUserProfile, setUserPosts, setToggleFetching, follow, unFollow, changeAvatar } from '../../../redux/reducers/profileReducer';
import { changeAuthAvatar } from '../../../redux/reducers/authReducer';
import { getUserProfile, getUserPosts, uploadAvatar, changeAvatarUrl } from '../../../api/profile';
import { addFollow, deleteFollow } from '../../../api/other';
import ProfileFragment from './components/profileData/profileFragment';
import showNotification from '../../../components/Notify';

const Profile = ({
    setUserPosts,
    setUserProfile,
    setToggleFetching,
    profile,
    authUserId,
    follow,
    unFollow,
    changeAvatar,
    changeAuthAvatar,
    social
}) => {

    const { userLink } = useParams();
    const userId = userLink.replace("id", "");

    if (!/^\d+$/.test(userId)) {
        window.location.replace('/feed'); 
    } 

    useEffect(() => {
    
        fetchData();
        fetchPosts();

        return () => {
            setUserPosts([]);
            setToggleFetching(true);
        };
        
    }, [userId]);


    // Получение данных о профиле
    const fetchData = async () => {
        try {
            const requestData = { userId };
            const response = await getUserProfile(requestData);
            setUserProfile(response.data);
        } catch (error) {
            if (error.response.status === 404) {
                window.location.replace('/feed'); 
            } else {
                console.log(error);
            }
        }
    }

    // Получение данных о постах пользователя
    const fetchPosts = async () => {
        try {
            const requestData = { userId };
            const response = await getUserPosts(requestData);
            const { items, totalCount, limit, pages } = response.data;
            setUserPosts(items, totalCount, limit, pages);
        } catch (error) {
            console.log(error);
        } finally {
            setToggleFetching(false);
        }
    }

    // Подписка на пользователя
    const addFollowBackend = async () => {
        try {
            const requestData = { userId };
            const response = await addFollow(requestData);
            follow();
            showNotification(response.data);
        } catch (error) {
            showNotification(error.response.data.message);
            console.log(error);
        }
    };

    // Отписка от пользователя
    const unFollowBackend = async () => {
        try {
            const requestData = { userId };
            const response = await deleteFollow(requestData);
            unFollow();
            showNotification(response.data);
        } catch (error) {
            showNotification(error.response.data.message);
            console.log(error);
        }
    };

    // Загрузка аватара
    const uploadAvatarBackend = async (file) => {
        try {
            const responseUpload = await uploadAvatar(file);
            const avatarUrl = responseUpload.data;
            const avatarType = null;
            const requestData = { avatarUrl, avatarType };
            const responseChange = await changeAvatarUrl(requestData);
            changeAvatar(responseChange.data.avatarUrl);
            changeAuthAvatar(responseChange.data.avatarUrl);
            fetchData();
            fetchPosts();
        } catch (error) {
            console.log(error);
        }
    }; 

    return (
        <ProfileFragment
            profile={profile}
            social={social}
            authUserId={authUserId}
            userId={userId}
            addFollowBackend={addFollowBackend}
            unFollowBackend={unFollowBackend}
            uploadAvatarBackend={uploadAvatarBackend}
        />
    );
};

const mapStateToProps = state => ({
    profile: state.profile.profile,
    social: state.profile.social,
    authUserId: state.auth.authUserId,
    currentPage: state.profile.currentPage
});

export default connect(mapStateToProps, {
    follow,
    unFollow,
    setUserProfile,
    setUserPosts,
    setToggleFetching,
    changeAvatar,
    changeAuthAvatar
})(Profile);