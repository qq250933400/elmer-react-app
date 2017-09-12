import { connect } from 'react-redux';
import React from 'react';
import { mapStateToProps, mapDispatchToProps } from './mapToProps.js';
import { ModContainers } from './index';

export default (TargetComponent, childProps) => {
    const AppMobileComponent = () => {
        const { PageID } = childProps;
        const modMatch = PageID.match(/(Mod)([a-zA-Z0-9]*)(Page)/);
        const ModKey = [modMatch[1], modMatch[2], 'Container'].join('');
        const ModContainer = ModContainers[ModKey] && ModContainers[ModKey](TargetComponent, childProps);
        let DisplayComponent = ModContainer || TargetComponent;
        return (<DisplayComponent {...childProps} />);
    };
    return connect(mapStateToProps, mapDispatchToProps)(AppMobileComponent);
};
