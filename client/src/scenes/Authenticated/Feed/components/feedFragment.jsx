import React, { useState } from 'react';
import PostItem from '../../../../components/Post';
import Preloader from '../../../../components/Preloader';
import { useInfiniteScroll } from '../../../../utils';
import Footer from '../../../../components/Footer';
import FeedMenu from '../../../../components/Feed/feedMenu';

const FeedFragment = ({
        feedData,
        userId,
        currentPage,
        pages,
        isFetching,
        addPageBackend,
        likeBackend,
        deleteLikeBackend,
        authUserId,

    }) => {

    const [muteSound, setMuteSound] = useState(true);

    // Добавление страницы
    const handleAddPage = async () => {
        addPageBackend();
    };

    const handleToComments = () => {
        const currentState = { feedData, currentPage, pages };
        window.history.pushState(currentState, '');
    }
        
    useInfiniteScroll(handleAddPage, currentPage, pages);

    const feedElements = feedData.map((post) => (
        <PostItem
            key={post.id}
            id={post.id}
            text={post.text}
            date={post.date}
            name={post.name}
            avatar={post.avatar}
            avatarType={post.avatarType}
            postUserId={post.userId}
            verify={post.verify}
            likes={post.likes}
            comments={post.comments}
            wallet={post.wallet}
            userId={userId}
            likeBackend={likeBackend}
            deleteLikeBackend={deleteLikeBackend}
            like={post.like}
            file={post.file}
            fileType={post.fileType}
            authUserId={authUserId}
            muteSound={muteSound}
            setMuteSound={setMuteSound}
            handleToComments={handleToComments}
        />
    ));

    return (
        <>
            <div className="title">
                <h1>Лента публикаций</h1>
            </div>
            {authUserId && (
                <FeedMenu
                    authUserId={authUserId}
                />
            )}
            {isFetching ? (
                <Preloader />
            ) : (
                <>
                <div className="post">
                    {feedData.length === 0 ? (
                            <div className="empty-content">
                                <div className="empty-content-container">
                                    <div className="empty-content-title">
                                        <span>Пока публикаций нет</span>
                                    </div>
                                </div>
                            </div>
                    ) : (feedElements)}

                </div>
                {currentPage < pages ? (
                    <Preloader />
                ) : ''}
                <Footer />
                </>
            )}
        </>
    );
};

export default FeedFragment;