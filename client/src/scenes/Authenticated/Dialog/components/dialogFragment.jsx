import React, { useState, useEffect, useRef } from 'react';
import DialogMessage from "./dialogMessage";
import TextareaAutosize from 'react-textarea-autosize';
import Preloader from '../../../../components/Preloader';
import { useInfiniteMessageScroll, userFriendlyAddress } from '../../../../utils';
import { NavLink } from 'react-router-dom';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const DialogFragment = ({
        dialogData,
        authUserId,
        dialogUserId,
        addMessageBackend,
        isFetching,
        addPageBackend,
        currentPage,
        pages,
        scrollRef,
        authUserAvatar,
        authUserName,
        authUserVerify,
        authUserWallet,
        roomId,
        userName,
        userWallet
    }) => {

    const [dialogUpdateText, setDialogUpdateText] = useState("");
    const [openEmojiPicker, setOpenEmojiPicker] = useState("");
    
    const wrapperRef = useRef(null);
    const addMessageElement = useRef(null);
    const emojiForm = React.useRef();

    const profilePatch = '/id' + dialogUserId;
 
    
    useEffect(() => {
        scrollRef.current.scrollIntoView({ block: "end" });

    }, [isFetching]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });


    const groupedData = dialogData.reduce((acc, message) => {
        if (!message.date) {
          return acc;
        }
              
        const date = new Date(message.date);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        const dateString = `${day}.${month}.${year}`;
          
        if (acc.length === 0 || acc[1].dateString !== dateString) {
          acc.unshift({ type: 'date', dateString });
        }
        acc.unshift(message);
          
        return acc;
    }, []);
      
    const seenDates = {};
    let dialogElements = [];
    let currentGroup = null;
      
    groupedData.forEach((message) => {
        if (!message.date) {
          return;
        }
      
        const date = new Date(message.date);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        const dateString = `${day}.${month}.${year}`;
      
        if (!seenDates[dateString]) {
          seenDates[dateString] = true;
          if (currentGroup) {
            dialogElements.push(currentGroup);
          }
          currentGroup = { type: 'date', dateString, messages: [] };
        }
      
        currentGroup.messages.push(message);
    });
      
    if (currentGroup) {
        dialogElements.push(currentGroup);
    }
      
    dialogElements = dialogElements.flatMap((group) => {
        const randomId = Math.random().toString(36).slice(2, 11);
        const messages = group.messages.map((message) => {
          const newMessage = { ...message, id: Math.random().toString(36).slice(2, 11) };
          return (
            <DialogMessage
              key={newMessage.id}
              type={newMessage.type}
              id={newMessage.id}
              senderId={newMessage.senderId}
              text={newMessage.text}
              authUserId={authUserId}
              dateMessage={newMessage.date}
            />
          );
        });
      
        return [
          <div className="dialog-message-group" key={randomId}>
            <div className="dialog-message-group-date">
              <span>{group.dateString}</span>
            </div>
            <div className="dialog-message-group-messages">{messages}</div>
          </div>,
        ];
    })
        
    let handleMessageText = async () => {
        setDialogUpdateText(addMessageElement.current.value);
    }

    // Вырезаем все опасные HTML
    const stripHtmlTags = (str) => {
        return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Текст без html тегов
    const safeText = stripHtmlTags(dialogUpdateText.trim()); 

    // Текст без переносов
    const formattedText = safeText.replace(/\n{2,}/g, '\n\n');

    const handleAddMessage = async () => {
        const date = new Date();
        const newMessageData = {
            text: formattedText,
            receiverId: dialogUserId,
            date: date
        };
        await addMessageBackend(newMessageData);
        setDialogUpdateText("");
    };

    // Действие выбора эмодзи
    const handleEmojiSelect = (emoji) => {
        const textarea = addMessageElement.current;
        const updatedText = `${textarea.value}${emoji.native}`; // объединяем предыдущий текст и выбранный эмодзи в правильном формате
        textarea.value = updatedText; // обновляем значение textarea
        setDialogUpdateText(updatedText); // обновляем значение postUpdateText
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

    const handleAddPage = async () => {
        addPageBackend(dialogUserId);
    }

    const handlePreviousPage = async => {
        window.history.back();
    }

    // Отправка по нажатию на Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 768) {
            e.preventDefault();
            if (dialogUpdateText.trim() !=='' || dialogUpdateText.trim().length !== 0) {
                handleAddMessage();
            }
        }
    };

    
    useInfiniteMessageScroll(handleAddPage, currentPage, pages, scrollRef, wrapperRef)


    return (
        <>
            <div className="dialog">
                <div className="dialog-header">
                    <div className="dialog-return" onClick={handlePreviousPage}>
                        <span>Назад</span>
                    </div>
                    <NavLink
                        to={profilePatch}
                        className="dialog-user-name"
                    >
                        <span>{userName ? userName : userFriendlyAddress(userWallet)}</span>
                    </NavLink>
                </div>
                <div className="dialog-wrapper">
                    <div className="dialog-scroll" ref={wrapperRef}>
                        <div className="dialog-history" ref={scrollRef}>
                        {isFetching ? (
                            <Preloader />
                        ) : (
                            <>
                                {dialogElements}
                            </>
                        )}
                        </div>
                    
                    </div>
                </div>
                <div className="dialog-form">
                    <div className="form-items">
                        <div className="form-textarea">
                            <TextareaAutosize
                                className="textarea"
                                placeholder="Введите сообщение"
                                maxRows="4"
                                onChange={handleMessageText}
                                onKeyDown={handleKeyDown}
                                // onKeyDown={(e) => {
                                //     if (e.key === 'Enter' && !e.shiftKey) {
                                //         e.preventDefault();
                                //         if (dialogUpdateText.trim() !=='' || dialogUpdateText.trim().length !== 0) {
                                //             handleAddMessage();
                                //         }
                                //     }
                                // }}
                                ref={addMessageElement}
                                value={dialogUpdateText}
                                maxLength={850}
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
                                onClick={handleAddMessage}
                                disabled={!dialogUpdateText.trim() || dialogUpdateText.trim().length === 0}
                            >
                                <div className="form-button-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
                                        <path d="M800,399.72c.07,33.14-18.96,63.36-48.89,77.62L122.89,774.93c-11.5,6.27-24.24,9.93-37.31,10.72C38.22,785.55-.1,747.08,0,699.71c.03-12.06,2.59-23.98,7.54-34.98l97.77-222.13h237.57c23.68,0,42.88-19.2,42.88-42.88s-19.2-42.88-42.88-42.88H105.31L7.54,136.85c-19.19-43.3,.36-93.97,43.66-113.16,22.75-10.08,48.75-9.79,71.26,.81h0L750.69,322.1c30.09,14.13,49.31,44.37,49.31,77.62Z" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DialogFragment;