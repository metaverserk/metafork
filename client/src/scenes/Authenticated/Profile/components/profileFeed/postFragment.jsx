import React, { useEffect, useState } from 'react';
import PostItemContainer from './postItemContainer';
import TextareaAutosize from 'react-textarea-autosize';
import Preloader from '../../../../../components/Preloader';
import { useInfiniteScroll } from '../../../../../utils';
import ProfileMenu from '../../../../../components/Profile/profileMenu';
import Footer from '../../../../../components/Footer';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { formatText } from '../../../../../utils';


const PostFragment = ({
        isFetching,
        authUserId,
        userId,
        postData,
        addPostBackend,
        currentPage,
        pages,
        addPageBackend,
        uploadPostImageBackend,
        uploadPostVideoBackend,
        postFile,
        postFileType,
        setPostFile,
        uploadFetching
    }) => {

    const [muteSound, setMuteSound] = useState(true);

    const postElements = postData.map(post => 
        <PostItemContainer
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
            authUserId={authUserId}
            like={post.like}
            file={post.file}
            fileType={post.fileType}
            muteSound={muteSound}
            setMuteSound={setMuteSound}
        />
    );

    const [postUpdateText, setPostUpdateText] = useState("");
    const [openEmojiPicker, setOpenEmojiPicker] = useState("");
    
    const addPostElement = React.useRef();
    const uploadImageElement = React.useRef();
    const emojiForm = React.useRef();

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });
    
    // Обновление текста в поле ввода
    const handleAddPostText = () => {
        setPostUpdateText(addPostElement.current.value);
    }

    const formatPostText = formatText(postUpdateText);
    
    // Действие добавления поста на сервер
    const handleAddPostBackend = async () => {
        const date = new Date();
        const newPostData = {
            text: formatPostText,
            date: date,
            file: postFile,
            fileType: postFileType
        }

        await addPostBackend(newPostData);
        setPostUpdateText("");
        uploadImageElement.current.value = null;
    }
    
    // Действие добавления страниц
    const handleAddPage = async () => {
        await addPageBackend();
    }
    
    // Действие обновления файла в поле
    const handleFileChange = () => {
        const file = uploadImageElement.current.files[0];
        const fileType = file.type.split("/")[0];
        if(fileType === 'image') {
            uploadPostImageBackend(file);
        }
        if(fileType === 'video') {
            uploadPostVideoBackend(file);
        }
    }
    
    // Действие клика по файловому полю
    const handleFileClick = () => {
        uploadImageElement.current.click();
    }
    
    // Действие удаления файла
    const handleFileDelete = () => {
        setPostFile('')
        uploadImageElement.current.value = null;
    }

    // Действие выбора эмодзи
    const handleEmojiSelect = (emoji) => {
        const textarea = addPostElement.current;
        const cursorPosition = textarea.selectionStart;
        const textBeforeCursor = textarea.value.slice(0, cursorPosition);
        const textAfterCursor = textarea.value.slice(cursorPosition);
        const updatedText = `${textBeforeCursor}${emoji.native}${textAfterCursor}`;
        setPostUpdateText(prevState => updatedText);
        const newCursorPosition = cursorPosition + emoji.native.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
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

    // Отправка по нажатию на Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 768) {
            e.preventDefault();
            if (postUpdateText.trim() !=='' || postUpdateText.trim().length !== 0 || postFile) {
                handleAddPostBackend();
            }
        }
    };
      
    useInfiniteScroll(handleAddPage, currentPage, pages);

    return (
        <>
             <ProfileMenu userId={userId} />
            {authUserId == userId && (
                <div className="form">
                    <div className="form-container">
                        <div className="form-items">
                            <div className="form-textarea">
                                <TextareaAutosize 
                                    className="textarea" 
                                    placeholder="Что происходит?" 
                                    onChange={handleAddPostText} 
                                    onKeyDown={handleKeyDown}
                                    ref={addPostElement} 
                                    value={postUpdateText}
                                    maxLength={3000}
                                />
                            </div>
                            <div className="form-button form-button-file">
                                <button className="button" onClick={handleFileClick}>
                                    <div className="form-button-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42.6 42.6">
                                            <path d="M27.49,42.6H15.11c-8.33,0-15.11-6.78-15.11-15.11V15.11C0,6.78,6.78,0,15.11,0h12.38c8.33,0,15.11,6.78,15.11,15.11v12.38c0,8.33-6.78,15.11-15.11,15.11ZM15.11,3.21C8.55,3.21,3.21,8.55,3.21,15.11v12.38c0,6.56,5.34,11.9,11.9,11.9h12.38c6.56,0,11.9-5.34,11.9-11.9V15.11c0-6.56-5.34-11.9-11.9-11.9H15.11Z"/>
                                            <path d="M21.3,32.29c-6.06,0-10.99-4.93-10.99-10.99s4.93-10.99,10.99-10.99,10.99,4.93,10.99,10.99-4.93,10.99-10.99,10.99Zm0-18.78c-4.3,0-7.79,3.5-7.79,7.79s3.5,7.79,7.79,7.79,7.79-3.5,7.79-7.79-3.5-7.79-7.79-7.79Z"/>
                                        </svg>
                                    </div>
                                </button>
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
                                    onClick={handleAddPostBackend} 
                                    disabled={!postFile && (!postUpdateText.trim() || postUpdateText.trim().length === 0)}>
                                    <div className="form-button-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
                                            <path d="M800,399.72c.07,33.14-18.96,63.36-48.89,77.62L122.89,774.93c-11.5,6.27-24.24,9.93-37.31,10.72C38.22,785.55-.1,747.08,0,699.71c.03-12.06,2.59-23.98,7.54-34.98l97.77-222.13h237.57c23.68,0,42.88-19.2,42.88-42.88s-19.2-42.88-42.88-42.88H105.31L7.54,136.85c-19.19-43.3,.36-93.97,43.66-113.16,22.75-10.08,48.75-9.79,71.26,.81h0L750.69,322.1c30.09,14.13,49.31,44.37,49.31,77.62Z"/>
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className="form-upload">
                            <div className="form-upload-input">
                                <input type="file" name="file" ref={uploadImageElement} onChange={handleFileChange}  accept=".jpg, .jpeg, .png, .mp4, .mov"  />
                            </div>
                            {postFile ? (
                            <div className="form-upload-file">
                                <div className="form-upload-file-container">
                                    <div className="form-upload-file-image">
                                        {postFileType === 'image' && (
                                            <img src={postFile} />
                                        )}
                                        {postFileType === 'video' && (
                                            <video src={postFile} autoPlay={true} controls={false} muted></video>
                                        )}
                                    </div>
                                    <div className="form-upload-file-delete" onClick={handleFileDelete}>
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16.2785 6.29537C16.6723 5.90154 17.3108 5.90154 17.7046 6.29537C18.0985 6.68919 18.0985 7.3277 17.7046 7.72152L7.72156 17.7046C7.32774 18.0984 6.68923 18.0984 6.29541 17.7046C5.90159 17.3108 5.90159 16.6723 6.29541 16.2785L16.2785 6.29537Z"></path>
                                            <path d="M6.29537 7.72153C5.90154 7.32771 5.90154 6.6892 6.29537 6.29537C6.68919 5.90155 7.3277 5.90155 7.72152 6.29537L17.7046 16.2785C18.0984 16.6723 18.0984 17.3108 17.7046 17.7046C17.3108 18.0985 16.6723 18.0985 16.2784 17.7046L6.29537 7.72153Z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            ) : ''}
                            {uploadFetching && (
                            <div className="form-upload-preloader">
                                <div className="form-upload-preloader-image">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.22 40.22">
                                        <path d="M20.13,40.22s-.03,0-.04,0C9.03,40.21,.02,31.21,0,20.15c0-1.75,1.42-3.18,3.17-3.18h0c1.75,0,3.17,1.42,3.18,3.17,.01,7.57,6.19,13.73,13.76,13.73h.08c1.72,.03,3.11,1.44,3.11,3.18,0,1.75-1.42,3.17-3.17,3.17Zm16.91-16.95c-1.75,0-3.17-1.42-3.18-3.17,0-7.58-6.18-13.75-13.76-13.75h-.04c-1.75,0-3.18-1.42-3.18-3.18S18.31,0,20.07,0V0s.04,0,.04,0h0c11.08,0,20.1,9.02,20.11,20.1,0,1.75-1.42,3.18-3.17,3.18h0Z"/>
                                    </svg>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {isFetching ? (
                <Preloader />
            ) : (
                <>
                    <div className="post">
                        {postElements.length === 0 ? (
                            <div className="no-content">
                                <div className="no-content-container">
                                    <div className="no-content-cover">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
                                            <path d="M400,800c-75.87,0-136.49-6.23-185.33-19.04-53.58-14.06-95.18-36.45-127.18-68.45-32-32-54.39-73.6-68.45-127.18C6.23,536.49,0,475.87,0,400s6.23-136.49,19.04-185.33c14.06-53.58,36.45-95.18,68.45-127.18,32-32,73.6-54.39,127.18-68.45C263.51,6.23,324.13,0,400,0s136.49,6.23,185.33,19.04c53.58,14.06,95.18,36.45,127.18,68.45,32,32,54.39,73.6,68.45,127.18,12.82,48.84,19.04,109.46,19.04,185.33s-6.23,136.49-19.04,185.33c-14.06,53.58-36.45,95.18-68.45,127.18-32,32-73.6,54.39-127.18,68.45-48.84,12.82-109.46,19.04-185.33,19.04Zm0-744.75c-139.79,0-224.12,21.99-273.44,71.31-49.32,49.32-71.31,133.65-71.31,273.44s21.99,224.12,71.31,273.44c49.32,49.32,133.65,71.31,273.44,71.31s224.12-21.99,273.44-71.31c49.32-49.32,71.31-133.65,71.31-273.44s-21.99-224.12-71.31-273.44c-49.32-49.32-133.65-71.31-273.44-71.31Zm0,547.61H224.76c-15.26,0-27.62-12.37-27.62-27.62s12.37-27.62,27.62-27.62h175.24c15.26,0,27.62,12.37,27.62,27.62s-12.37,27.62-27.62,27.62Zm175.24-175.24H224.76c-15.26,0-27.62-12.37-27.62-27.62s12.37-27.62,27.62-27.62h350.47c15.26,0,27.62,12.37,27.62,27.62s-12.37,27.62-27.62,27.62Zm0-175.24H224.76c-15.26,0-27.62-12.37-27.62-27.62s12.37-27.62,27.62-27.62h350.47c15.26,0,27.62,12.37,27.62,27.62s-12.37,27.62-27.62,27.62Z"></path>
                                        </svg>
                                    </div>
                                    <div className="no-content-title">
                                        <span>Записи отсутствуют</span>
                                    </div>
                                </div>
                            </div>
                        ) : (postElements)}
                    </div>
                    {currentPage < pages ? (
                        <Preloader />
                    ) : ''}
                    <Footer />
                </>
            )}
        </>
    );


}

export default PostFragment;