import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { follow, unFollow, setUsers, setToogleFetching, addUsersList } from '../../../redux/reducers/usersReducer';

import { getUsers, getUsersPage } from '../../../api/users';

import { addFollow, deleteFollow } from '../../../api/other';

import UserFragment from './components/userFragment';
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

    const [searchUpdateText, setSearchUpdateText] = useState('');
    const searchElement = React.useRef();
    
    useEffect(() => {
        document.title = 'Пользователи';

        fetchUsers();

        return () => {
            setUsers([]);
            setToogleFetching(true);
        };
    }, [authUserId]);

    // Получение данных о пользователях
    const fetchUsers = async (searchData) => {
        try {
            const response = await getUsers(searchData);
            const { items, totalCount, limit, pages } = response.data;
            setUsers(items, totalCount, limit, pages);
        } catch (error) {
            console.log(error);
        } finally {
            setToogleFetching(false);
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
      
    // Отписка от пользователя
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
      
    // Добавление страницы 
    const addPageBackend = async () => {
        try {
            const searchData = {
                search: searchUpdateText
            }
            const response = await getUsersPage(currentPage, searchData);
            addUsersList(response.data.items);
        } catch (error) {
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
            setToogleFetching={setToogleFetching}
            fetchUsers={fetchUsers}
            searchUpdateText={searchUpdateText}
            setSearchUpdateText={setSearchUpdateText}
            searchElement={searchElement}
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

export default connect(mapStateToProps, {
    follow,
    unFollow,
    setUsers,
    setToogleFetching,
    addUsersList
})(Users);