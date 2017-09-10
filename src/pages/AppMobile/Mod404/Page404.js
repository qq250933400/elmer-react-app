import React from 'react';
import ComponentExd from 'AliasCommon/extentions/ComponentExd';
import { FontIcon } from 'AliasCommon/ui';
import Img404 from 'AliasStyles/images/404.png';
// import MobilePage from '../MobilePage';
// import { Header } from 'UI/mobile';

class Page404 extends ComponentExd {
    constructor (props) {
        super(props);
        this.state = {};
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnKeyPress = this.handleOnKeyPress.bind(this);
    }
    handleOnClick () {
        alert('Can not search now!');
    }
    handleOnKeyPress (event) {
        const { keyCode } = event;
        if (keyCode === 13) {
            this.btn.click();
        }
    }
    render () {
        return (
            <div className={this.getStyle('page404')}>
                <img className={this.getStyle('page404Head')} src={Img404} />
                <div className={this.getStyle('page404Action')}>
                    <div>
                        <span>You can go to <a href={this.getUrl('mobile', 'index', 'index')}>home</a> page or search here</span>
                        <div>
                            <input onKeyDown={this.handleOnKeyPress} type="text" placeholder="Search" />
                            <button ref={(self) => {
                                this.btn = self;
                            }} onClick={this.handleOnClick}>
                                <FontIcon icon='icon-search' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Page404;
