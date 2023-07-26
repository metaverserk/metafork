import React, { useState, useEffect, useRef } from 'react';
import Avatar from '../../assets/images/avatars/no-avatar.png';
import TextareaAutosize from 'react-textarea-autosize';
import { NavLink } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import {addLinksToPost, userFriendlyAddress } from '../../utils'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import CopyToClipboard from 'react-copy-to-clipboard';
import showNotification from '../Notify';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import Emoji from 'react-emoji-render';
import Autolinker from 'autolinker';
import ContentLoader from 'react-content-loader';
import VideoThumbnail from 'react-video-thumbnail';
import { formatText } from '../../utils';



const PostItem = ({
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
        authUserId,
        like,
        file,
        fileType,
        postData,
        deletePostBackend,
        likeBackend,
        deleteLikeBackend,
        editPostBackend,
        muteSound,
        setMuteSound,
        handleToComments
    }) => {


    const [isVertical, setIsVertical] = useState(null);
    const [editPost, setEditPost] = useState(false);
    const [editPostText, setEditPostText] = useState(text);
    const [openEmojiPicker, setOpenEmojiPicker] = useState("");
    const editPostElement = React.useRef();
    const videoRef = useRef(null);

    const [showContent, setShowContent] = useState(false);


    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 1000);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            clearTimeout(timer);
        };
    });

    useEffect(() => {
        if (!videoRef.current) return;
      
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Воспроизводим видео
              videoRef.current.play();
            } else {
              // Ставим видео на паузу
              if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }
            }
          });
        }, { threshold: 0.5 });
      
        observer.observe(videoRef.current);
      
        return () => {
          if (videoRef.current) {
            videoRef.current.pause();
          }
        };
    }, [videoRef]);
    


    const emojiForm = React.useRef();

    const image = new Image();
    const video = document.createElement('video');

    // Обновление текста в поле ввода
    const handleEditPostText = () => {
        setEditPostText(editPostElement.current.value);
    }
    
    const formatEditPostText = formatText(editPostText)

    const handleEditPostBackend = async () => {
        const editPostData = {
            id: id,
            text: formatEditPostText
        }
        await editPostBackend(editPostData);
        setEditPost(false);
        showNotification('Публикация изменена')
    }

    // Отправка по нажатию на Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 768) {
            e.preventDefault();
            if (editPostText.trim() !=='' || editPostText.trim().length !== 0 || file) {
                handleEditPostBackend();
            }
        }
    };

    // Действие выбора эмодзи
    const handleEmojiSelect = (emoji) => {
        const textarea = editPostElement.current;
        const cursorPosition = textarea.selectionStart; // получаем текущую позицию курсора
        const textBeforeCursor = textarea.value.slice(0, cursorPosition); // получаем текст до курсора
        const textAfterCursor = textarea.value.slice(cursorPosition); // получаем текст после курсора
        const updatedText = `${textBeforeCursor}${emoji.native}${textAfterCursor}`; // объединяем текст до курсора, эмодзи и текст после курсора
        textarea.value = updatedText; // обновляем значение textarea
        setEditPostText(updatedText); // обновляем значение postUpdateText
    }

    // Действие открытие попапа с эмодзи
    const handleEmojiPickerOpen = () => {
        setOpenEmojiPicker(true);
    }

    // Действие закрытия попапа с эмодзи
    const handleClickOutside = (event) => {
        if (openEmojiPicker && !emojiForm.current.contains(event.target)) {
            setOpenEmojiPicker(false);
        }
    }

    const editPostButton = () => {
        setEditPost(true);
    }

    const deletePostButton = () => {
        deletePostBackend(id);
    }

    const likeButton = () => {
        likeBackend(id)
    }

    const deleteLikeButton = () => {
        deleteLikeBackend(id)
    }

    const handleMuteSound = () => {
        setMuteSound(true);
    }

    const handleUnmuteSound = () => {
        setMuteSound(false);
    }

    const userLink = "/id" +postUserId;
    const postLink = "/post/" +id;

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

    const MAX_LENGTH = 500;
    const shortenedText = linkedText.length > MAX_LENGTH ? `${linkedText.slice(0, MAX_LENGTH)}...` : linkedText;
  
    image.src = file;


    image.onload = () => {
        setIsVertical(image.naturalHeight > image.naturalWidth);
    };
 
    video.src = file;

    video.onloadedmetadata = () => {
        setIsVertical(video.videoHeight > video.videoWidth);
    }; 

    const notifyToClipboard = () => {
        showNotification('Ссылка на пост скопирована');
    }

    const handleVideoLoaded = () => {
        console.log('Загружено')
    }

    return (
        <div className="post-item" id={id}>
            <div className="post-container">
                <div className="post-header">
                    <div className="post-author">
                        <NavLink
                            to={userLink}
                            className="post-author-avatar"
                        >
                            <div className={avatarType === 'nft' ? "post-author-avatar-image post-author-avatar-nft" : "post-author-avatar-image"} style={{ display: !showContent && 'none' }}>
                                <img src={avatar ? avatar : Avatar} />
                            </div>
                            {!showContent && (
                                <div className="user-avatar-preloader">
                                    <ContentLoader
                                        speed={1}
                                        width={45}
                                        height={45}
                                        viewBox="0 0 200 200"
                                        backgroundColor="#232525"
                                        foregroundColor="#393c3c"
                                    >
                                        <rect x="0" y="0" rx="5" ry="5" width="200" height="200" />
                                    </ContentLoader>
                                </div>
                            )}
                        </NavLink>
                        <div className="post-author-info">
                            <div className="post-author-header">
                                <NavLink
                                    to={userLink}
                                    className="post-author-name"
                                >
                                    <span>{!name ? userFriendlyAddress(wallet) : name}</span>
                                </NavLink>
                                {verify ? (
                                    <div className="post-author-verify">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 666.63 666.83">
                                            <path d="M651.83,291.42l-45.33-52.67c-8.67-10-15.67-28.67-15.67-42v-56.67c0-35.33-29-64.33-64.33-64.33h-56.67c-13,0-32-7-42-15.67l-52.67-45.33c-23-19.67-60.67-19.67-84,0l-52.33,45.67c-10,8.33-29,15.33-42,15.33h-57.67c-35.33,0-64.33,29-64.33,64.33v57c0,13-7,31.67-15.33,41.67l-45,53c-19.33,23-19.33,60.33,0,83.33l45,53c8.33,10,15.33,28.67,15.33,41.67v57c0,35.33,29,64.33,64.33,64.33h57.67c13,0,32,7,42,15.67l52.67,45.33c23,19.67,60.67,19.67,84,0l52.67-45.33c10-8.67,28.67-15.67,42-15.67h56.67c35.33,0,64.33-29,64.33-64.33v-56.67c0-13,7-32,15.67-42l45.33-52.67c19.33-23,19.33-61-.33-84Zm-180-21l-161,161c-4.67,4.67-11,7.33-17.67,7.33s-13-2.67-17.67-7.33l-80.67-80.67c-9.67-9.67-9.67-25.67,0-35.33,9.67-9.67,25.67-9.67,35.33,0l63,63,143.33-143.33c9.67-9.67,25.67-9.67,35.33,0,9.67,9.67,9.67,25.67,0,35.33Z"/>
                                        </svg>
                                    </div>
                                ) : ''}
                                
                            </div>
                            <div className="post-author-date">
                                <span><ReactTimeAgo date={Date.parse(date)} locale="ru-RU"/></span>
                            </div>
                        </div>
                    </div>
                    {authUserId ? (
                        <div className="post-menu">
                            <div className="post-menu-button">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 190">
                                    <circle cx="25.38" cy="95" r="25.38"/>
                                    <circle cx="95" cy="95" r="25.38"/>
                                    <circle cx="164.62" cy="95" r="25.38"/>
                                </svg>
                            </div>
                            <div className="post-dropdown">
                                <CopyToClipboard text={'https://metafork.io' +postLink}>
                                <div className="post-dropdown-button" onClick={notifyToClipboard}>
                                    <span>Поделиться</span>
                                </div>
                                </CopyToClipboard>
                                {postUserId == authUserId && window.location.pathname !== '/feed' ? (
                                    <>
                                        <div className="post-dropdown-button" onClick={editPostButton}>
                                            <span>Редактировать</span>
                                        </div>
                                        <div className="post-dropdown-button" onClick={deletePostButton}>
                                            <span>Удалить</span>
                                        </div>
                                    </>
                                ) : ''}
                            </div>
                        </div>
                    ) : ''}
                </div>
                {editPost ? (
                    <div className="post-edit">
                        <div className="form-items">
                            <div className="form-textarea">
                                <TextareaAutosize 
                                    className="textarea" 
                                    placeholder="Введите описание поста" 
                                    onChange={handleEditPostText} 
                                    onKeyDown={handleKeyDown}
                                    ref={editPostElement} 
                                    value={editPostText}
                                    maxLength={3000}
                                />
                            </div>
                            <div className="form-button form-button-emoji">
                                <button className="button" onClick={handleEmojiPickerOpen}>
                                    <div className="form-button-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42.6 42.6">
                                            <path d="M21.3,42.6C9.56,42.6,0,33.05,0,21.3S9.56,0,21.3,0s21.3,9.56,21.3,21.3-9.55,21.3-21.3,21.3Zm0-39.37C11.34,3.24,3.24,11.34,3.24,21.3s8.1,18.07,18.07,18.07,18.07-8.1,18.07-18.07S31.26,3.24,21.3,3.24Z"/>
                                            <circle cx="27.3" cy="17.08" r="2.78"/>
                                            <path d="M21.3,33.06c-4.44,0-8.53-1.81-11.47-5.03-.64-.7-.51-1.81,.25-2.36h0c.66-.49,1.57-.38,2.13,.23,2.34,2.54,5.58,3.96,9.09,3.96s6.75-1.43,9.09-3.96c.56-.6,1.47-.71,2.13-.23h0c.76,.56,.89,1.67,.25,2.36-2.94,3.21-7.04,5.03-11.47,5.03Z"/>
                                            <circle cx="15.3" cy="17.08" r="2.78"/>
                                        </svg>
                                    </div>
                                </button>
                                {openEmojiPicker ? (
                                <div className="form-emoji" ref={emojiForm}>
                                    <Picker
                                        data={data}
                                        onEmojiSelect={handleEmojiSelect}
                                        previewPosition="none"
                                        locale="ru"
                                        theme="dark"
                                    />
                                </div>
                                ) : ''}
                            </div>
                            <div className="form-button">
                                <button 
                                    className="button" 
                                    onClick={handleEditPostBackend} 
                                    disabled={!file && (!editPostText.trim() || editPostText.trim().length === 0)}
                                >
                                    <div className="form-button-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
                                            <path d="M800,399.72c.07,33.14-18.96,63.36-48.89,77.62L122.89,774.93c-11.5,6.27-24.24,9.93-37.31,10.72C38.22,785.55-.1,747.08,0,699.71c.03-12.06,2.59-23.98,7.54-34.98l97.77-222.13h237.57c23.68,0,42.88-19.2,42.88-42.88s-19.2-42.88-42.88-42.88H105.31L7.54,136.85c-19.19-43.3,.36-93.97,43.66-113.16,22.75-10.08,48.75-9.79,71.26,.81h0L750.69,322.1c30.09,14.13,49.31,44.37,49.31,77.62Z"/>
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                    {text && (
                        <div className="post-text">
                            <p dangerouslySetInnerHTML={{ __html: shortenedText }}></p>
                        </div>
                    )}
                    {text && text.length > MAX_LENGTH && (
                        <div className="post-full">
                            <NavLink
                                to={postLink}
                                className="post-full-link"
                                onClick={handleToComments}
                            >
                                <span>Читать далее…</span>
                            </NavLink>
                        </div>
                    )}
                    </>
                )}
                {file && (
                    <>  
                        {!showContent && (
                            <div className="post-preloader">
                                <ContentLoader
                                    speed={1}
                                    width={1200}
                                    height={600}
                                    viewBox="0 0 1200 600"
                                    backgroundColor="#232525"
                                    foregroundColor="#393c3c"
                                >
                                    <rect x="0" y="0" rx="5" ry="5" width="1200" height="600" />
                                </ContentLoader>
                            </div>
                        )}
                        <div className="post-file" style={{ display: !showContent && 'none' }}>
                            {fileType === 'image' && (
                                <div className={isVertical ? "post-image post-image-vertical" : "post-image"}>
                                    <img src={file} />
                                    {isVertical ? (
                                        <div className="post-image-blur" style={{backgroundImage: `url(${file})`}}></div>
                                    ) : ''}
                                </div>
                            )}

                            {fileType === 'video' && (
                                <div className={isVertical ? "post-video post-video-vertical" : "post-video"}>
                                    <div className="post-video-player">
                                        <video
                                            autoPlay={true}
                                            controls={false}
                                            muted={muteSound}
                                            playsInline
                                            loop
                                            ref={videoRef}
                                            onLoadedData={handleVideoLoaded}
                                        >
                                            <source src={file}type="video/mp4" />
                                        </video>
                                        {muteSound ? (
                                        <div className="post-video-mute" onClick={handleUnmuteSound}>
                                            <div className="post-video-mute-button">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
                                                    <path d="M541.36,516.83h0c11.72,9.6,29.39,5.84,36.06-7.76,16.16-32.95,25.24-69.97,25.24-109.07s-9.08-76.11-25.23-109.05c-6.67-13.6-24.34-17.36-36.06-7.76h0c-8.5,6.96-10.99,18.85-6.17,28.72,13,26.62,20.3,56.52,20.3,88.09s-7.3,61.48-20.31,88.1c-4.82,9.88-2.34,21.76,6.17,28.73Z"/>
                                                    <path d="M600.76,565.48h0c11.36,9.31,28.32,6.04,35.54-6.75,27.05-47.91,41.45-102.21,41.45-158.73s-14.4-110.8-41.44-158.71c-7.22-12.79-24.18-16.06-35.54-6.75h0c-8.86,7.26-11.23,19.83-5.6,29.8,23.12,40.94,35.43,87.35,35.43,135.65s-12.31,94.73-35.44,135.67c-5.63,9.97-3.26,22.55,5.6,29.81Z"/>
                                                    <path d="M494.24,498.67V187.5c0-8.01-2.55-15.81-7.3-22.26-12.28-16.68-35.75-20.24-52.43-7.96-.36,.25-.69,.52-1.03,.8l-142.91,117.03h-66.37l270.04,223.56Z"/>
                                                    <path d="M184.42,309.01c-.11,1.18-.18,2.38-.18,3.6v174.73c0,20.71,16.79,37.5,37.5,37.5h68.86l142.91,117.03c.34,.28,.67,.55,1.03,.8,6.43,4.75,14.21,7.32,22.2,7.33,20.71,0,37.5-16.79,37.5-37.5v-47L184.42,309.01Z"/>
                                                    <rect x="12.12" y="374.25" width="800" height="51.48" rx="25.74" ry="25.74" transform="translate(349.74 -170.92) rotate(39.62)"/>
                                                </svg>
                                            </div>
                                        </div>
                                        ) : (
                                        <div className="post-video-mute" onClick={handleMuteSound}>
                                            <div className="post-video-mute-button">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
                                                    <path d="M456.74,650c-7.99,0-15.78-2.57-22.2-7.33-.36-.25-.69-.52-1.03-.8l-142.91-117.03h-68.86c-20.71,0-37.5-16.79-37.5-37.5v-174.73c0-20.71,16.79-37.5,37.5-37.5h68.83l142.91-117.03c.34-.28,.67-.55,1.03-.8,16.68-12.28,40.15-8.71,52.43,7.96,4.75,6.45,7.31,14.25,7.3,22.26v425c0,20.71-16.79,37.5-37.5,37.5Z"/>
                                                    <path d="M541.36,516.83h0c11.72,9.6,29.39,5.84,36.06-7.76,16.16-32.95,25.24-69.97,25.24-109.07s-9.08-76.11-25.23-109.05c-6.67-13.6-24.34-17.36-36.06-7.76h0c-8.5,6.96-10.99,18.85-6.17,28.72,13,26.62,20.3,56.52,20.3,88.09s-7.3,61.48-20.31,88.1c-4.82,9.88-2.34,21.76,6.17,28.73Z"/>
                                                    <path d="M600.76,565.48h0c11.36,9.31,28.32,6.04,35.54-6.75,27.05-47.91,41.45-102.21,41.45-158.73s-14.4-110.8-41.44-158.71c-7.22-12.79-24.18-16.06-35.54-6.75h0c-8.86,7.26-11.23,19.83-5.6,29.8,23.12,40.94,35.43,87.35,35.43,135.65s-12.31,94.73-35.44,135.67c-5.63,9.97-3.26,22.55,5.6,29.81Z"/>
                                                </svg>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                    {isVertical ? (
                                        <div className="post-video-blur" style={{background: "#000000"}}></div>
                                    ) : ''}
                                </div>
                            )}
                        </div>
                    </>
                )}
                <div className="post-action">
                    <div className="post-action-items">
                        {authUserId ? (
                        <div className="post-action-item">
                            {like ? (
                                <div className="post-action-button active" onClick={deleteLikeButton}>
                                    <div className="post-action-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 733.33 600">
                                            <path d="M533.33,0c-70,0-131.67,35-166.67,90C331.67,35,270,0,200,0,90,0,0,90,0,200c0,198.33,366.67,400,366.67,400,0,0,366.67-200,366.67-400C733.33,90,643.33,0,533.33,0h0Z"/>
                                        </svg>
                                    </div>
                                    <div className="post-action-title">
                                        <span>{likes}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="post-action-button" onClick={likeButton}>
                                    <div className="post-action-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 733.33 600">
                                            <path d="M533.33,0c-70,0-131.67,35-166.67,90C331.67,35,270,0,200,0,90,0,0,90,0,200c0,198.33,366.67,400,366.67,400,0,0,366.67-200,366.67-400C733.33,90,643.33,0,533.33,0h0Z"/>
                                        </svg>
                                    </div>
                                    <div className="post-action-title">
                                        <span>{likes}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        ) : ''}
                        <div className="post-action-item">
                            <NavLink 
                                to={postLink}
                                className="post-action-button"
                                onClick={handleToComments}
                            >
                                <div className="post-action-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 733.33 605.34">
                                        <path d="M636.32,0H97.01C43.52,0,0,43.52,0,97.01V420.38c0,53.49,43.52,97.01,97.01,97.01H243.4c14.48,0,26.26,11.78,26.26,26.26,0,25.03,14.94,47.39,38.05,56.96,7.67,3.18,15.7,4.72,23.65,4.72,16.01,0,31.71-6.27,43.53-18.09l60.38-60.38c6.1-6.11,14.22-9.47,22.85-9.47h178.21c53.49,0,97.01-43.52,97.01-97.01V97.01c0-53.49-43.52-97.01-97.01-97.01Z"/>
                                    </svg>
                                </div>
                                <div className="post-action-title">
                                    <span>{comments}</span>
                                </div>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostItem;