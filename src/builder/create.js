import os from 'os';
import fs from 'fs';
import path from 'path';
import { checkDir, scanFolder } from './function';
import cmd from './cmd';
import {
    createAppReduerExport,
    createContainer,
    createExportReducerCommand
} from './state.builder';

const CREATETYPES = [
    'page', // create web page
    'state', // create container state reducer
    'pageindex', // create pages index file and data json file
    'extmodstate',
    'extappstate', // create export app container index
    'ui' // create component
];
// page local path
const PAGEPATH = path.resolve(__dirname, '../pages');
const getPageCode = (app, mod, page) => {
    let code = '';
    const exampleString = [app, mod, page].join('');
    if (app === 'AppMobile') {
        // create the mobile page
        const importCode = [
            'import React from \'react\';',
            'import ComponentExd from \'../../../common/extentions/ComponentExd\';',
            'import MobilePage from \'../MobilePage\';'
        ].join(os.EOL);
        code = importCode + os.EOL + os.EOL + `class ${page} extends ComponentExd {` + os.EOL +
                      '    constructor(props) {' + os.EOL + '        super(props);' + os.EOL + '        this.state = {};' + os.EOL +
                      '    }' + os.EOL + '    render () {' + os.EOL + '        return (' +
                      os.EOL + '            <MobilePage {...this.props}>' + os.EOL + `                ${exampleString}` +
                      os.EOL + '            </MobilePage>' + os.EOL + '        );' + os.EOL + '    }' + os.EOL + '}' + os.EOL;
        code += os.EOL + `${page}.propTypes = {};` + os.EOL + os.EOL + `${page}.defaultProps = {};` + os.EOL + os.EOL;
        code += `export default ${page};` + os.EOL;
    } else {
        // create other normal page
        const importCode = [
            'import React from \'react\';',
            'import ComponentExd from \'AliasCommon/extentions/ComponentExd\';'
        ].join(os.EOL);

        code = importCode + os.EOL + os.EOL + `class ${page} extends ComponentExd {` + os.EOL +
                      '    constructor(props) {' + os.EOL + '        super(props);' + os.EOL + '        this.state = {};' + os.EOL +
                      '    }' + os.EOL + '    render () {' + os.EOL + '        return (' + os.EOL + '            <div>' +
                      os.EOL + `                ${exampleString}` + os.EOL + '            </div>' + os.EOL + '        );' + os.EOL + '    }' + os.EOL + '}' + os.EOL;
        code += os.EOL + `${page}.propTypes = {};` + os.EOL + os.EOL + `${page}.defaultProps = {};` + os.EOL + os.EOL;
        code += `export default ${page};` + os.EOL;
    }
    return code;
};
const writeExportPageCode = () => {
    const importArr = [];
    const exportArr = [];
    scanFolder(PAGEPATH, (parent, result, isDirectory) => {
        if (!isDirectory) {
            const resolveFileName = result.substr(PAGEPATH.length);
            if (resolveFileName !== '/index.js') {
                const exportName = resolveFileName.replace(/\.js$/, '').replace(/\//g, '');
                importArr.push(`import ${exportName} from '.${resolveFileName}';`);
                exportArr.push(exportName);
            }
        }
    });
    const importCode = importArr.join(os.EOL);
    const exportCode = 'export default {' + os.EOL + '    ' + exportArr.join(',' + os.EOL + '    ') + os.EOL + '};';
    const exportPageCode = importCode + os.EOL + os.EOL + exportCode + os.EOL;
    fs.writeFileSync(PAGEPATH + '/index.js', exportPageCode);
    fs.writeFileSync(PAGEPATH + '/index.json', JSON.stringify(exportArr, null, 4), 'utf8');
};

const createPage = (pathStr) => {
    if (pathStr === undefined || pathStr === null || pathStr.length <= 0) {
        throw new Error('Please set up the create page path!');
    } else {
        pathStr = pathStr.replace(/^\//, '').replace(/\/$/, '');
        const pathArr = pathStr.split('/');
        const route = {
            app: pathArr[0],
            mod: pathArr[1] && pathArr[1].length > 0 ? pathArr[1] : 'index',
            page: pathArr[2] && pathArr[2].length > 0 ? pathArr[2] : 'index'
        };
        route.app = ['App', route.app.substr(0, 1).toUpperCase(), route.app.substr(1)].join('');
        route.mod = ['Mod', route.mod.substr(0, 1).toUpperCase(), route.mod.substr(1)].join('');
        route.page = ['Page', route.page.substr(0, 1).toUpperCase(), route.page.substr(1)].join('');
        const code = getPageCode(route.app, route.mod, route.page);
        const destPath = path.resolve(__dirname, `../pages/${route.app}/${route.mod}`).replace(/\\/g, '/');
        const destFileName = destPath + '/' + route.page + '.js';
        let isCreate = false;
        console.log(`[info]    App : ${route.app}`.green);
        console.log(`[info]    Mod : ${route.mod}`.green);
        console.log(`[info]    Page: ${route.page}`.green);
        console.log(`[info]    Folder  : ${destPath}`.blue);
        console.log(`[info]    FileName: ${destFileName}`.blue);
        if (!fs.existsSync(destFileName)) {
            cmd.startStepByStep({
                confirm: () => {
                    cmd.readLine('Do you want to continue creating page files?(Y/N):', (data) => {
                        if (/y|n/i.test(data)) {
                            isCreate = data.toLowerCase() === 'y';
                            if (isCreate) {
                                checkDir(destPath);
                                fs.writeFileSync(destFileName, code, 'utf8');
                                writeExportPageCode();
                                console.log('[done]    Creating a page file is successful!!!');
                            } else {
                                console.log('[exit]    User interrupt creation action...'.yellow);
                            }
                            return true;
                        } else {
                            return false;
                        }
                    });
                }
            });
        } else {
            throw new Error('The page file you want to create already exists');
        }
    }
};

const cmdCreate = (cmdArguments) => {
    const type = cmdArguments[0] || cmdArguments[0].toLowerCase();
    if (/^(type:)/.test(type)) {
        const typeArr = type.match(/^(type:)([a-zA-Z]*)$/i);
        const typeValue = typeArr && typeArr.length > 2 && typeArr[2];
        const pathString = cmdArguments[1];
        if (CREATETYPES.indexOf(typeValue.toLowerCase()) >= 0) {
            const pathArr = pathString && pathString.length > 0 ? pathString.match(/^(path:)([a-zA-Z0-9\/]*)/) : '';
            const pathValue = pathArr && pathArr.length >= 3 && pathArr[2];
            if (typeValue === 'page') {
                if (!/^(path:)([a-zA-Z0-9\/]*)$/.test(pathString)) {
                    throw new Error('The path parameter setting is wrong, It should be [a-z,A-Z,0-9,/] ');
                }
                console.log(/^(path:)([a-zA-Z0-9\/]*)/.test(pathString), pathString);
                createPage(pathValue);
            } else if (typeValue === 'pageindex') {
                writeExportPageCode();
                console.log('Complete!!!'.green);
            } else if (typeValue === 'state') {
                createContainer(pathValue);
            } else if (typeValue === 'extappstate') {
                createAppReduerExport();
            } else if (typeValue === 'extmodstate') {
                createExportReducerCommand(pathValue);
            } else {
                console.log('error type'.red);
            }
        } else {
            throw new Error('The type parameter setting is wrong,It should be "page" or "ui".');
        }
    } else if (type === 'help') {
        const types = CREATETYPES.join(',');
        console.log(`create type should be one of ${types}`.blue);
    } else {
        throw new Error('The create command must specify the creation type' + os.EOL + '[exp]    Example:  yarn cmd create type:page path:mobile/user/index'.blue);
    }
};

export default cmdCreate;
