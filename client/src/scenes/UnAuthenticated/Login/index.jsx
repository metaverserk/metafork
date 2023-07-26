import React, {useEffect} from 'react';
import LoginFragment from './components/loginFragment';
import {connect} from 'react-redux';
import {setWallet, setWalletConnectionUrl, authWallet} from '../../../redux/reducers/authReducer';

const Login = (props) => {

    useEffect(() => {
        document.title = 'Авторизация';
    }, []);

    return (
        <LoginFragment {...props} />
    );
}

let mapStateToProps = (state) => {
    return {
        walletConnectionUrl: state.auth.walletConnectionUrl,
        walletList: state.auth.walletList,
        setWalletName: state.auth.setWalletName,
        wallet: state.auth.wallet
    }
}


export default connect(mapStateToProps, {
    setWalletConnectionUrl,
    setWallet,
    authWallet
})(Login);