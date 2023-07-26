import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import GamesFragment from './components/gamesFragment';


const Games = ({
    authUserId,
}) => {

    useEffect(() => {

        document.title = 'Игры';

    }, []);

    return (
        <GamesFragment
            authUserId={authUserId}
        />
    );
};

const mapStateToProps = state => ({
    authUserId: state.auth.authUserId
});

export default connect(mapStateToProps, {
    
})(Games);