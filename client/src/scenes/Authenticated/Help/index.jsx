import React, {useEffect} from 'react';
import HelpFragment from './components/helpFragment';
import { connect } from 'react-redux';

const Help = () => {

    useEffect(() => {
        document.title = 'Помощь';
    }, []);

    return (
        <HelpFragment />
    );
}

const mapStateToProps = state => ({
    
});

export default connect(mapStateToProps, {
  
})(Help);