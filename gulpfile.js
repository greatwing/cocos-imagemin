const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const path = require('path');
const zip = require('gulp-zip');
const moment = require("moment")
const argv = require('minimist')(process.argv.slice(2));
const exec = require('gulp-exec');
const spawn = require('child_process').spawn;
const ffmpeg = require('gulp-fluent-ffmpeg');

let config = require(path.resolve("path.json"));
let rootPath = path.resolve(config.path);
let resPath = path.join(rootPath, './res');

function compressImage() {
    let srcPath = path.join(resPath, './**/*.{png,jpg,gif,ico}');
    console.log('path:', srcPath);
    
    return gulp.src(srcPath)
		.pipe(cache(imagemin([
            imagemin.jpegtran({progressive: true}),
            // imagemin.optipng({optimizationLevel: 5})
            imageminPngquant()
        ])))
		.pipe(gulp.dest(resPath));
}

function archiveFile() {
    let timeStamp = moment().format("YYYY-MM-D_HH-mm-ss");
    let zipPath = path.join(rootPath, "../")
    return gulp.src(path.join(rootPath, "./**/*"), {base:'build'})
        .pipe(zip(`client_${timeStamp}.zip`))
        .pipe(gulp.dest(zipPath));
}

function compressAudio() {
    let srcPath = path.join(resPath, './**/*.mp3');
    return gulp.src(srcPath)
		.pipe(ffmpeg('mp3', function (cmd) {
          return cmd
            // .audioBitrate('128k')
            .audioChannels(2)
            .audioCodec('libmp3lame')
            .audioQuality(8)
        }))
		.pipe(gulp.dest(resPath));
}

exports.clear = () => {
    cache.clearAll();
    return Promise.resolve('done');
}

exports.compress = compressImage;
exports.compressAudio = compressAudio;
exports.archive = archiveFile;
exports.default = series(compressImage, archiveFile)
