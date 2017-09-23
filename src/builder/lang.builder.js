import path from 'path';
import fs from 'fs';
import os from 'os';
import 'colors';
import { checkDir, scanFolder } from './function';

// *************************** */
//
// 多语言文件编译，所有文件结构必须按程序自动创建规则完成，不允自定义其他语言文件
//
// *************************** */

const config = {
    srcPath: '../../lang',
    desPath: '../../server/lang',
    tpPath: '../pages',
    language: ['en', 'zh'],
    isJson: false, // 编译时是否以json数据格式存储，还是已export方式存储
    languageStandard: 'en' // 编译时结构标准，其他语言将会以标准语言的结构体构建源文件，并编译
};

const srcLocalPath = path.resolve(__dirname, config.srcPath).replace(/\\/g, '/');
const tpLocalPath = path.resolve(__dirname, config.tpPath).replace(/\\/g, '/');
const desLocalPath = path.resolve(__dirname, config.desPath).replace(/\\/g, '/');

const exists = (filename) => {
    return fs.existsSync(filename);
};

const getStandard = (fileName) => {
    if (fs.existsSync(fileName)) {
        const std = require(fileName);
        return std['default'];
    } else {
        return null;
    }
};
const getObjectTrees = (obj, mapKey) => {
    if (obj && Object.prototype.toString.call(obj) === '[object Object]') {
        const result = [];
        for (const fkey in obj) {
            const tmpObj = obj[fkey];
            const tmpType = Object.prototype.toString.call(tmpObj);
            if (tmpType === '[object String]' || tmpType === '[object Number]') {
                result.push({
                    key: mapKey ? [mapKey, fkey].join('.') : fkey,
                    value: tmpObj
                });
            } else if (tmpType === '[object Object]') {
                const children = getObjectTrees(tmpObj, fkey);
                for (const subKey in children) {
                    const tmpData = children[subKey];
                    const tmpKey = tmpData.key;
                    const tmpValue = tmpData.value;
                    result.push({
                        key: mapKey ? [mapKey, tmpKey].join('.') : tmpKey,
                        value: tmpValue
                    });
                }
            } else {
                result.push({
                    key: mapKey ? [mapKey, fkey].join('.') : fkey,
                    value: JSON.stringify(tmpObj)
                });
            }
        }
        return result;
    } else {
        return [JSON.stringify(obj)];
    }
};
const comparedObjectStructor = (srcObject, stdObject) => {
    let result = false;
    for (const key in stdObject) {
        if (srcObject[key] === undefined) {
            srcObject[key] = stdObject[key];
            result = true;
        } else {
            if (Object.prototype.toString.call(stdObject[key]) === '[object Object]') {
                const cResult = comparedObjectStructor(srcObject[key], stdObject[key]);
                if (cResult) {
                    result = cResult;
                }
            }
        }
    }
    return result;
};

const comparedToStandard = (srcObject, stdObject, lang, srcFileName) => {
    if (stdObject !== null && lang !== config.languageStandard) {
        // 语言文件节点和标准不匹配，当文件没有标准文件的节点时添加到源文件中...
        const result = comparedObjectStructor(srcObject, stdObject);
        if (result) {
            const code = 'export default ' + JSON.stringify(srcObject, null, 4) + ';';
            fs.writeFileSync(srcFileName, code);
        }
    }
    return srcObject;
};

/**
 * 编译文件
 * @param {string} fileName 源语言文件内容
 * @param {string} desFileName 保存目标文件
 * @param {string} STD 标准结构文件内容
 * @param {array} lang 当前编译文件语言标识,示例[en,zh,hk]
 * @return {null} nothine
 */
const complieTo = (fileName, desFileName, STD, lang) => {
    const srcObject = require(fileName);
    const srcContent = comparedToStandard(srcObject['default'], STD, lang, fileName);
    const srcResult = getObjectTrees(srcContent, null);
    const reuslt = {};
    for (const key in srcResult) {
        const tmpData = srcResult[key];
        const tKey = 'key';
        const tValue = 'value';
        const tmpKey = tmpData[tKey];
        const tmpValue = tmpData[tValue];
        reuslt[tmpKey] = tmpValue;
    }
    const resultString = '/* eslint-disable quotes */' + os.EOL + 'export default ' + JSON.stringify(reuslt, null, 4) + ';' + os.EOL + '/* eslint-enable quotes */' + os.EOL;
    fs.writeFileSync(desFileName, resultString, 'utf8');
    console.log(`[1]    complie language file: ${desFileName}`.magenta);
};

