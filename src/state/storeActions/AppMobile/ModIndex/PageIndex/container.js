import { connect } from 'react-redux';
import React from 'react';
import PageIndex from 'AliasPages/pages/AppMobile/ModIndex/PageIndex';

const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const PageIndexContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PageIndex);

export default PageIndexContainer;
