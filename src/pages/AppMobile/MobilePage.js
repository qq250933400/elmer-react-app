import React from 'react';
import PropTypes from 'prop-types';
import ComponentExd from '../../common/extentions/ComponentExd';
import Styles from 'AliasStyles/style.scss';
import { Header, Footer } from 'AliasUI/mobile';
import MobileMenu from './MobileMenu';
console.log(Styles);
class MobilePage extends ComponentExd {
    constructor(props) {
        super(props);
        this.handleOnHeaderClick = this.handleOnHeaderClick.bind(this);
        this.handleOnMenuClose = this.handleOnMenuClose.bind(this);
        this.handleOnMenuAnimation = this.handleOnMenuAnimation.bind(this);
        console.log(props, 'MobilePage---------------------');
    }
    handleOnHeaderClick () {
        this.menu.open();
    }
    handleOnMenuClose () {
        this.parent.className = '';
        // this.content.style.marginLeft = '0';
        this.menu.close();
    }
    handleOnMenuAnimation(isOpen, percent) {
        const nPercent = (1 - percent) * 85;
        if (this.isSupportCss3) {
            this.setCss3(this.content, 'transform', 'translateX(' + nPercent + '%)');
        } else {
            this.setCss(this.content, 'left', nPercent + '%');
        }
    }
    render () {
        const { hasHeader, hasFooter } = this.props;
        const getContentClassName = () => {
            if (hasHeader && hasFooter) {
                return Styles.contentBoth;
            } else if (hasHeader && !hasFooter) {
                return Styles.contentHeader;
            } else if (!hasHeader && hasFooter) {
                return Styles.contentFooter;
            } else {
                return Styles.contentNone;
            }
        };
        const title = this.props.title || this.props.message('title', true);
        return (
            <div ref={(self) => {
                this.parent = self;
            }}>
                <div className={Styles.context}
                    ref={(self) => {
                        this.content = self;
                    }}
                >
                    {
                        hasHeader && <Header title={title} onHeaderClick={this.handleOnHeaderClick} />
                    }
                    <section className={getContentClassName()}>
                        <div>
                            {this.getChildrenContext(this.props)}
                        </div>
                    </section>
                    {
                        hasFooter && <Footer host={this.props.host} />
                    }
                </div>
                <MobileMenu message={this.props.message} onMenuAnimation={this.handleOnMenuAnimation} ref={(self) => {
                    this.menu = self;
                }}
                onHiddenClick={this.handleOnMenuClose}
                />
            </div>
        );
    }
}

MobilePage.propTypes = {
    footerHeight: PropTypes.number.isRequired,
    hasFooter: PropTypes.bool.isRequired,
    hasHeader: PropTypes.bool.isRequired,
    headerHeight: PropTypes.number.isRequired,
    message: PropTypes.func.isRequired,
    title: PropTypes.string
};

MobilePage.defaultProps = {
    hasHeader: true,
    hasFooter: true,
    headerHeight: 40,
    footerHeight: 50
};

export default MobilePage;
