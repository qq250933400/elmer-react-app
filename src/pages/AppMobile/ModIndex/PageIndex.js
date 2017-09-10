import React from 'react';
import ComponentExd from 'AliasCommon/extentions/ComponentExd';
import MobilePage from '../MobilePage';
import { FontIcon } from 'AliasCommon/ui';
import fontStyles from 'AliasStyles/fonticon/iconfont.css';
// import { Header } from 'UI/mobile';

class MobileHomePage extends ComponentExd {
    constructor (props) {
        super(props);
        this.state = {};
    }
    render () {
        const fontIcons = [];
        for (const key in fontStyles) {
            if (key !== 'iconfont') {
                fontIcons.push({
                    name: key,
                    value: fontStyles[key]
                });
            }
        }
        return (
            <MobilePage {...this.props}>
                <ul className={this.getStyle('iconList')}>
                    {
                        fontIcons.map((item, index) => {
                            return (
                                <li key={index}>
                                    <FontIcon icon={item.name} />
                                    <i>{item.name}</i>
                                </li>
                            );
                        })
                    }
                </ul>
            </MobilePage>
        );
    }
}

export default MobileHomePage;
