import React from 'react';
import PropTypes from 'prop-types';
import ComponentExd from '../../../extentions/ComponentExd';
import UserHead from 'AliasImages/userhead.jpg';

class Header extends ComponentExd {
    render () {
        const { onHeaderClick } = this.props;

        return (
            <header>
                <div>
                    <button onClick={onHeaderClick} className={this.styles.user_head}>
                        <img src={UserHead} alt="user_head" />
                    </button>
                    <span>{this.props.title}</span>
                </div>
            </header>
        );
    }
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
    onHeaderClick: PropTypes.func
};

Header.defaultProps = {
    title: 'webframe'
};
export default Header;
