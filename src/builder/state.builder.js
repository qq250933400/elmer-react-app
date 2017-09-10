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
        const mapCode = 'export const mapStateToProps = {' + os.EOL +
                        '};' + os.EOL + os.EOL +
                        'export const mapDispatchToProps = {' + os.EOL +
                        '};' + os.EOL + os.EOL;
        checkDir(appContainerPath); // check path if not exists create it;
        if (!exists(containerFileName)) {
            fs.writeFileSync(actionFileName, 'export default {};' + os.EOL, 'utf8');
            fs.writeFileSync(reducerFileName, reducerCode, 'utf8');
            fs.writeFileSync(containerFileName, containerCode, 'utf8');
            fs.writeFileSync(propertesFileName, mapCode, 'utf8');
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
                importResult.push(`import ${mod}Container from './${mod}/Container';`);
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
                const mapCode = 'export const mapStateToProps = {' + os.EOL +
                                '};' + os.EOL + os.EOL +
                                'export const mapDispatchToProps = {' + os.EOL +
                                '};' + os.EOL + os.EOL;
                checkDir(modStatePath); // check path if not exists create it;
                console.log(containerFileName, '----------');
                if (!exists(containerFileName)) {
                    console.log(actionFileName);
                    fs.writeFileSync(actionFileName, 'export default {};' + os.EOL, 'utf8');
                    fs.writeFileSync(reducerFileName, reducerCode, 'utf8');
                    fs.writeFileSync(containerFileName, containerCode, 'utf8');
                    fs.writeFileSync(propertesFileName, mapCode, 'utf8');
                    createModReducerExport(app);
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
        }
    }
};
