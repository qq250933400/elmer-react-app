import { connect } from 'react-redux';
import PageIndex from 'AliasPages/AppMobile/ModIndex/PageIndex';

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
