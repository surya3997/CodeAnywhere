const exec = require('child_process').exec;
exec('g++ test.cpp;./a.out', {timeout : 5000}, (e, stdout, stderr)=> {
    if (e instanceof Error) {
        console.error(e);
        throw e;
    }
    console.log('stdout ', stdout);
    console.log('stderr ', stderr);
});
