import PageIndexReducer from './PageIndex/reducer';
import ScorlImage from 'elmer-react-ui/src/web/image/jy5.jpg';

export const InitState = {
    PageIndex: {
        navigator: [
            { title: '首页', value: 'home', href: 'javascript:void(0);' },
            { title: '新闻热点', value: 'news', href: 'javascript:void(0);' },
            { title: '编程工具', value: 'tools', href: 'javascript:void(0);' },
            { title: '学习资料', value: 'study', href: 'javascript:void(0);' },
            { title: '博客', value: 'blog', href: 'javascript:void(0);' },
            { title: '关于', value: 'home', href: 'javascript:void(0);' }
        ],
        noticeNews: [
            { title: 'this is the test message or description', image: ScorlImage, href: 'javascript:void(0);', date: '2017-02-03' },
            { title: '中国内，感觉感觉感觉感觉感觉感觉感觉感觉感觉感觉感觉', href: 'javascript:void(0);', date: '2017-02-03' },
            { title: '介推介推介推介推介推介推介推介推', href: 'javascript:void(0);', date: '2017-02-03' },
            { title: '介推介推介推介推介推介推介推介推', href: 'javascript:void(0);', date: '2017-02-03' },
            { title: '介推介推介推介推介推介推介推介推', href: 'javascript:void(0);', date: '2017-02-03' },
            { title: '介推介推介推介推介推介推介推介推', href: 'javascript:void(0);', date: '2017-02-03' },
            { title: '介推介推介推介推介推介推介推介推', href: 'javascript:void(0);', date: '2017-02-03' },
            { title: '介推介推介推介推介推介推介推介推', href: 'javascript:void(0);', date: '2017-02-03' }
        ]
    }
};

export default {
    PageIndexReducer
};
