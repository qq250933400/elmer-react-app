import React from 'react';
import PropTypes from 'prop-types';
import Component from 'AliasCommon/extentions/ComponentExd';

class Link extends Component {
    constructor (props) {
        super(props);
        this.state = { theme: null };
        this.onClick = this.onClick.bind(this);
    }
    onClick () {
        console.log('link click', this.props.href);
    }
    render () {
        const linkElement = (() => {
            let result = null;
            const props = {};
            for (const key in this.props) {
                if (key !== 'children' && key !== 'isNormalLink' && key !== 'onClick') {
                    props[key] = this.props[key];
                }
            }
            if (this.props.isNormalLink) {
                result = <a {...props}>{this.props.children}</a>;
            } else {
                result = <div onClick={this.onClick} {...props}>{this.props.children}</div>;
            }
            return result;
        })();
        return linkElement;
    }
}

Link.propTypes = {
    href: PropTypes.string.isRequired,
    isNormalLink: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.element,
        PropTypes.node,
        PropTypes.object
    ])
};

Link.defaultProps = {
    href: '',
    title: '',
    isNormalLink: false
};

export default Link;
