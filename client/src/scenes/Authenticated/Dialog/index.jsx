import React, {useEffect, useRef} from 'react';
import { addMessage, setMessages, setToogleFetching, addPage, addMessageList, setUserData, deleteUserData } from '../../../redux/reducers/dialogReducer';
import DialogFragment from './components/dialogFragment';
import { getMessages, createMessage, getMessagesPage, readMessages, getDialogUserData } from '../../../api/dialogs';
import {connect} from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMessageNotify } from '../../../api/notifications';
import { setUnreadDialog } from '../../../redux/reducers/authReducer';


const Dialog = ({
        setMessages,
        dialogData,
        authUserId,
        authUserAvatar,
        authUserName,
        authUserVerify,
        authUserWallet,
        addMessage,
        isFetching,
        setToogleFetching,
        addPage,
        addMessageList,
        currentPage,
        pages,
        socket,
        roomId,
        setUserData,
        userName,
        setUnreadDialog,
        userWallet,
        deleteUserData,
    }) => {

    const { dialogUserId } = useParams();
    const wrapperRef = useRef(null);
    const scrollRef = useRef(null);


    useEffect(() => {
        document.title = 'Диалог';

        if (!/^\d+$/.test(dialogUserId)) {
            window.location.replace('/feed'); 
        }

        fetchMessages();
        
        return () => {
            setMessages([]);
            setToogleFetching(true);
            deleteUserData()
        };
    }, []);

    useEffect(() => {

        fetchReadMessages();
        fetchUserData();

        setTimeout(() => {
            fetchMessageNotify();
        }, 90);

        socket.emit('joinRoom', roomId);

        socket.on('updateMessage', (messageData) => {
      
            if (messageData.roomId === roomId || !roomId) {
                addMessage(messageData);
            }
       
            setTimeout(() => {
                scrollRef.current.scrollIntoView({ block: "end" });
            }, 150);
        });

        return () => {
            socket.off('updateMessage'); 
        };
    }, [socket, isFetching, dialogData]);

    // Получение сообщений
    const fetchMessages = async () => {
        try {
            const requestData = { dialogUserId };
            const response = await getMessages(requestData);
            const { items, totalCount, limit, pages, roomId } = response.data;
            setMessages(items, totalCount, limit, pages, roomId);
        } catch (error) {
            if (error.response.status === 404) {
                window.location.replace('/feed'); 
            } else {
                console.log(error);
            }
        } finally {
            setToogleFetching(false);
        }
    };

    // Прочтение сообщения
    const fetchReadMessages = async () => {
        try {
            const requestData = { roomId };
            const response = await readMessages(requestData);
        } catch (error) {
            console.log(error);
        }
    }

    // Обновление информации о непрочтенных сообщениях
    const fetchMessageNotify = async () => {
        try {
            const response = await getMessageNotify();
            setUnreadDialog(response.data.unread);
        } catch (error) {
            console.log(error);
        }
    }

    // Получение информации о пользователе
    const fetchUserData = async () => {
        try {
            const requestData = { dialogUserId };
            const response = await getDialogUserData(requestData);
            setUserData(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    // Отправка сообщения на сервер
    const addMessageBackend = async (newMessageData) => {
        try {
            const response = await createMessage(newMessageData);
            socket.emit('sendMessage', response.data);
            socket.emit('sendDialog', response.data.receiverId);
            socket.emit('sendUnreadMessages', response.data.receiverId);
        } catch (error) {
            console.log(error);
        }
    }

    // Пагинация страниц
    const addPageBackend = async () => {
        try {
            const requestData = { dialogUserId };
            const response = await getMessagesPage(currentPage, requestData);
            const { items } = response.data;
            addMessageList(items);
            addPage();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <DialogFragment
            dialogData={dialogData}
            addMessage={addMessage}
            authUserId={authUserId}
            authUserAvatar={authUserAvatar}
            authUserName={authUserName}
            authUserVerify={authUserVerify}
            authUserWallet={authUserWallet}
            dialogUserId={dialogUserId}
            addMessageBackend={addMessageBackend}
            isFetching={isFetching}
            addPageBackend={addPageBackend}
            currentPage={currentPage}
            pages={pages}
            scrollRef={scrollRef}
            wrapperRef={wrapperRef}
            roomId={roomId}
            userName={userName}
            userWallet={userWallet}
        />
    );
}

let mapStateToProps = (state) => {
    return {
        dialogData: state.dialog.dialogData,
        authUserId: state.auth.authUserId,
        authUserAvatar: state.auth.authUserAvatar,
        authUserName: state.auth.authUserName,
        authUserVerify: state.authUserVerify,
        authUserWallet: state.auth.wallet,
        isFetching: state.dialog.isFetching,
        currentPage: state.dialog.currentPage,
        pages: state.dialog.pages,
        roomId: state.dialog.roomId,
        userName: state.dialog.userName,
        userWallet: state.dialog.userWallet
    }
}

const DialogContainer = connect(mapStateToProps, {
    addMessage,
    setMessages,
    setToogleFetching,
    addPage,
    addMessageList,
    setUserData,
    deleteUserData,
    setUnreadDialog
})(Dialog);

export default DialogContainer;