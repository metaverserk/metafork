import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {connect} from 'react-redux';


const AuthRoute = (props) => {
    return props.authUserId ? <Navigate to="/feed" /> : <Outlet />;
  };

let mapStateToProps = (state) => ({
  authUserId: state.auth.authUserId
});


export default connect(mapStateToProps)(AuthRoute);