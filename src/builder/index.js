import 'colors';
import cmdCreate from './create';
import langRun from './lang.builder';
const arg = process.argv;

const command = arg[2].toLowerCase();

try {
    if (command === 'create') {
        arg.shift();
        arg.shift();
        arg.shift();
        // const argvList = arg.slice(0, 2);
        cmdCreate(arg);
    } else if (command === 'lang') {
        langRun();
    }
} catch (e) {
    const msg = e.message;
    console.log(`[err]    ${msg}`.red);
    console.log(e);
}
