import { connect } from 'react-redux';
import React from 'react';
import { mapStateToProps, mapDispatchToProps } from './mapToProps';

export default (TargetComponent, props) => {
    console.log(TargetComponent);
    const Mod404Component = () => {
        return (<TargetComponent {...props} />);
    };
    return connect(mapStateToProps, mapDispatchToProps)(Mod404Component);
};
