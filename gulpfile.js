const { series, src, pipe, dest } = require("gulp");
var ts = require("gulp-typescript");
var mocha = require('gulp-mocha');

function build(cb) {
    var tsProject = ts.createProject("tsconfig.json");

    var tsResult = tsProject
        .src()
        .pipe(tsProject());

    tsResult
        .js
        .pipe(dest("dist"));

    tsResult
        .dts
        .pipe(dest("dist"));

    cb();
}

function test(cb) {
    src("test/**/*.ts")
        .pipe(mocha({
            reporter: "spec",
            require: ["ts-node/register"]
        }));

    cb();
}

exports.build = build;
exports.test = test;
exports.default = series(build, test);
