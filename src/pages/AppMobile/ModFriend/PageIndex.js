import React from 'react';
import ComponentExd from '../../../common/extentions/ComponentExd';
import MobilePage from '../MobilePage';
// import { FontIcon } from '../../../common/ui';

class PageIndex extends ComponentExd {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render () {
        return (
            <MobilePage {...this.props}>
                <span>test</span>
            </MobilePage>
        );
    }
}

PageIndex.propTypes = {};

PageIndex.defaultProps = {};

export default PageIndex;
