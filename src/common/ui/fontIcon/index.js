import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Component from 'AliasCommon/extentions/ComponentExd';
import fontStyles from 'AliasStyles/fonticon/iconfont.css';

class FontIcon extends Component {
    constructor (props) {
        super(props);
        this.state = { theme: null };
        this.defaultStyle = {
            display: 'inline-block'
        };
    }
    render () {
        const { iconfont } = fontStyles;
        const themeFontIcon = this.props.theme && this.props.theme.fontIcon ? this.props.theme.fontIcon : iconfont;
        const iconClass = fontStyles[this.props.icon];
        return (
            <span style={this.defaultStyle} className={classNames([themeFontIcon, iconfont, iconClass, this.getStyle('icon')])} />
        );
    }
}

FontIcon.propTypes = {
    icon: PropTypes.string.isRequired,
    theme: PropTypes.object,
    onClick: PropTypes.func
};

FontIcon.defaultProps = {
    icon: 'icon-edit'
};

export default FontIcon;
