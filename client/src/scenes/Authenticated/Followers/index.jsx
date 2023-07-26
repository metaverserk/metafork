import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { follow, unFollow, setUsers, setToogleFetching, addUsersList } from '../../../redux/reducers/usersReducer';
import {getFollowers, getFollowersPage} from '../../../api/profile';
import { addFollow, deleteFollow } from '../../../api/other';
import UserFragment from './components/userFragment';
import { useParams } from 'react-router-dom';
import showNotification from '../../../components/Notify';

const Users = ({
        pages,
        usersData,
        isFetching,
        setUsers,
        setToogleFetching,
        authUserId,
        currentPage,
        addUsersList,
        follow,
        unFollow,
    }) => {

    const { userLink } = useParams();
    const userId = userLink.replace("id", "");

    useEffect(() => {

        document.title = 'Подписчики пользователя';
        fetchData();

        return () => {
            setUsers([]);
            setToogleFetching(true);
        };
    }, [userId]);

    // Получение данных о подписчиках
    const fetchData = async () => {
        try {
            if (!/^\d+$/.test(userId)) {window.location.replace('/feed');}
            const requestData = { userId };
            const response = await getFollowers(requestData);
            const { items, totalCount, limit, pages } = response.data;
            setUsers(items, totalCount, limit, pages);
        } catch (error) {
            console.log(error);
        } finally {
            setToogleFetching(false);
        }
    };
    
    // Добавление страницы
    const addPageBackend = async () => {
        try {
            const requestData = { userId,};
            const response = await getFollowersPage(currentPage, requestData);
            addUsersList(response.data.items);
        } catch (error) {
            console.log(error);
        }
    };
    
    // Подписка на пользователя
    const addFollowBackend = async (userId) => {
        try {
            const requestData = { userId };
            const response = await addFollow(requestData);
            follow(userId);
            showNotification(response.data);
        } catch (error) {
            showNotification(error.response.data.message);
            console.log(error);
        }
    };
    
    // Отмена подписки на пользователя
    const unFollowBackend = async (userId) => {
        try {
            const requestData = { userId };
            const response = await deleteFollow(requestData);
            unFollow(userId);
            showNotification(response.data);
        } catch (error) {
            showNotification(error.response.data.message);
            console.log(error);
        }
    };

    return (
        <UserFragment
            currentPage={currentPage}
            pages={pages}
            usersData={usersData}
            isFetching={isFetching}
            follow={follow}
            unFollow={unFollow}
            authUserId={authUserId}
            addPageBackend={addPageBackend}
            addFollowBackend={addFollowBackend}
            unFollowBackend={unFollowBackend}
        />
    );
};

let mapStateToProps = (state) => {
    return {
        usersData: state.users.usersData,
        isFetching: state.users.isFetching,
        totalCount: state.users.totalCount,
        currentPage: state.users.currentPage,
        pages: state.users.pages,
        authUserId: state.auth.authUserId
    };
};

export default connect(mapStateToProps, {follow, unFollow, setUsers, setToogleFetching, addUsersList})(Users);