import React from 'react';
import UserItem from "../../../../components/User";
import Preloader from "../../../../components/Preloader";
import { useInfiniteScroll } from '../../../../utils';
import Footer from '../../../../components/Footer';


const UserFragment = ({
        isFetching,
        currentPage,
        pages,
        usersData,
        authUserId,
        addPageBackend,
        addFollowBackend,
        unFollowBackend,
        setToogleFetching,
        fetchUsers,
        searchUpdateText,
        setSearchUpdateText,
        searchElement
    }) => {

        
    let userElements = usersData.map(user => 
        <UserItem
            key={user.id}
            userId={user.id}
            avatar={user.avatar}
            name={user.name}
            followerCount={user.followerCount}
            verify={user.verify}
            wallet={user.wallet}
            followed={user.followed}
            authUserId={authUserId}
            addFollowBackend={addFollowBackend}
            unFollowBackend={unFollowBackend}
            avatarType={user.avatarType}
        />
    );

    // Добавление страницы
    const handleAddPage = async () => {
        addPageBackend();
    }

    const handleUpdateText = async () => {
        setSearchUpdateText(searchElement.current.value);
    }

    const handleSearchButton = async () => {
        const searchData = {
            search: searchUpdateText
        }
       
        fetchUsers(searchData);
      
        setToogleFetching(true)
    }
    
    useInfiniteScroll(handleAddPage, currentPage, pages);

    return (
        <>
            <div className="title">
                <h1>Поиск людей</h1>
            </div>
            <div className="form">
                <div className="form-container">
                    <div className="form-items">
                        <div className="form-input">
                            <input
                                className="input"
                                type="text"
                                placeholder="Поиск"
                                value={searchUpdateText}
                                onChange={handleUpdateText}
                                ref={searchElement}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSearchButton();
                                    }
                                }}
                            />
                        </div>
                        <div className="form-button">
                            <button className="button" onClick={handleSearchButton}>
                                <div className="form-button-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800.67 800">
                                        <path d="M792.57,752.78l-240.81-240.81c46.59-55.89,71.96-125.63,71.96-199.28,0-83.3-32.44-161.62-91.34-220.52S395.17,.82,311.86,.82,150.25,33.26,91.34,92.17,0,229.38,0,312.69s32.44,161.62,91.34,220.52c58.9,58.9,137.22,91.34,220.52,91.34,74.37,0,144.75-25.87,200.91-73.33l240.68,240.68c10.8,10.8,28.32,10.8,39.12,0h0c10.8-10.8,10.8-28.32,0-39.12Zm-480.71-184.23c-68.34,0-132.6-26.61-180.92-74.94s-74.94-112.58-74.94-180.92,26.61-132.6,74.94-180.92S243.52,56.82,311.86,56.82s132.6,26.61,180.92,74.94c48.33,48.33,74.94,112.58,74.94,180.92s-26.61,132.6-74.94,180.92-112.58,74.94-180.92,74.94Z"/>
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isFetching ? (
                <Preloader />
            ) : (
                <>
                    <div className="user">
                        {userElements.length === 0 ? (
                                <div className="empty-content">
                                    <div className="empty-content-container">
                                        <div className="empty-content-title">
                                            <span>Пользователей нет</span>
                                        </div>
                                    </div>
                                </div>
                        ) : (userElements)}
                    </div>
                    {currentPage < pages ? (
                    <Preloader />
                    ) : ''}
                </>
            )}
            <Footer />
        </>
    );
}

export default UserFragment;