import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {connect} from 'react-redux';


const GuestRoute = (props) => {
    return props.authUserId ? <Outlet /> : <Navigate to="/auth" />;
  };

let mapStateToProps = (state) => ({
    authUserId: state.auth.authUserId
});


export default connect(mapStateToProps)(GuestRoute);