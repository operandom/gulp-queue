/*jshint mocha:true */

'use strict';

var gulp   = require('gulp'),
    Queue  = require('../index.js')(gulp),
    assert = require('assert'),
    queue1,
    queue2
;

function reset() {
    queue1 = new Queue();
    queue2 = new Queue();
}

before(function() {

    gulp.task('test0', function(done) {
        done();
    });

    gulp.task('test1', function (done) {
        setTimeout(function() {
            done();
        }, 100);
    });

    gulp.task('test2', function (done) {
        setTimeout(function() {
            done();
        }, 200);
    });

    gulp.task('test3', function (done) {
        setTimeout(function() {
            done();
        }, 300);
    });

    gulp.task('test4', function (done) {
        setTimeout(function() {
            done();
        }, 400);
    });

});

beforeEach(function() {
    reset();
});

describe('Queue', function() {

    it('should be a function', function() {
        assert.equal('function', typeof Queue);
    });

});


describe('New Queue', function() {

    it('should be a function', function() {
        assert.strictEqual('function', typeof queue1);
    });

    it('should add a task in the queue', function() {
        queue1('test1')();
        assert.strictEqual(1, Object.keys(queue1.instance.processing).length);
    });

    it('should not duplicate a task in a queue', function() {
        queue1('test1')();
        queue1(['test1', 'test2','test1'])();
        queue1('test2')();
        queue1(['test3', 'test2', 'test4'])();
        assert.strictEqual(4, Object.keys(queue1.instance.processing).length);
        assert.strictEqual(2, Object.keys(queue1.instance.tasks).length);
    });

    it('should not add a task in another queue', function() {
        queue1('test1')();
        assert.notStrictEqual(
            Object.keys(queue1.instance.processing).length,
            Object.keys(queue2.instance.processing).length
        );
    });

    describe('New instance', function() {

        it('should be an object', function() {
            assert.strictEqual('object', typeof queue1.instance);
        });

        it('should have 0 tasks', function() {
            assert.strictEqual(0, queue1.instance.tasks.length);
            assert.strictEqual(0, Object.keys(queue1.instance.tasks).length);
        });

        it('should not be processing', function() {
            assert.strictEqual(0, queue1.instance.processing.length);
        });
    });

});

describe('Tasks', function() {

    it ('should finish when launched', function (done) {
        var task = 'task' + Date.now();
        gulp.task(task, getTask(done));
        queue1(task)();
    });

    it ('launched multiple times at once should be executed twice', function (done) {

        var task = 'task' + Date.now(),
            i = 0,
            j = 0,
            launcher = queue1(task)
        ;

        gulp.task(task, getTask(function() {
            i++;
            if (i === 2 && Object.keys(queue1.instance.processing).length === 0) {
                done();
            }
        }));

        for (j; j < 10; j++) {
            launcher();
        }

    });

});


/* TOOLS */

function getTask(done, duration) {
    duration = duration !== undefined ? duration : 100;

    return function (cb) {
        setTimeout(function() {
            cb();
            done();
        }, duration);
    };
}
