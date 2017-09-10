import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ComponentExd from 'AliasCommon/extentions/ComponentExd';
import UserHead from 'AliasImages/userhead.jpg';
import fontStyles from 'AliasStyles/fonticon/iconfont.css';
import { FontIcon, Link } from 'AliasCommon/ui';


const menuList = [
    {
        icon: 'icon-fav',
        title: '我的收藏',
        url: 'javascript:void(0)'
    },
    {
        icon: 'icon-picture',
        title: '我的相册',
        url: 'javascript:void(0)'
    },
    {
        icon: 'icon-question',
        title: '帮助',
        url: 'javascript:void(0)'
    }
];

class MobileMenu extends ComponentExd {
    constructor(props) {
        super(props);
        const menuDefaultPosition = {
            left: '-85%'
        };
        this.handleOnMenuContextClick = this.handleOnMenuContextClick.bind(this);
        this.handleSignClick = this.handleSignClick.bind(this);
        this.handleSignBlur = this.handleSignBlur.bind(this);
        this.handleOnMenuItemClick = this.handleOnMenuItemClick.bind(this);
        this.transitionEndEvent = this.transitionEndEvent.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onAnimationOpen = this.onAnimationOpen.bind(this);
        this.onAnimationClose = this.onAnimationClose.bind(this);
        this.menuLeft = -85;
        this.isOpen = false;
        this.isAnimationEnd = false;
        if (this.isSupportCss3) {
            menuDefaultPosition.left = '0';
            menuDefaultPosition.transform = 'translateX(-85%)';
            menuDefaultPosition.WebkitTransform = 'translateX(-85%)';
            menuDefaultPosition.MozTransform = 'translateX(-85%)';
            menuDefaultPosition.MsTransform = 'translateX(-85%)';
            menuDefaultPosition.OTransform = 'translateX(-85%)';
        }
        this.state = {
            isEditSign: false,
            defaultStyle: menuDefaultPosition
        };
    }
    handleOnMenuContextClick(event) {
        event.stopPropagation();
    }
    handleSignClick () {
        this.setState({
            isEditSign: true
        });
    }
    handleSignBlur () {
        this.setState({
            isEditSign: false
        });
    }
    componentDidUpdate () {
        this.isRender = true;
        this.state.isEditSign && this.SignInput && this.SignInput.focus();
    }
    componentDidMount () {
        this.addEvent(this.menuContainer, 'transitionEnd', this.transitionEndEvent);
        this.addEvent(this.menuContainer, 'webkitTransitionEnd', this.transitionEndEvent);
        this.addEvent(this.menuContainer, 'mozTransitionEnd', this.transitionEndEvent);
        this.addEvent(this.menuContainer, 'msTransitionEnd', this.transitionEndEvent);
        this.addEvent(this.menuContainer, 'oTransitionEnd', this.transitionEndEvent);
    }
    componentWillUnmount () {
        this.removeEvent(this.menuContainer, 'transitionEnd', this.transitionEndEvent);
        this.removeEvent(this.menuContainer, 'webkitTransitionEnd', this.transitionEndEvent);
        this.removeEvent(this.menuContainer, 'mozTransitionEnd', this.transitionEndEvent);
        this.removeEvent(this.menuContainer, 'msTransitionEnd', this.transitionEndEvent);
        this.removeEvent(this.menuContainer, 'oTransitionEnd', this.transitionEndEvent);
        this.isRender = false;
    }
    transitionEndEvent () {
        if (this.isOpen !== undefined && !this.isOpen) {
            this.props.onClosed && this.props.onClosed();
            this.menuMask.style.display = 'none';
        }
    }
    open() {
        if (!this.isOpen && !this.isAnimationEnd) {
            this.setCss(this.menuMask, 'display', 'block');
            this.isOpen = true;
            this.isAnimationEnd = true;
            this.onAnimationOpen();
        }
    }
    onAnimationOpen () {
        this.menuLeft++;
        if (this.menuLeft > 0) {
            this.isAnimationEnd = false;
            return;
        } else {
            if (this.isSupportCss3) {
                this.setCss3(this.menuContainer, 'transform', 'translateX(' + this.menuLeft + '%)');
            } else {
                this.menuContainer.style.left = this.menuLeft + '%';
            }
            const transPercent = parseFloat(Math.abs(this.menuLeft) / 85);
            this.props.onMenuAnimation && this.props.onMenuAnimation(true, transPercent);
            setTimeout(this.onAnimationOpen, 1);
        }
    }
    onAnimationClose () {
        this.menuLeft--;
        if (this.menuLeft < -85) {
            this.isAnimationEnd = false;
            this.isOpen = false;
            this.setCss(this.menuMask, 'display', 'none');
            return;
        } else {
            if (this.isSupportCss3) {
                this.setCss3(this.menuContainer, 'transform', 'translateX(' + this.menuLeft + '%)');
            } else {
                this.menuContainer.style.left = this.menuLeft + '%';
            }
            const transPercent = parseFloat(Math.abs(this.menuLeft) / 85);
            this.props.onMenuAnimation && this.props.onMenuAnimation(false, transPercent);
            setTimeout(this.onAnimationClose, 1);
        }
    }
    close () {
        if (this.isOpen && !this.isAnimationEnd) {
            this.onAnimationClose();
        }
    }
    handleOnMenuItemClick (event) {
        const sender = event.target;
        let eventSender = null;
        if (sender.tagName !== 'LI') {
            eventSender = this.getParentElement(event.target, 'li');
        } else {
            eventSender = sender;
        }
        if (eventSender !== null && eventSender !== undefined) {
            const parentList = this.getParentElement(eventSender, 'ul');
            if (parentList) {
                const items = parentList.querySelectorAll('li');
                this.removeClass(items, this.styles.active);
            }
            this.addClass(eventSender, this.styles.active);
        }
    }
    render () {
        const iconKey = 'icon-edit';
        const signatureTitle = this.props.message('leftMenu.signature');
        const { defaultStyle } = this.state;
        // console.log(fontStyles);
        return (
            <div ref={(self) => {
                this.menuMask = self;
            }}
            className={this.styles.main_menu}
            onClick={this.props.onHiddenClick}
            >
                <div>
                    <div ref={(self) => {
                        this.menuContainer = self;
                    }} className={this.styles.main_menu_ct} style={defaultStyle} onClick={this.handleOnMenuContextClick}>
                        <div className={this.styles.main_menu_info}>
                            <div className={this.styles.main_menu_name}>
                                <a href="javascript:void(0)">
                                    <img src={UserHead} alt="" />
                                </a>
                                <span>qq250933400(nickname)</span>
                            </div>
                            <div className={this.styles.main_menu_sign}>
                                {!this.state.isEditSign && <span className={classNames([fontStyles.iconfont, fontStyles[iconKey]])} onClick={this.handleSignClick}>{signatureTitle}</span>}
                                {
                                    this.state.isEditSign &&
                                    <input
                                        ref={
                                            (self) => {
                                                this.SignInput = self;
                                            }
                                        }
                                        onBlur={this.handleSignBlur} type="text"
                                        placeholder={signatureTitle}
                                    />
                                }
                            </div>
                        </div>
                        <div className={this.styles.main_menu_list}>
                            <ul ref={(self) => {
                                this.listUL = self;
                            }}
                            >
                                {
                                    menuList && menuList.map && menuList.map((item, index) => {
                                        return (
                                            <li key={index} onClick={this.handleOnMenuItemClick}>
                                                <b />
                                                <Link title={item.title} href={item.url}>
                                                    <div>
                                                        <FontIcon icon={item.icon} />
                                                        <i>{item.title}</i>
                                                    </div>
                                                </Link>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                        <div className={this.styles.main_menu_bottom}>
                            <button className={this.getStyle('main_menu_setting')}>
                                <FontIcon icon="icon-settlesetting" />
                                <span>设置</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

MobileMenu.propTypes = {
    menuData: PropTypes.array.isRequired,
    onHiddenClick: PropTypes.func.isRequired,
    onClosed: PropTypes.func,
    onMenuAnimation: PropTypes.func
};

MobileMenu.defaultProps = {
    menuData: []
};

export default MobileMenu;
