import { connect } from 'react-redux';
import React from 'react';
import { mapStateToProps, mapDispatchToProps } from './mapToProps.js';

export default (TargetComponent, props) => {
    const ModIndexComponent = () => {
        return (<TargetComponent {...props} />);
    };
    return connect(mapStateToProps, mapDispatchToProps)(ModIndexComponent);
};
