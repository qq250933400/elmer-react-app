// import React from 'react';
import PropTypes from 'prop-types';
// import path from 'path';
import ComponentExd from '../extentions/ComponentExd';
// import MobileLanage from '../lang/AppMobile';
import { AxiosServiceApi } from 'elmer-react-axios';
import axiosLanguageConfig from '../../axios/language/axios.language';

class Language extends ComponentExd {
    constructor(props) {
        super(props);
        this.getLanguage = this.getLanguage.bind(this);
        this.language = this.getLanguage();
        this.message = this.message.bind(this);
    }
    getLanguage() {
        const { lang } = this.props;
        const langeKey = `lang_${lang}`;
        const MobileLanage = {};
        return MobileLanage && MobileLanage[langeKey];
    }

    /**
     * 从语言文件获取文本
     * @param {string} nodekey 关键字 
     * @param {bool} isCommon 是否从第一级获取
     * @return {string} 返回多语言内容
     */
    message (nodekey, isCommon) {
        const { route } = this.props;
        const dataKey = route.mod + route.page;
        const defaultKey = 'index';
        if (nodekey && this.isString(nodekey) && this.language) {
            if (!isCommon) {
                return this.language[dataKey] && this.language[dataKey][nodekey] ? this.language[dataKey][nodekey] : 'Lang:' + dataKey + '.' + nodekey;
            } else {
                return this.language[defaultKey] && this.language[defaultKey][nodekey] ? this.language[defaultKey][nodekey] : 'Lang:index.' + nodekey;
            }
        } else {
            return isCommon ? 'Lang:index.' + nodekey : 'Lang:' + dataKey + '.' + nodekey;
        }
    }
    render () {
        const ChildrenPage = this.getChildrenContext({
            ...this.props,
            message: this.message
        });
        return ChildrenPage;
    }
}

Language.propTypes = {
    lang: PropTypes.string.isRequired,
    route: PropTypes.object.isRequired
};

Language.defaultProps = {
    lang: 'zh'
};

export default AxiosServiceApi(Language, 'language', axiosLanguageConfig);
