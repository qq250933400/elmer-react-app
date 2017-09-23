import fs from 'fs';
import path from 'path';
import os from 'os';
import { exists, scanFolder, checkDir } from './function';

const formatRoute = (value, type) => {
    let result = '';
    let reg = null;
    if (type && type.length > 0 && value && value.length > 0) {
        const typeValue = [type.substr(0, 1).toUpperCase(), type.substr(1)].join('');
        if (type.toLowerCase() === 'app') {
            reg = /^(App)([a-zA-Z0-9]*)$/i;
        } else if (type.toLowerCase() === 'mod') {
            reg = /^(Mod)([a-zA-Z0-9]*)$/i;
        } else if (type.toLowerCase() === 'page') {
            reg = /^(Page)([a-zA-Z0-9]*)$/i;
        }
        if (reg.test(value)) {
            const nArr = value.match(reg);
            result = [typeValue, nArr[2].substr(0, 1).toUpperCase(), nArr[2].substr(1)].join('');
        } else {
            result = [typeValue, value.substr(0, 1).toUpperCase(), value.substr(1)].join('');
        }
    } else {
        result = '';
    }
    return result;
};

export const createAppReducers = (app) => {
    const appPath = path.resolve(__dirname, `../pages/${app}`);
    const appContainerPath = path.resolve(__dirname, `../state/storeActions/${app}`);
    if (exists(appPath)) {
        const actionFileName = [appContainerPath, '/action.js'].join('');
        const reducerFileName = [appContainerPath, '/reducer.js'].join('');
        const propertesFileName = [appContainerPath, '/mapToProps.js'].join('');
        const containerFileName = [appContainerPath, '/voidContainer.js'].join('');
        const reducerCode = fs.readFileSync(path.resolve(__dirname, './source/AppState/AppReducer.source'), 'utf8');
        const containerCode = fs.readFileSync(path.resolve(__dirname, './source/AppState/AppContainer.source'), 'utf8');
        const mapCode = 'export const mapStateToProps = (state) => ({' + os.EOL +
                        '});' + os.EOL + os.EOL +
                        'export const mapDispatchToProps = (dispatch) => ({' + os.EOL +
                        '});' + os.EOL;
        checkDir(appContainerPath); // check path if not exists create it;
        if (!exists(containerFileName)) {
            fs.writeFileSync(actionFileName, 'export default {};' + os.EOL, 'utf8');
            fs.writeFileSync(reducerFileName, reducerCode.replace(/#\{app\}/g, app), 'utf8');
            fs.writeFileSync(containerFileName, containerCode.replace(/#\{app\}/g, app), 'utf8');
            fs.writeFileSync(propertesFileName, mapCode, 'utf8');
            fs.writeFileSync(appContainerPath + '/index.js', '');
            createAppReduerExport();
        } else {
            throw new Error('The container you want to create already exists!');
        }
    } else {
        throw new Error('The app module does not exists,please create app module first!');
    }
};

export const createAppReduerExport = () => {
    const appContainerPath = path.resolve(__dirname, '../state/storeActions');
    const importResult = [];
    const exportResult = [];
    const exportContainer = [];
    scanFolder(appContainerPath, (fileName, pathString, isFolder) => {
        if (isFolder) {
            const reduerFile = [pathString, '/reducer.js'].join('').replace(/\\/g, '/');
            const VoidContainerFile = [pathString, '/voidContainer.js'].join('').replace(/\\/g, '/');
            if (exists(reduerFile)) {
                const importFile = reduerFile.substr(appContainerPath.length).replace(/.js$/, '');
                const importVar = pathString.substr(fileName.length).replace(/\//g, '');
                importResult.push(`import ${importVar} from '.${importFile}';`);
                exportResult.push(importVar);
            }
            if (exists(VoidContainerFile)) {
                const importContainerFile = VoidContainerFile.substr(appContainerPath.length).replace(/.js$/, '');
                const importContainerVar = pathString.substr(fileName.length).replace(/\//g, '');
                importResult.push(`import ${importContainerVar}Container from '.${importContainerFile}';`);
                exportContainer.push(`${importContainerVar}Container`);
            }
        }
    }, true);
    const containerCode = 'export const VoidContainer = {' + os.EOL + '    ' + exportContainer.join(',' + os.EOL + '    ') + os.EOL + '};' + os.EOL;
    const codeString = importResult.join(os.EOL) + os.EOL + os.EOL + containerCode + os.EOL +
           'export default {' + os.EOL +
           '    ' + exportResult.join(',' + os.EOL + '    ') + os.EOL +
           '};' + os.EOL;
    const exportFile = appContainerPath + '/index.js';
    fs.writeFileSync(exportFile, codeString);
    console.log('export reduer || containers complete'.green);
};

const createModReducerExport = (app) => {
    const appPath = path.resolve(__dirname, `../state/storeActions/${app}`);
    const exportFileName = path.resolve(appPath, './index.js');
    const importResult = [];
    const ModReducers = [];
    const ModContainersResult = [];
    scanFolder(appPath, (pathStr, fileName, isFolder) => {
        if (isFolder) {
            const reducerFileName = [fileName, '/reducer.js'].join('');
            const containerFileName = [fileName, '/voidContainer.js'].join('');
            if (exists(reducerFileName) && exists(containerFileName)) {
                const fName = fileName.replace(/\\/g, '/');
                const fIndex = fName.lastIndexOf('/');
                const mod = fName.substr(fIndex + 1);
                importResult.push(`import ${mod}Reducer from './${mod}/reducer';`);
                importResult.push(`import ${mod}Container from './${mod}/voidContainer';`);
                ModReducers.push(`${mod}Reducer`);
                ModContainersResult.push(`${mod}Container`);
            }
        }
    }, true);
    const importCode = importResult.join(os.EOL);
    const exportReducer = ModReducers.join(',' + os.EOL + '    ');
    const exportContainer = ModContainersResult.join(',' + os.EOL + '    ');
    const code = importCode + os.EOL + os.EOL +
                'export const ModReducers = {' + os.EOL + '    ' + exportReducer + os.EOL + '};' + os.EOL + os.EOL +
                'export const ModContainers = {' + os.EOL + '    ' + exportContainer + os.EOL + '};' + os.EOL;
    fs.writeFileSync(exportFileName, code, 'utf8');
};

const createModContainer = (app, mod) => {
    const appContainerFileName = path.resolve(__dirname, `../state/storeActions/${app}/voidContainer.js`);
    if (exists(appContainerFileName)) {
        const modPagePath = path.resolve(__dirname, `../pages/${app}/${mod}`);
        const modStatePath = path.resolve(__dirname, `../state/storeActions/${app}/${mod}`);
        if (exists(modPagePath)) {
            const modContainerFileName = path.resolve(modStatePath, './voidContainer.js');
            if (!exists(modContainerFileName)) {
                const actionFileName = [modStatePath, '/action.js'].join('');
                const reducerFileName = [modStatePath, '/reducer.js'].join('');
                const propertesFileName = [modStatePath, '/mapToProps.js'].join('');
                const containerFileName = [modStatePath, '/voidContainer.js'].join('');
                const reducerCode = fs.readFileSync(path.resolve(__dirname, './source/ModState/ModReducer.source'), 'utf8');
                const containerCode = fs.readFileSync(path.resolve(__dirname, './source/ModState/ModContainer.source'), 'utf8');
                const mapCode = 'export const mapStateToProps = (state) => ({' + os.EOL +
                                '});' + os.EOL + os.EOL +
                                'export const mapDispatchToProps = (dispatch) => ({' + os.EOL +
                                '});' + os.EOL + os.EOL;
                checkDir(modStatePath); // check path if not exists create it;
                if (!exists(containerFileName)) {
                    fs.writeFileSync(actionFileName, 'export default {};' + os.EOL, 'utf8');
                    fs.writeFileSync(reducerFileName, reducerCode, 'utf8');
                    fs.writeFileSync(containerFileName, containerCode.replace(/\$\{mod\}/g, mod), 'utf8');
                    fs.writeFileSync(propertesFileName, mapCode, 'utf8');
                    fs.writeFileSync(modStatePath + '/index.js', '');
                    createModReducerExport(app);
                    console.log(`${app}/${mod} container was create success!`);
                } else {
                    throw new Error('The container you want to create already exists!');
                }
            } else {
                throw new Error(`The ${app}/${mod}/voidContainer already exists!`);
            }
        } else {
            throw new Error(`Plase create the ${app}/${mod} folder first`);
        }
    } else {
        throw new Error('Plase create App container first');
    }
};
export const createExportReducerCommand = (pathStr) => {
    const isMatch = /[a-zA-Z0-9\/]*/.test(pathStr);
    if (!isMatch) {
        throw new Error('The path parameter format setting error can only contain the following characters');
    } else {
        const mArr = pathStr.split('/');
        let app = mArr[0] || '';
        app = formatRoute(app, 'app');
        createModReducerExport(app);
    }
};
const createPageContainer = (app, mod, page) => {
    const pageFileName = path.resolve(__dirname, `../pages/${app}/${mod}/${page}.js`);
    const pageContainerFileName = path.resolve(__dirname, `../state/storeActions/${app}/${mod}/${page}/container.js`);
    const pageContainerPath = path.resolve(__dirname, `../state/storeActions/${app}/${mod}/${page}`);
    if (exists(pageFileName)) {
        if (!exists(pageContainerFileName)) {
            const actionFileName = path.resolve(pageContainerPath, './action.js');
            const containerFileName = path.resolve(pageContainerPath, './container.js');
            const reducerFileName = path.resolve(pageContainerPath, './reducer.js');
            const actionCode = 'export default {};' + os.EOL;
            let containerCode = 'import { connect } from \'react-redux\';' + os.EOL +
                                  `import ${page} from 'AliasPages/${app}/${mod}/${page}';` + os.EOL + os.EOL;
            containerCode += 'const mapStateToProps = (state) => {' + os.EOL +
                             '    return state;' + os.EOL +
                             '};' + os.EOL + os.EOL +
                             'const mapDispatchToProps = (dispatch) => {' + os.EOL +
                             '    return {};' + os.EOL +
                             '};' + os.EOL + os.EOL +
                             `const ${page}Container = connect(` + os.EOL +
                             '    mapStateToProps,' + os.EOL +
                             '    mapDispatchToProps' + os.EOL +
                             `)(${page});` + os.EOL + os.EOL +
                             `export default ${page}Container;` + os.EOL;
            const reducerCode = 'const initState = {};' + os.EOL + os.EOL +
                                'export default (state = initState, action) => {' + os.EOL +
                                '    return state;' + os.EOL +
                                '};' + os.EOL;
            checkDir(pageContainerPath);
            fs.writeFileSync(actionFileName, actionCode, 'utf8');
            fs.writeFileSync(containerFileName, containerCode, 'utf8');
            fs.writeFileSync(reducerFileName, reducerCode, 'utf8');
            createExportPageContainer();
            console.log('Create Page Container success!!!'.green);
        } else {
            throw new Error('The page\'s container already exists!');
        }
    } else {
        throw new Error('The page file does not exist');
    }
};
const createExportPageContainer = () => {
    const modPath = path.resolve(__dirname, '../state/storeActions');
    const result = {};
    const containerImportResult = [];
    const containerExportResult = [];
    scanFolder(modPath, (pathStr, pathString, isFolder) => {
        if (isFolder) {
            const pStr = pathStr.replace(/\\/g, '/');
            const pString = pathString.replace(/\\/g, '/');
            const pIndex = pString.lastIndexOf('/');
            const pName = pString.substr(pIndex + 1);
            if (/^(Page)[a-zA-Z0-9]*/.test(pName)) {
                const containerFileName = path.resolve(pString, './container.js');
                const reducerFileName = path.resolve(pStr, './reducer.js');
                if (exists(containerFileName) && exists(reducerFileName)) {
                    const routeArr = pString.match(/\/(App[a-zA-Z0-9]*)\/(Mod[a-zA-Z0-9]*)\//);
                    const app = routeArr[1];
                    const mod = routeArr[2];
                    const curData = result[pStr] || {
                        importResult: [],
                        exportResult: [],
                        exportJson: []
                    };
                    curData.importResult.push(`import ${pName}Reducer from './${pName}/reducer';`);
                    curData.exportResult.push(`${pName}Reducer`);
                    curData.exportJson.push(pName);
                    result[pStr] = curData;
                    containerImportResult.push(`import ${app}${mod}${pName}Container from './storeActions/${app}/${mod}/${pName}/container';`);
                    containerExportResult.push(`${app}${mod}${pName}Container`);
                }
            }
        }
    });
    // **************************export reducer code to mod folder *******/
    Object.keys(result).map((key) => {
        const currentData = result[key];
        const curImportCode = currentData.importResult.join(os.EOL);
        const curExportCode = 'export default {' + os.EOL + '    ' + currentData.exportResult.join(',' + os.EOL + '    ') + os.EOL + '};' + os.EOL;
        const curJsonCode = 'export const InitState = {' + os.EOL + '    ' + currentData.exportJson.join(': {},' + os.EOL + '    ') + ': {}' + os.EOL + '};' + os.EOL;
        const curCode = curImportCode + os.EOL + os.EOL + curJsonCode + os.EOL + curExportCode;
        fs.writeFileSync(path.resolve(key, './index.js'), curCode, 'utf8');
    });
    // *************************export container code *******************/
    const importCode = containerImportResult.join(os.EOL);
    const exportCode = 'export default {' + os.EOL + '    ' + containerExportResult.join(',' + os.EOL + '    ') + os.EOL + '};' + os.EOL;
    const exportData = 'export const PageContainersJson = ' + JSON.stringify(containerExportResult, null, 4) + ';' + os.EOL + os.EOL;
    let code = importCode + os.EOL + os.EOL + exportData + exportCode;
    if (containerExportResult.length <= 0) {
        code = 'export default {};' + os.EOL;
    }
    fs.writeFileSync(path.resolve(__dirname, '../state/index.js'), code.replace(/"/g, '\''), 'utf8');
    console.log('Scan storeActions folder and create index file success'.green);
};
export const createExportPageContainerCommand = (pathStr) => {
    const isMatch = /[a-zA-Z0-9\/]*/.test(pathStr);
    if (!isMatch) {
        throw new Error('The path parameter format setting error can only contain the following characters');
    } else {
        const mArr = pathStr.split('/');
        let app = mArr[0] || '';
        let mod = mArr[1] || '';
        app = formatRoute(app, 'app');
        mod = formatRoute(mod, 'mod');
        createExportPageContainer(app, mod);
    }
};
export const createContainer = (pathStr) => {
    const isMatch = /[a-zA-Z0-9\/]*/.test(pathStr);
    if (!isMatch) {
        throw new Error('The path parameter format setting error can only contain the following characters');
    } else {
        const mArr = pathStr.split('/');
        let app = mArr[0] || '';
        let mod = mArr[1] || '';
        let page = mArr[2] || '';
        app = formatRoute(app, 'app');
        mod = formatRoute(mod, 'mod');
        page = formatRoute(page, 'page');
        if (app.length > 0 && mod.length <= 0 && page.length <= 0) {
            createAppReducers(app);
        } else if (app.length > 0 && mod.length > 0 && page.length <= 0) {
            // create mod container
            createModContainer(app, mod);
        } else if (app.length > 0 && mod.length > 0 && page.length > 0) {
            createPageContainer(app, mod, page);
        }
    }
};
