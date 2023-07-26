import React, {useEffect, useState} from 'react';
import TestFragment from './components/testFragment';
import {connect} from 'react-redux';

const Test = (props) => {

    return (
        <TestFragment {...props} />
    );
}

let mapStateToProps = (state) => {
    return {
        
    }
}


export default connect(mapStateToProps, {
   
})(Test);