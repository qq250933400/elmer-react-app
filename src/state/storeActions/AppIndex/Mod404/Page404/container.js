import { connect } from 'react-redux';
import Page404 from 'AliasPages/AppIndex/Mod404/Page404';

const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const Page404Container = connect(
    mapStateToProps,
    mapDispatchToProps
)(Page404);

export default Page404Container;