const complie = (fileName, resolvePath) => {
    const pathString = resolvePath.replace(/\.js$/, '');
    const lngPath = desLocalPath + pathString;
    const srcPath = srcLocalPath + pathString;
    checkDir(lngPath);
    checkDir(srcPath);
    if (config.language && Object.prototype.toString.call(config.language) === '[object Array]') {
        const STDFileName = srcPath + '/index_' + config.languageStandard.toLocaleLowerCase() + '.js';
        const STD = getStandard(STDFileName);

        for (const key in config.language) {
            const tmpLang = config.language[key];
            const srcFileName = srcPath + '/index_' + tmpLang.toLocaleLowerCase() + '.js';
            const lngFileName = lngPath + '/index_' + tmpLang.toLocaleLowerCase() + '.js';
            if (exists(srcFileName)) {
                // 源文件存在，获得编译后的文件
                complieTo(srcFileName, lngFileName, STD, tmpLang);
                // console.log(resolvePath);
            } else {
                // 源语言文件不存在，自动创建文件
                const code = '/* eslint-disable quotes */' + os.EOL + 'export default {};' + os.EOL + '/* eslint-enable quotes */' + os.EOL;
                const writeFile = srcFileName.substr(srcLocalPath.length);
                fs.writeFileSync(srcFileName, code);
                console.log('Create new language file==>' + writeFile);
            }
        }
    } else {
        console.error('Please set the supported languages.');
    }
};
const exportFiles = () => {
    const ExportResult = {};
    scanFolder(desLocalPath, (parentPath, currentPath, isDirectory) => {
        if (!isDirectory) {
            const fileName = currentPath.replace(/\\/g, '/');
            const resolveFileName = currentPath.substr(desLocalPath.length);
            const rFile = resolveFileName.replace(/^\//, '');
            const rArr = rFile.split('/');
            const rPath = desLocalPath + '/' + rArr[0];
            if (fileName !== rPath + '/index.js' && rPath !== desLocalPath + '/index.js') {
                const importFileName = rFile.replace(/^([a-zA-Z0-9]*)/, '');
                const importName = importFileName.replace(/(\/[a-zA-Z0-9_]*\.js)$/, '').replace(/\//g, '');
                if (importName && importName.length > 0) {
                    const curObject = ExportResult[rArr[0]] || {};
                    const tmpArr = importFileName.match(/(_([a-zA-Z]*)(\.js))$/);
                    const tmpLang = tmpArr[2].toUpperCase();
                    const tmpImportCode = `import ${importName}${tmpLang} from '.${importFileName}';`;
                    const tmpExportCode = `${importName}${tmpLang}`;
                    curObject[tmpLang] = curObject[tmpLang] || { ImportCode: [], ExportCode: [] };
                    curObject[tmpLang].ImportCode.push(tmpImportCode);
                    curObject[tmpLang].ExportCode.push(`${importName}: ${tmpExportCode}`);
                    ExportResult[rArr[0]] = {
                        ...curObject
                    };
                }
            }
        }
    });

    for (const key in ExportResult) {
        const tmpResult = ExportResult[key];
        const tmpLangsExport = [];
        const tmpLangsImport = [];
        const tmpIndexFileName = `${desLocalPath}/${key}/index.js`;
        for (const subKey in tmpResult) {
            const lng = subKey.toLocaleLowerCase();
            const indexFileName = `${desLocalPath}/${key}/index_${lng}.js`;
            const tmpImportCode = tmpResult[subKey].ImportCode.join(os.EOL);
            const tmpExportCode = tmpResult[subKey].ExportCode.join(',' + os.EOL + '    ');
            const tmpCode = tmpImportCode + os.EOL + os.EOL + 'export default {' + os.EOL + '    ' + tmpExportCode + os.EOL + '};';
            tmpLangsExport.push('lang_' + lng + ': index' + lng.toUpperCase());
            tmpLangsImport.push('import index' + lng.toUpperCase() + ' from \'./index_' + lng.toUpperCase() + '.js\';');
            fs.writeFileSync(indexFileName, tmpCode, 'utf8');
            console.log(`[2]    create index_${lng} file: ${indexFileName}`.blue);
        }
        const tmpLangsImportCode = tmpLangsImport.join(os.EOL);
        const tmpLangsExportCode = 'export default {' + os.EOL + '    ' + tmpLangsExport.join(',' + os.EOL + '    ') + os.EOL + '};';
        fs.writeFileSync(tmpIndexFileName, tmpLangsImportCode + os.EOL + os.EOL + tmpLangsExportCode);
        console.log(`[3]    create index file: ${tmpIndexFileName}`.grey);
    }
};
// 获取操作命令
const command = process.argv[2];
config.isJson = /^json$/i.test(command) ? true : config.isJson;
const langRun = () => {
    // 遍历page文件夹，根据page文件找到指定的语言文件
    if (config.language.indexOf(config.languageStandard) < 0) {
        console.error('[err]The languageStandard must in the support language');
    } else {
        console.log(`[0]    source     :${srcLocalPath}`.green);
        console.log(`[0]    template   :${tpLocalPath}`.green);
        console.log(`[0]    destination:${desLocalPath}`.green);
        console.log('start complie language file...');
        scanFolder(path.resolve(__dirname, config.tpPath), (parentPath, currentPath, isDirectory) => {
            const resolvePath = currentPath.substr(tpLocalPath.length);
            const lngPath = desLocalPath + resolvePath;
            if (/\.js$/.test(currentPath)) {
                if (isDirectory && !exists(lngPath)) {
                    checkDir(lngPath);
                    console.log(`[log]  create folder===>${lngPath}`);
                } else {
                    const pIndex = parentPath.lastIndexOf('/');
                    const pName = parentPath.substr(pIndex + 1);
                    if (currentPath.replace(/\\/g, '/') !== tpLocalPath + '/index.js' && !isDirectory && /^(App|Mod|Page)/.test(pName)) {
                        const lngFileName = lngPath.replace(/\\/g, '/');
                        complie(lngFileName, resolvePath);
                    }
                }
            }
        });
        console.log('Create language index file!');
        exportFiles();
        console.log('compile complete!');
    }
};

export default langRun;
