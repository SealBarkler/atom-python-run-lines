'use strict';

const terminal = require('./terminal');

let object = {
    'log': true,
    'cp': true,
    'options': {},
    'args': [
        'python',
        `${process.env.HOME}/Documents/hello.py`
    ]
}

let shell = new terminal.Shell();

let spawn = new terminal.SpawnWrapper(shell.object);

let process = spawn.tty(object);

process.unref();
