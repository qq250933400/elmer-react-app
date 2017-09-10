import 'colors';
import cmdCreate from './create';
const arg = process.argv;

const command = arg[2];

try {
    if (command.toLowerCase() === 'create') {
        arg.shift();
        arg.shift();
        arg.shift();
        // const argvList = arg.slice(0, 2);
        cmdCreate(arg);
    }
} catch (e) {
    const msg = e.message;
    console.log(`[err]    ${msg}`.red);
}
