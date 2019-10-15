const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const path = require('path');

function compressImage() {
    let config = require(path.resolve("path.json"));
    
    let srcPath = path.resolve(config.src);
    srcPath = path.join(srcPath, './**/*.{png,jpg,gif,ico}');
    console.log('src:', srcPath);
    
    let destPath = path.resolve(config.dest);
    console.log('dest:', destPath);
    
    return gulp.src(srcPath)
		.pipe(cache(imagemin([
            imagemin.jpegtran({progressive: true}),
            // imagemin.optipng({optimizationLevel: 5})
            imageminPngquant()
        ])))
		.pipe(gulp.dest(destPath));
}

exports.default = compressImage

exports.clear = () => {
    cache.clearAll();
    return Promise.resolve('done');
}
