import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from '../../style/style.scss';
class LargeAd extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    render () {
        return (
            <div className={styles.largeAd}>
                <svg width="100%" height="100%">
                    <defs>
                        <radialGradient id="bkBrash" cx="50%" cy="50%" fx="100%" fy="100%" r="80%" >
                            <stop stopColor="#FFA248" offset="0" />
                            <stop stopColor="#FF7F14" offset="1" />
                        </radialGradient>
                        <linearGradient id="txtBrash" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop stopColor="#FEECBD" offset="0" />
                            <stop stopColor="#FDE380" offset="0.5" />
                            <stop stopColor="#FAD64A" offset="1" />
                        </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#bkBrash)" />
                    <text x="50%" y="50%" dy=".3em" fontSize="2em" fontWeight="bolder" fill="url(#txtBrash)" textAnchor="middle">React开发 ● Node.js ● C# ● PHP ● MySql ● SqlServer</text>
                    <circle cx="0" cy="0" r="5" fill="red" />
                </svg>
            </div>
        );
    }
}

LargeAd.propTypes = {
    data: PropTypes.array.isRequired
};

LargeAd.defaultProps = {
    data: []
};

export default LargeAd;
