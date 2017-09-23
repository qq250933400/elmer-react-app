import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ComponentExd from 'AliasCommon/extentions/ComponentExd';
import { BlueNavigator, Layout1020, HeaderBackground, CarouselFigure, HomeModule,
    NoneModule, PictureTab
} from 'elmer-react-ui';
import LargeAd from './atoms/largeAd/largeAd';
import styles from './style/style.scss';
import ScorlImage from 'elmer-react-ui/src/web/image/jy5.jpg';
import zt1Image from 'elmer-react-ui/src/web/image/jy1.jpg';
import jy1Image from 'elmer-react-ui/src/web/image/jy2.jpg';
import jy2Image from 'elmer-react-ui/src/web/image/jy3.jpg';
import jy3Image from 'elmer-react-ui/src/web/image/jy4.jpg';

class PageIndex extends ComponentExd {
    constructor(props) {
        super(props);
        const { AppIndex } = props;
        const data = [
            { image: ScorlImage, href: '#' },
            { image: zt1Image, href: '#' },
            { image: jy1Image, href: '#' },
            { image: jy2Image, href: '#' },
            { image: jy3Image, href: '#' }
        ];
        this.state = {
            CarouselData: data,
            noticeNews: get(AppIndex, 'ModIndex.PageIndex.noticeNews', [])
        };
        this.NavigatorData = get(AppIndex, 'ModIndex.PageIndex.navigator', []);
        this.hotData = [
            ...this.state.noticeNews,
            { title: '测试数据数据集' },
            { title: '测试数据数据集' }
        ];
        this.detailData = [
            ...this.state.noticeNews,
            { title: '测试数据数据集' },
            { title: '测试数据数据集' }
        ];
    }
    render () {
        return (
            <div>
                <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                    <Layout1020 background={HeaderBackground}>
                        <div style={{ height: '240px' }} />
                    </Layout1020>
                    <BlueNavigator data={this.NavigatorData} />
                    <Layout1020>
                        <div className={styles.layout_first_level}>
                            <div className={styles.layout_first_level_left}>
                                <CarouselFigure fixSize width={300} height={338} data={this.state.CarouselData} interval={200} />
                            </div>
                            <div className={styles.layout_first_level_right}>
                                <HomeModule title="热点资讯" data={this.state.noticeNews} />
                            </div>
                        </div>
                        <LargeAd />
                        <div className={styles.layoutSecondLevel}>
                            <div className={styles.layoutSecondLevelLeft}>
                                <div>
                                    <div className={styles.layoutSecondLevelCt1}>
                                        <HomeModule title="编程工具" themeType="blue" data={this.state.noticeNews} />
                                        <p className={styles.layoutLineSplit} />
                                        <HomeModule title="博客热点" themeType="blueDetail" data={this.detailData} />
                                    </div>
                                    <div className={styles.layoutSecondLevelCt2}>
                                        <HomeModule title="学习资料" themeType="blue" data={this.state.noticeNews} />
                                        <p className={styles.layoutLineSplit} />
                                        <HomeModule title="前端资料" themeType="blueDetail" data={this.detailData} />
                                    </div>
                                </div>
                                <p className={styles.layoutLineSplit} />
                                <div>
                                    <PictureTab />
                                </div>
                                <p className={styles.layoutLineSplit} />
                            </div>
                            <div className={styles.layoutSecondLevelRight}>
                                <NoneModule data={this.hotData} title="热点文章" />
                                <p className={styles.layoutLineSplit} />
                                <NoneModule data={this.hotData} title="热点文章" fixSize height={345} />
                            </div>
                        </div>
                    </Layout1020>
                </div>
            </div>
        );
    }
}

PageIndex.propTypes = {
    AppIndex: PropTypes.object.isRequired
};

PageIndex.defaultProps = {};

export default PageIndex;
