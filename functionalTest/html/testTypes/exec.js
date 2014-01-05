'use strict';

var exec = require('child_process').exec,
    Q = require('q'),
    fs = require('fs'),
    nextTestId = 1;

function execute (command) {
    var deferred = Q.defer();

    exec(command, function (error, stdout) {
        if (error) {
            error.message += '\n\nwhen executing: ' + command;
            deferred.reject(error);
        }
        else {
            deferred.resolve(stdout);
        }
    });
    return deferred.promise;
}

function runStep (step) {
    var deferred = Q.defer(),
        filename = 'test-' + nextTestId;

    fs.writeFileSync(filename, step.execute, { mode: 484 /* 0744 */});
    nextTestId += 1;

    execute('bash ./' + filename).done(function (stdout) {
        step.result = stdout;
        fs.unlinkSync(filename);
        deferred.resolve(step);
    }, deferred.reject);

    return deferred.promise;
}

module.exports = {
    runStep: runStep
};
