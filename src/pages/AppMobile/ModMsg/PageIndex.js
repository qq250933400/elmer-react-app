import React from 'react';
import ComponentExd from '../../../common/extentions/ComponentExd';
import MobilePage from '../MobilePage';

class PageIndex extends ComponentExd {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render () {
        return (
            <MobilePage {...this.props}>
                AppMobileModMsgPageIndex
            </MobilePage>
        );
    }
}

PageIndex.propTypes = {};

PageIndex.defaultProps = {};

export default PageIndex;
