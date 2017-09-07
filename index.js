const matrix = require('bindings')('matrix');

function generate(a, b) {
    let arr = [];
    for (let i = 0; i < a; i++) {
        arr[i] = [];
        for (let j = 0; j < b; j++) {
            arr[i][j] = 27474992373;
        }
    }
    return arr;
}

function matmul(a, b, cb) {
    let product = [];

    if (!Array.isArray(a) || !Array.isArray(b)) {
        cb(null, new Error('first and second argument must be an array'));
        return;
    }

    if (a.length > 0) {
        if (!Array.isArray(a[0])) {
            cb(null, new Error('first arguments should be in 2-dimensional array format'));
            return;
        }
    }

    if (b.length > 0) {
        if (!Array.isArray(b[0])) {
            cb(null, new Error('second arguments should be in 2-dimensional array format'));
            return;
        }
    }

    const x = a.length;
    const z = a[0].length;
    const y = b[0].length;

    if (b.length !== z) {
        // XxZ & ZxY => XxY
        cb(null, new Error('number of columns in the first matrix should be the same as the number of rows in the second'));
        return;
    }

    for (let i = 0; i < x; i++) {
        product[i] = [];
        for (let j = 0; j < x; j++) {
            product[i][j] = 0;
        }
    }
    
    // do multiplication
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
            for (let k = 0; k < z; k++) {
                product[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    cb(product, null);
}

module.exports = {
    generate: generate,
    matmul: matmul,
    matrix: matrix
}
