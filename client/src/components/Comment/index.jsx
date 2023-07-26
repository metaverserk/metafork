import React, { useRef, useState } from 'react';
import Avatar from '../../assets/images/avatars/no-avatar.png';
import { NavLink } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import { userFriendlyAddress } from '../../utils';
import TextareaAutosize from 'react-textarea-autosize';
import showNotification from '../Notify';
import Emoji from 'react-emoji-render';
import Autolinker from 'autolinker';
import { formatText } from '../../utils';



const CommentItem = ({
    id,
    text,
    userId,
    name,
    avatar,
    avatarType,
    verify,
    wallet,
    date,
    authUserId,
    deleteCommentBackend,
    getReplyBackend,
    replyCount,
    replyElements,
    replyName,
    replyWallet,
    replyUserId,
    replyCommentId,
    thread,
    addPageReplyBackend,
    commentId,
    deleteReplyBackend,
    parentCommentId,
    addReplyBackend,
    parentPostId
}) => {

    const [isReplying, setIsReplying] = useState(false);  
    const [replyUpdateText, setReplyUpdateText] = useState("");
    const userLink = "/id" +userId;
    const commentReplyLink = "#" +replyCommentId;
    const replyTextElement = useRef(null);

    let currentPage = null;
    let pages = null;


    if(thread) {
        currentPage = thread.currentPage;
        pages = thread.pages;
    }
    
    const handleDeleteComment = () => {
        const commentId = id;
        deleteCommentBackend(commentId);
    };
    
    const handleDeleteReply = () => {
        const replyId = id;
        deleteReplyBackend(replyId, commentId);
    };
    
    const handleGetReply = () => {
        const commentId = id;
        getReplyBackend(commentId);
    };
    
    const handleAddPageReply = () => {
        const commentId = id;
        addPageReplyBackend(commentId, currentPage);
    };
    
    const handleUpdateReplyText = () => {
        setReplyUpdateText(replyTextElement.current.value);
    };

    const formatReplyText = formatText(replyUpdateText);
    
    const handleAddReply = () => {
        const date = new Date();
        const newReplyData = {
            text: formatReplyText,
            postId: parentPostId,
            commentId: parentCommentId,
            date: date,
            replyUserId: userId,
            replyCommentId: id
        };

        addReplyBackend(newReplyData);
        setReplyUpdateText("");
        setIsReplying(false);
        showNotification('Комментарий опубликован')
    };
    
    const handleReplyClick = () => {
        setIsReplying(true);
    };

    // Отправка по нажатию на Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 768) {
            e.preventDefault();
            if (replyUpdateText.trim() !=='' || replyUpdateText.trim().length !== 0) {
                handleAddReply();
            }
        }
    };

    const linkedText = Autolinker.link(text, {
        hashtag: 'twitter',
        truncate: {
            length: 20,
            location: 'end'
        },
        replaceFn : function(match) {    
            switch(match.type) {    
                case 'hashtag':
                    return '<a href="/feed?query=%23' + match.getHashtag() + '">' + '#' + match.getHashtag() + '</a>';
            }
        }
    });


    return (
        <div className="comment-item" id={id}>
            <div className="comment-content">
                <NavLink
                    to={userLink}
                    className="comment-avatar"
                >
                    <div className={avatarType === 'nft' ? "comment-avatar-image comment-avatar-nft" : "comment-avatar-image"}>
                        <img src={avatar ? avatar : Avatar} />
                    </div>
                </NavLink>
                <div className="comment-body">
                    <div className="comment-header">
                        <div className="comment-author">
                            <NavLink
                                to={userLink}
                                className="comment-author-name"
                            >
                                <span>{!name ? userFriendlyAddress(wallet) : name}</span>
                            </NavLink>
                            {verify ? (
                                <div className="comment-author-verify">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 666.63 666.83">
                                        <path d="M651.83,291.42l-45.33-52.67c-8.67-10-15.67-28.67-15.67-42v-56.67c0-35.33-29-64.33-64.33-64.33h-56.67c-13,0-32-7-42-15.67l-52.67-45.33c-23-19.67-60.67-19.67-84,0l-52.33,45.67c-10,8.33-29,15.33-42,15.33h-57.67c-35.33,0-64.33,29-64.33,64.33v57c0,13-7,31.67-15.33,41.67l-45,53c-19.33,23-19.33,60.33,0,83.33l45,53c8.33,10,15.33,28.67,15.33,41.67v57c0,35.33,29,64.33,64.33,64.33h57.67c13,0,32,7,42,15.67l52.67,45.33c23,19.67,60.67,19.67,84,0l52.67-45.33c10-8.67,28.67-15.67,42-15.67h56.67c35.33,0,64.33-29,64.33-64.33v-56.67c0-13,7-32,15.67-42l45.33-52.67c19.33-23,19.33-61-.33-84Zm-180-21l-161,161c-4.67,4.67-11,7.33-17.67,7.33s-13-2.67-17.67-7.33l-80.67-80.67c-9.67-9.67-9.67-25.67,0-35.33,9.67-9.67,25.67-9.67,35.33,0l63,63,143.33-143.33c9.67-9.67,25.67-9.67,35.33,0,9.67,9.67,9.67,25.67,0,35.33Z"/>
                                    </svg>
                                </div>
                            ) : ''}
                        </div>
                        {userId == authUserId ? (
                        <div className="post-menu">
                            <div className="post-menu-button">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 190">
                                    <circle cx="25.38" cy="95" r="25.38"/>
                                    <circle cx="95" cy="95" r="25.38"/>
                                    <circle cx="164.62" cy="95" r="25.38"/>
                                </svg>
                            </div>
                            <div className="post-dropdown">
                                {commentId ? (
                                    <div className="post-dropdown-button" onClick={handleDeleteReply}>
                                        <span>Удалить</span>
                                    </div>
                                ) : (
                                    <div className="post-dropdown-button" onClick={handleDeleteComment}>
                                        <span>Удалить</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        ) : ''}
                    </div>
                    <div className="comment-text">
                            {replyName || replyWallet ? (
                                <>
                                    {replyCommentId != commentId ? (
                                    <>
                                        <a href={commentReplyLink}>
                                            <span>{replyName ? replyName : userFriendlyAddress(replyWallet)}</span>
                                        </a>
                                        <span>, </span>
                                    </>
                                    ) : ''}
                                </>
                            ) : ''}
                            <span dangerouslySetInnerHTML={{ __html: linkedText }}></span>
                    </div>
                    <div className="comment-data">
                        <div className="comment-data-item">
                            <div className="comment-date">
                                <span><ReactTimeAgo date={Date.parse(date)} locale="ru-RU"/></span>
                            </div>
                        </div>
                        {authUserId ? (
                            <div className="comment-data-item">
                                <div className="comment-data-action" onClick={handleReplyClick}>
                                    <span>Ответить</span>
                                </div>
                            </div>
                        ) : ''}
                    </div>
                    {isReplying && (
                    <div className="comment-add">
                        <div className="comment-add-items">
                            <div className="comment-add-textarea">
                                <TextareaAutosize 
                                    className="textarea" 
                                    placeholder="Напишите комментарий" 
                                    value={replyUpdateText}
                                    ref={replyTextElement}
                                    onChange={handleUpdateReplyText}
                                    onKeyDown={handleKeyDown}
                                    maxLength={850}
                                />
                            </div>
                            <div className="comment-add-button">
                                <button  className="button" onClick={handleAddReply} disabled={!replyUpdateText.trim() || replyUpdateText.trim().length === 0}>
                                    <div className="comment-add-button-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
                                            <path d="M800,399.72c.07,33.14-18.96,63.36-48.89,77.62L122.89,774.93c-11.5,6.27-24.24,9.93-37.31,10.72C38.22,785.55-.1,747.08,0,699.71c.03-12.06,2.59-23.98,7.54-34.98l97.77-222.13h237.57c23.68,0,42.88-19.2,42.88-42.88s-19.2-42.88-42.88-42.88H105.31L7.54,136.85c-19.19-43.3,.36-93.97,43.66-113.16,22.75-10.08,48.75-9.79,71.26,.81h0L750.69,322.1c30.09,14.13,49.31,44.37,49.31,77.62Z"/>
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                    )}
                    {replyElements ? (
                        <div className="reply">
                            {replyElements}
                        </div>
                    ) : ''}
                    {replyCount ? (
                        <>
                            {!currentPage ? (
                                <div className="comment-reply">
                                    <div className="comment-reply-action" onClick={handleGetReply}>
                                        <div className="comment-reply-action-title">
                                            <span>Показать ответы ({replyCount})</span>
                                        </div>
                                        <div className="comment-reply-action-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 233.33">
                                                <path d="M223.57,223.57c-13.02,13.02-34.12,13.02-47.14,0L9.76,56.9C-3.25,43.89-3.25,22.78,9.76,9.76c13.02-13.02,34.12-13.02,47.14,0L200,152.86,343.1,9.76c13.02-13.02,34.12-13.02,47.14,0,13.02,13.02,13.02,34.12,0,47.14L223.57,223.57Z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ) : ''}
                            {currentPage && currentPage < pages ? (
                                <div className="comment-reply">
                                    <div className="comment-reply-action" onClick={handleAddPageReply}>
                                        <div className="comment-reply-action-title">
                                            <span>Показать еще</span>
                                        </div>
                                        <div className="comment-reply-action-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 233.33">
                                                <path d="M223.57,223.57c-13.02,13.02-34.12,13.02-47.14,0L9.76,56.9C-3.25,43.89-3.25,22.78,9.76,9.76c13.02-13.02,34.12-13.02,47.14,0L200,152.86,343.1,9.76c13.02-13.02,34.12-13.02,47.14,0,13.02,13.02,13.02,34.12,0,47.14L223.57,223.57Z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ) : ''}
                        </>
                    ) : ''}  
                </div>
            </div>
        </div>
    );
}

export default CommentItem;