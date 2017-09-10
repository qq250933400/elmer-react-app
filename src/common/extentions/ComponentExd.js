import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from 'AliasStyles/style.scss';

class ComponentExd extends Component {
    constructor (props) {
        super(props);
        this.getType = this.getType.bind(this);
        this.isArray = this.isArray.bind(this);
        this.setCss = this.setCss.bind(this);
        this.setCss3 = this.setCss3.bind(this);
        this.addClass = this.addClass.bind(this);
        this.removeClass = this.removeClass.bind(this);
        this.hasClass = this.hasClass.bind(this);
        this.getAttr = this.getAttr.bind(this);
        this.setAttr = this.setAttr.bind(this);
        this.getParentElement = this.getParentElement.bind(this);
        this.styles = styles;
        this.isSupportCss3 = this.supportCss3('transform');
    }
    getType (value) {
        return Object.prototype.toString.call(value);
    }
    isArray (value) {
        return this.getType(value) === '[object Array]';
    }
    isString (value) {
        return this.getType(value) === '[object String]';
    }
    isNumber (value) {
        return this.getType(value) === '[object Number]';
    }
    isObject (value) {
        return this.getType(value) === '[object Object]';
    }
    isDomElement(value) {
        return /^(\[object)\s{1}(HTML)[a-zA-Z]*(Element\])$/.test(this.getType(value));
    }
    isNodeList (value) {
        return this.getType(value) === '[object NodeList]';
    }
    isFunction (value) {
        return this.getType(value) === '[object Function]';
    }
    isMobile (value) {
        const userAgent = value || window.navigator.userAgent.toString();
        return /(iPhone|Android)/.test(userAgent);
    }
    isiPad (value) {
        const userAgent = value || window.navigator.userAgent.toString();
        return /(iPad)/.test(userAgent);
    }
    addEvent (oElement, sEvent, fnHandler) {
        oElement.addEventListener ? oElement.addEventListener(sEvent, fnHandler, false) : oElement.attachEvent(['on', sEvent].join(''), fnHandler);
    }
    removeEvent (oElement, sEvent, fnHandler) {
        oElement.removeEventListener ? oElement.removeEventListener(sEvent, fnHandler, false) : oElement.detachEvent(['on', sEvent].join(''), fnHandler);
    }
    setCss(element, property, value) {
        element.style[property] = value;
    }
    setCss3(element, property, value) {
        this.setCss(element, property, value);
        this.setCss(element, ['-webkit-', property].join(''), value);
        this.setCss(element, ['-moz-', property].join(''), value);
        this.setCss(element, ['-ms-', property].join(''), value);
        this.setCss(element, ['-o-', property].join(''), value);
    }

