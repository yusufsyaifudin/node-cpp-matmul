// native extenstion no library vs pure js

const chai = require('chai');
const assert = chai.assert;

const lib = require('./index');
const generate = lib.generate;
const matmul = lib.matmul;
const matmulFromC = lib.matrix.multiply;

// wrong array dimension
it('js should return error when array cannot be multiplied', done => {
    const a = generate(10, 100);
    const b = generate(10, 100);

    matmul(a, b, (result, err) => {
        if (err) {
            // console.log("error from js: " + e.message);
            assert.equal(err.message, 'number of columns in the first matrix should be the same as the number of rows in the second');
            done();
            return;
        }
        assert.equal(result, null);
        done();
    });
});

it('js should return error when array cannot be multiplied', done => {
    const a = generate(10, 100);
    const b = generate(10, 100);

    matmulFromC(a, b, (data, err) => {
        if (err) {
            assert.equal(err.message, 'number of columns in the first matrix should be the same as the number of rows in the second');
            done();
            return;
        }
        assert.equal(data, null);
        done();
    });
});

// wrong type
it('js should return error when argument is not an array', done => {
    const a = {1: 1, 2: 2};
    const b = {1: 1, 2: 2};

    matmul(a, b, (result, err) => {
        if (err) {
            assert.equal(err.message, 'first and second argument must be an array');
            done();
            return;
        }
        assert.equal(result, null);
        done();
    });
});

it('c extension should return error when argument is not an array', done => {
    const a = {1: 1, 2: 2};
    const b = {1: 1, 2: 2};

    matmulFromC(a, b, (data, err) => {
        if (err) {
            assert.equal(err.message, 'first and second argument must be an array');
            done();
            return;
        }
        assert.equal(data, null);
        done();
    });
});

// first argument is array one dimension
it('js should return error when first argument is not 2D array', done => {
    const a = [1, 2, 3];
    const b = [[1, 2, 3]];

    matmul(a, b, (result, err) => {
        if (err) {
            assert.equal(err.message, 'first arguments should be in 2-dimensional array format');
            done();
            return;
        }
        assert.equal(result, null);
        done();
    });
});

it('c extension should return error when first argument is not 2D array', done => {
    const a = [1, 2, 3];
    const b = [[1, 2, 3]];

    matmulFromC(a, b, (data, err) => {
        if (err) {
            assert.equal(err.message, 'first arguments should be in 2-dimensional array format');
            done();
            return;
        }
        assert.equal(data, null);
        done();
    });
});

// second argument is array one dimension
it('js should return error when second argument is not 2D array', done => {
    const a = [[1, 2, 3]];
    const b = [1, 2, 3];

    matmul(a, b, (result, err) => {
        if (err) {
            assert.equal(err.message, 'second arguments should be in 2-dimensional array format');
            done();
            return;
        }
        assert.equal(result, null);
        done();
    });
});

it('c extension should return error when second argument is not 2D array', done => {
    const a = [[1, 2, 3]];
    const b = [1, 2, 3];

    matmulFromC(a, b, (data, err) => {
        if (err) {
            assert.equal(err.message, 'second arguments should be in 2-dimensional array format');
            done();
            return;
        }
        assert.equal(data, null);
        done();
    });
});

// right dimension to compute
it('js should return right dimension', done => {
    const a = generate(100, 100);
    const b = generate(100, 100);

    matmul(a, b, (result, err) => {
        if (err) {
            return;
        }
        assert.equal(result.length, 100);
        assert.equal(result[0].length, 100);
        // console.log(result);
        done();
    });
});

it('c extension should return right dimension', done => {
    const a = generate(100, 100);
    const b = generate(100, 100);

    matmulFromC(a, b, (data, err) => {
        if (err) {
            return;
        }
        assert.equal(data.length, 100);
        assert.equal(data[0].length, 100);
        // console.log(data);
        done();
    });
});
