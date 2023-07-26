import React from 'react';
import {connect} from 'react-redux';
import HeaderFragment from './headerFragment';
import { connector } from '../../connector';
import { logOut } from '../../api/auth'
import { authWallet } from '../../redux/reducers/authReducer';



const Header = ({
    wallet,
    connectionRestored,
    authUserId,
    authUserAvatar,
    authUserName
}) => {

    const disconnectUser = () => {
        connector.disconnect();
        window.location.reload();
        logOut().then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <HeaderFragment
            wallet={wallet}
            connectionRestored={connectionRestored}
            authUserId={authUserId}
            disconnectUser={disconnectUser}
            authUserAvatar={authUserAvatar}
            authUserName={authUserName}
        />
    );
}

let mapStateToProps = (state) => {
    return {
        wallet: state.auth.wallet,
        connectionRestored: state.auth.connectionRestored,
        authUserId: state.auth.authUserId,
        authUserAvatar: state.auth.authUserAvatar,
        authUserName: state.auth.authUserName
    }
}


export default connect(mapStateToProps, {
    authWallet,
})(Header);