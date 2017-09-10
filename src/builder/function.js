import fs from 'fs';

export const scanFolder = (myPath, fn, isFirstLevel) => {
    if (fs.existsSync(myPath)) {
        const paths = fs.readdirSync(myPath);
        for (const key in paths) {
            const tmpStr = paths[key];
            const tmpPath = myPath + '/' + tmpStr;
            const isDirectory = isDir(tmpPath);
            if (typeof fn === 'function') {
                fn(myPath, tmpPath, isDirectory);
            }
            if (isDirectory && !isFirstLevel) {
                scanFolder(tmpPath, fn);
            }
        }
    } else {
        console.log(`[err]Can not find the path:${myPath}`.red);
    }
};

/**
* 检查路径是否存在，不存在则创建目录
* @param {string} path 检查路径
* @return {null} nonthing
*/
export const checkDir = (path) => {
    path = path.replace(/\\/g, '/');
    var arr = path.split('/');
    var isWin = /:\//.test(path);
    var tmpDirArr = [];
    for (var key = 0; key < arr.length; key++) {
        var tmpPath = arr[key];
        var tmpDir = '';
        if (tmpDirArr.length > 0) {
            tmpDirArr.push('/');
        }
        tmpDirArr.push(tmpPath);
        tmpDir = tmpDirArr.join('');
        try {
            if (isWin) {
                if (key > 0) {
                    if (!fs.existsSync(tmpDir)) {
                        fs.mkdirSync(tmpDir);
                        console.log('mkdir:' + tmpDir);
                    }
                }
            } else {
                if (!fs.existsSync(tmpDir)) {
                    fs.mkdirSync(tmpDir);
                }
            }
        } catch (e) {
            console.log(`create folder error:[${tmpDir}], in (checkDir)common.js`.red);
        }
    }
};

export const exists = (filename) => {
    return fs.existsSync(filename);
};

export const isFile = (filename) => {
    return exists(filename) && fs.statSync(filename).isFile();
};

export const isDir = (filename) => {
    return exists(filename) && fs.statSync(filename).isDirectory();
};
