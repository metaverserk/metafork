import React from 'react';
import {connect} from 'react-redux';
import SidebarFragment from './sidebarFragment';


const Sidebar = (props) => {

    return (
        <SidebarFragment {...props} />
    );
}

let mapStateToProps = (state) => {
    return {
        authUserId: state.auth.authUserId,
        connectionRestored: state.auth.connectionRestored,
        isUnreadDialog: state.auth.isUnreadDialog,
        isUnreadNotify: state.auth.isUnreadNotify
    }
}


export default connect(mapStateToProps, {

})(Sidebar);