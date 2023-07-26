import React, {useEffect} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import Header from './components/Header/headerContainer';
import Sidebar from './components/Sidebar/sidebarContainer';
import Profile from './scenes/Authenticated/Profile';
import Feed from './scenes/Authenticated/Feed';
import Users from './scenes/Authenticated/Users';
import Dialogs from './scenes/Authenticated/Dialogs';
import Dialog from './scenes/Authenticated/Dialog';
import Settings from './scenes/Authenticated/Settings';
import Help from './scenes/Authenticated/Help';
import Login from './scenes/UnAuthenticated/Login';
import TimeAgo from 'javascript-time-ago';
import ru from 'javascript-time-ago/locale/ru.json'
import GuestRoute from './routes/guestRoute';
import AuthRoute from './routes/authRoute';
import { setConnectionRestored, authWallet, setAuthUserId, setUnreadDialog, setUnreadNotify} from './redux/reducers/authReducer';
import { connect } from 'react-redux';
import { connector, isConnectionRestored } from './connector';
import { authUser } from './api/auth';
import Followers from './scenes/Authenticated/Followers';
import Following from './scenes/Authenticated/Following';
import Post from './scenes/Authenticated/Post';
import Nft from './scenes/Authenticated/Nft';
import { socket } from './socket'
import {getMessageNotify, getNotifyCount} from './api/notifications'
import Notification from './scenes/Authenticated/Notifications'
import Error from './scenes/Authenticated/404';
import Jettons from './scenes/Authenticated/Jettons';
import Games from './scenes/Authenticated/Games';