    supportCss3(style) {
        var prefix = ['webkit', 'Moz', 'ms', 'o'],
            i,
            humpString = [],
            htmlStyle = document.documentElement.style,
            toHumb = (string) => {
                return string.replace(/-(\w)/g, ($0, $1) => {
                    return $1.toUpperCase();
                });
            };
        for (i in prefix) {
            humpString.push(toHumb(prefix[i] + '-' + style));
        }
        humpString.push(toHumb(style));
        for (i in humpString) {
            if (humpString[i] in htmlStyle) {
                return true;
            }
        }
        return false;
    }
    getChildrenContext (nextProps) {
        const { children } = this.props;
        const ChildrenElement = (() => {
            let resultElement = '';
            if (this.isArray(children)) {
                resultElement = [];
                children && children.map((item, index) => {
                    let result = null;
                    if (React.isValidElement(item) && this.isFunction(item.type)) {
                        result = React.cloneElement(item, {
                            key: index,
                            ...nextProps
                        });
                    } else {
                        result = item;
                    }
                    resultElement.push(result);
                });
            } else if (this.isObject(children) && (this.isString(children.type) || this.isFunction(children.type))) {
                if (this.isFunction(children.type)) {
                    if (React.isValidElement(children)) {
                        resultElement = React.cloneElement(children, { ...nextProps });
                    } else {
                        resultElement = '';
                    }
                } else if (this.isString(children.type)) {
                    resultElement = children;
                }
            } else if (this.isString(children)) {
                resultElement = children;
            }
            return resultElement;
        })();
        return ChildrenElement;
    }
    getUriParam (keyWords) {
        const queryString = window.location.search || '';
        const newQuery = queryString.replace(/^\?/, '').replace(/#.*?/, '');
        const queryArr = newQuery.split('&');
        let result = null;
        for (const key in queryArr) {
            const tmpQuery = queryArr[key];
            const tmpSearch = tmpQuery.match(/^(.*?)=(.*?)$/);
            if (tmpSearch && tmpSearch.length > 2 && keyWords.toLowerCase() === tmpSearch[1].toLowerCase()) {
                result = tmpSearch[2];
            }
        }
        return result;
    }
    getUriHash(keyWords) {
        const hashQuery = window.location.hash;
        const newQuery = hashQuery.replace(/^#/, '');
        const queryArr = newQuery.split('&');
        let result = null;
        for (const key in queryArr) {
            const tmpQuery = queryArr[key];
            const tmpSearch = tmpQuery.match(/^(.*?)=(.*?)$/);
            if (tmpSearch && tmpSearch.length > 2 && keyWords.toLowerCase() === tmpSearch[1].toLowerCase()) {
                result = tmpSearch[2];
            }
        }
        return result;
    }
    getDefaultValue (value, defaultValue) {
        if (this.isString(value)) {
            return value.length > 0 ? value : defaultValue;
        } else if (value === undefined || value === null) {
            return defaultValue;
        } else {
            return value;
        }
    }
    getStyle (key) {
        return styles[key];
    }
    getDecodeURI (value) {
        return decodeURIComponent(value);
    }
    getEncodeURI (value) {
        return encodeURIComponent(value);
    }
    getRouterConfig (key) {
        window.elmer = window.elmer || {};
        const routerConfig = window.elmer.router || {};
        return routerConfig[key];
    }
    getUrl (app, mod, page, vParam) {
        const napp = /\//.test(app) ? app.replace(/^\//, '').split('/')[0] : app;
        const nmod = /\//.test(app) ? app.replace(/^\//, '').split('/')[1] : mod;
        const npage = /\//.test(app) ? app.replace(/^\//, '').split('/')[2] : page;
        const appStr = this.isString(napp) ? napp : 'Index';
        const modStr = this.isString(nmod) ? nmod : 'Index';
        const pageStr = this.isString(npage) ? npage : 'Index';
        const param = /\//.test(app) ? mod : vParam;
        let result = '';
        let paramArr = [];
        const hostString = this.props.host || 'index.php';
        const redirectRouter = this.getRouterConfig('redirectRouter');

        if (this.isObject(param)) {
            for (const key in param) {
                const item = [key, this.getEncodeURI(param[key])].join('=');
                paramArr.push(item);
            }
        } else if (this.isArray(param)) {
            paramArr = param;
        } else if (this.isString(param)) {
            paramArr.push(param);
        }
        const paramString = paramArr.join('&');
        if (redirectRouter) {
            const routeString = [appStr, modStr, pageStr].join('/');
            result = '/' + routeString;
            result += paramString.length > 0 ? '/?' + paramString : '';
        } else {
            const routeString = `app=${appStr}&mod=${modStr}&page=${pageStr}`;
            result = hostString + '?' + routeString;
            result += paramString.length > 0 ? '&' + paramString : '';
        }
        return result;
    }
    hasClass (sender, className) {
        if (this.isDomElement(sender)) {
            return sender.classList.contains(className);
        } else {
            return false;
        }
    }

    /**
     * 给指定元素添加样式
     * @param {DomElement} sender 操作对象
     * @param {string} className 样式名称
     * @return {null} 没有返回值
     */
    addClass (sender, className) {
        if (this.isDomElement(sender)) {
            sender.classList.add(className);
        } else if (this.isNodeList(sender)) {
            for (const key in sender) {
                const tmpElement = sender[key];
                this.isDomElement(tmpElement) && tmpElement.classList.add(className);
            }
        }
    }

    /**
     * 从Dom移除class
     * @param {DomElement} sender Dom对象 
     * @param {string} className 样式名称
     * @return {null} 没有返回
     */
    removeClass (sender, className) {
        if (this.isDomElement(sender)) {
            sender.classList.remove(className.split(' '));
        } else if (this.isNodeList(sender)) {
            for (const key in sender) {
                const tmpElement = sender[key];
                this.isDomElement(tmpElement) && tmpElement.classList.remove(className);
            }
        }
    }

    /**
     * 设置Dom属性值
     * @param {DomElement} sender Dom对象 
     * @param {string} property 属性名称 
     * @param {string|number} value 属性值
     * @return {null} nothing
     */
    setAttr (sender, property, value) {
        if (this.isDomElement(sender)) {
            sender.setAttribute(property, value);
        }
    }

    /**
     * 获取原DOM属性值
     * @param {DomElement} sender Dom对象 
     * @param {string} property 属性名称
     * @return {string|number} 属性值
     */
    getAttr (sender, property) {
        if (this.isDomElement(sender)) {
            return sender.getAttribute(property);
        } else {
            return null;
        }
    }

    /**
     * 获取指定Dom的父元素
     * @param {DomElement} sender Dom对象 
     * @param {string} queryString 查询字符串
     * @return {DomElement} 返回elment
     */
    getParentElement (sender, queryString) {
        if (this.isDomElement) {
            if (this.isString(queryString) && queryString.length > 0) {
                let parent = sender.parentElement;
                const queryArr = queryString.split(',');
                while (parent) {
                    for (const key in queryArr) {
                        const tmpQuery = queryArr[key];
                        const tmpMatch = tmpQuery.match(/([a-zA-Z]*)\[([a-zA-Z=]*)\]/);
                        if (/^\./.test(tmpQuery)) {
                            if (this.hasClass(parent, tmpQuery.replace(/^\./, ''))) {
                                return parent;
                            }
                        } else if (/^#/.test(tmpQuery)) {
                            if (this.getAttr(parent, 'id') === tmpQuery.replace(/^#/, '')) {
                                return parent;
                            }
                        } else if (tmpMatch && tmpMatch[1].toUpperCase() === parent.tagName) {
                            return parent;
                        } else if (tmpQuery.toUpperCase() === parent.tagName) {
                            return parent;
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        return null;
    }
    componentDidMount () {
        this.isRender = true;
    }
    componentWillUnmount () {
        this.isRender = false;
    }
    componentDidUpdate () {
        this.isRender = true;
    }
}

ComponentExd.propTypes = {
    children: PropTypes.node,
    host: PropTypes.string,
    redirectRouter: PropTypes.bool
};

ComponentExd.defaultProps = {
    host: '/'
};

export default ComponentExd;
