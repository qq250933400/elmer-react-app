import React from 'react';
import PropTypes from 'prop-types';
import { FontIcon } from 'AliasCommon/ui';
import ComponentExd from '../../../extentions/ComponentExd';
import styles from './style.scss';

const initButtonData = [
    {
        cmd: 'chat',
        icon: 'icon-chat',
        title: '消息',
        url: '/mobile/msg/index'
    },
    {
        cmd: 'users',
        icon: 'icon-users',
        title: '好友列表',
        url: '/mobile/friend/index'
    },
    {
        cmd: 'user',
        icon: 'icon-ff-user',
        title: '个人中心',
        url: '/mobile/user/index'
    }
];
class Footer extends ComponentExd {
    constructor (props) {
        super(props);
        console.log(props);
    }
    render () {
        const itemWidth = [(parseFloat(100 / this.props.Data.length)).toFixed(2), '%'].join('');
        const footCommand = this.footPage || 'chat';
        return (
            <footer className={this.getStyle('mobile_footer')}>
                <ul className={styles.mobile_foot}>
                    {
                        this.props.Data.map((item, index) => {
                            const active = item.cmd === footCommand ? styles.active : '';
                            return (
                                <li className={active} key={index} style={{ width: itemWidth }}>
                                    <a href={this.getUrl(item.url)}>
                                        <FontIcon icon={item.icon} />
                                    </a>
                                </li>
                            );
                        })
                    }
                </ul>
            </footer>
        );
    }
}

Footer.propTypes = {
    Data: PropTypes.array.isRequired
};

Footer.defaultProps = {
    Data: initButtonData
};

export default Footer;
