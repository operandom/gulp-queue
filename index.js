'use strict';

var g,
    prefix = 'queue_';

function Queue() {

    var helper = function (task) {
        return function () {
            this.push(task);
        }.bind(this);
    }.bind(this);

    helper.instance = this;

    this.tasks = [];
    this.processing = [];

    return helper;
}


Queue.prototype.prefix = prefix;


Queue.prototype.push = function (tasks) {

    if (typeof tasks === 'string') {
        tasks = [tasks];
    }

    tasks.forEach(function (task) {
        if (this.tasks.indexOf(task) !== -1) {
            return;
        }
        this.tasks.push(task);
        this.process();
    }.bind(this));

};


Queue.prototype.process = function() {

    var i, l, task;

    i = 0;
    l = this.tasks.length;

    for (i; i < l; i++) {

        task = this.tasks.shift();

        if (this.processing.hasOwnProperty(prefix + task)) {
            //console.log('Task "' + task + '" already in processing queue');
            this.tasks.push(task);
        } else {
            //console.log('Task "' + task + '" added   to processing queue');
            this.processing[prefix + task] = false;
        }

    }


    Array.prototype.forEach.call(Object.keys(this.processing), function(task){

        if (!(task in this.processing) || this.processing[task] === true) {
            return;
        }

        this.processing[task] = true;

        g.start(task.replace(prefix, ''), function (error) {
            if (error) {
                throw error;
            }
            delete this.processing[task];
            this.process();
        }.bind(this));

    }.bind(this));

};


module.exports = function (gulp) {
    g = gulp;
    return Queue;
};