const App = ({
    setAuthUserId,
    authWallet,
    setConnectionRestored,
    setUnreadDialog,
    setUnreadNotify,
    authUserId,
    connectionRestored,
    store
}) => {

    TimeAgo.addLocale(ru);
    const scrollElement = React.useRef();

    useEffect(() => {

        // Соединение с Ton Connect
        const unsubscribe = connector.onStatusChange(wallet => {
            authWallet(wallet.account.address);
            const walletAddress = { wallet: wallet.account.address };
            handleAuthUser(walletAddress);
        });
    
        const timeoutId = setTimeout(() => {
            isConnectionRestored.then(() => setConnectionRestored(true));
        }, 1200);
    
        handleUnreadMessages();
        handleUnreadNotify();
        
        socket.on('updateUnreadMessages', handleUpdateUnreadMessages);
        socket.on('updateUnreadNotify', handleUpdateUnreadNotify);
    
        return () => {
            unsubscribe();
            clearTimeout(timeoutId);
            socket.off('updateUnreadMessages', handleUpdateUnreadMessages);
            socket.off('updateUnreadNotify', handleUpdateUnreadNotify);
        };
    }, [authUserId]);


    // Авторизация пользователя
    const handleAuthUser = async walletAddress => {
        try {
            const response = await authUser(walletAddress);
            setAuthUserId(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Получение непрочитанных сообщений
    const handleUnreadMessages = async () => {
        try {
            const response = await getMessageNotify();
            setUnreadDialog(response.data.unread);
        } catch (error) {
            console.error(error);
        }
    };

    // Получение непрочитанных уведомлений
    const handleUnreadNotify = async () => {
        try {
            const response = await getNotifyCount();
            setUnreadNotify(response.data.unread);
        } catch (error) {
            console.error(error);
        }
    };

    // Обновление непрочитанных сообщений
    const handleUpdateUnreadMessages = async userId => {
        if (authUserId === userId) {
            try {
                setTimeout(async() => {
                    const response = await getMessageNotify();
                    setUnreadDialog(response.data.unread);
                }, 150);
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Обновление непрочитанных уведомлений
    const handleUpdateUnreadNotify = async newNotify => {
        if (newNotify.userId === authUserId) {
            try {
                const response = await getNotifyCount();
                setUnreadNotify(response.data.unread);
            } catch (error) {
                console.error(error);
            }
        }
    };

    window.addEventListener("scroll", () => {
        if (scrollElement.current && window.scrollY > 500) {
            scrollElement.current.classList.add("scroll-active");
        } else if (scrollElement.current) {
            scrollElement.current.classList.remove("scroll-active");
        }
    });

    const handleScrollUp = () => {
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
    }

    if(!connectionRestored) {
        return (
            <div className="content-preloader">
                <div className="content-preloader-image">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.22 40.22">
                        <path d="M20.13,40.22s-.03,0-.04,0C9.03,40.21,.02,31.21,0,20.15c0-1.75,1.42-3.18,3.17-3.18h0c1.75,0,3.17,1.42,3.18,3.17,.01,7.57,6.19,13.73,13.76,13.73h.08c1.72,.03,3.11,1.44,3.11,3.18,0,1.75-1.42,3.17-3.17,3.17Zm16.91-16.95c-1.75,0-3.17-1.42-3.18-3.17,0-7.58-6.18-13.75-13.76-13.75h-.04c-1.75,0-3.18-1.42-3.18-3.18S18.31,0,20.07,0V0s.04,0,.04,0h0c11.08,0,20.1,9.02,20.11,20.1,0,1.75-1.42,3.18-3.17,3.18h0Z"/>
                    </svg>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" fill="none" stroke="#ffffff" strokeWidth="14" r="35" strokeDasharray="164.93361431346415 56.97787143782138"></circle>
                    </svg> */}
                </div>
            </div>
        )
    }

    return (
        <>
            <Header />
            <div className="content">
                <div className="mid">
                    <div className="main">
                        <div className="main-sidebar">
                            <Sidebar />
                        </div>
                        <div className="main-content">
                            <Routes>
                                <Route path="/" element={ <Navigate to="/feed" /> } />
                                <Route path="/id" element={<Navigate to="/feed" /> } />
                                <Route path="/:userLink?" element={ <Profile store={store} /> } />
                                <Route path="/:userLink?/followers" element={ <Followers store={store} /> } />
                                <Route path="/:userLink?/following" element={ <Following store={store} /> } />
                                <Route path="/:userLink?/nft" element={ <Nft store={store} /> } />
                                <Route path="/:userLink?/jettons" element={ <Jettons store={store} /> } />
                                <Route path="/post/:postId" element={ <Post store={store} socket={socket} /> } />
                                <Route path="/feed" element={ <Feed store={store} /> } />
                                <Route path="/help" element={ <Help store={store} /> } />
                                <Route element={ <GuestRoute />} >
                                    <Route path="im" element={<Dialogs store={store} socket={socket} />}/>
                                    <Route path="im/:dialogUserId" element={<Dialog store={store} socket={socket} />}/>
                                    <Route path="settings" element={<Settings store={store} />}/>
                                    <Route path="/notifications" element={ <Notification store={store} /> } />
                                    {/* <Route path="games" element={<Games store={store} />}/> */}
                                </Route>
                                <Route path="users" element={<Users store={store} />}/>
                                <Route element={ <AuthRoute />} >
                                    <Route path="auth" element={<Login store={store} />}/>
                                </Route>
                                <Route path="*" element={<Error store={store} />} />
                            </Routes>
                            <div className="scroll" ref={scrollElement} onClick={handleScrollUp}>
                                <div className="scroll-container">
                                    <div className="scroll-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 233.34">
                                            <path d="M176.43,9.77c13.02-13.02,34.12-13.02,47.14,0l166.67,166.67c13.01,13.01,13.01,34.12,0,47.14-13.02,13.02-34.12,13.02-47.14,0L200,80.48,56.9,223.58c-13.02,13.02-34.12,13.02-47.14,0s-13.02-34.12,0-47.14L176.43,9.77Z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

let mapStateToProps = (state) => {
    return {
        authUserId: state.auth.authUserId,
        connectionRestored: state.auth.connectionRestored
    }
}

export default connect(mapStateToProps, {
    authWallet,
    setAuthUserId,
    setConnectionRestored,
    setUnreadDialog,
    setUnreadNotify
})(App);