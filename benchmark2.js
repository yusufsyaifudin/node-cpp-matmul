// Large dataset

const Benchmark = require('benchmark');
const lib = require('./index');

const suite = new Benchmark.Suite();
const generate = lib.generate;
const matmul = lib.matmul;
const matrix = lib.matrix;

console.log("Large dataset");
const a = generate(100, 100);
const b = generate(100, 100);
suite
.add('Pure JS', {
    'defer': true,
    'fn': function(deferred) {
        matmul(a, b, function(data, err) {
            if (err) throw err;
            deferred.resolve();
        });
    }
})
.add('C extension', {
    'defer': true,
    'fn': function(deferred) {
        matrix.multiply(a, b, function(data, err) {
            if (err) throw err;
            deferred.resolve();
        });
    }
})
.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
    console.log('Fastest: ' + this.filter('fastest').map('name'));
})
.run({ async: true });
