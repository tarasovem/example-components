const { src, dest, series, parallel, watch, lastRun } = require('gulp');
const path = require('path');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const sourcemaps = require('gulp-sourcemaps');
const newer = require('gulp-newer');

const cleanBuildDir = () => {
  return src('build/', {
    read: false,
    allowEmpty: true
  })
    .pipe(clean())
};

const pugHandler = () => {
  return src(['src/pages/**/*.pug', '!src/pages/layout.pug'])
    .pipe(pug({
      pretty: true,
      basedir: path.join(__dirname, '/src')
    }))
    .pipe(dest('build/pages/'))
    .pipe(browserSync.reload({stream: true}));
};

const scssHandler = () => {
  return src(['src/pages/**/*.scss'], {base: './src'})
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(newer('build/'))
    .pipe(dest('build/'))
    .pipe(browserSync.reload({stream: true}));
};

const scssBuildHandler = () => {
  return src(['src/pages/**/*.scss'], {base: './src'})
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(dest('build/'));
};

const jsHandler = () => {
  return src('src/pages/**/*.js')
    .pipe(dest('build/pages/'))
    .pipe(browserSync.reload({stream: true}));
};

const imagesHandler = () => {
  return src('src/images/**/*.{png,jpg,jpeg,webp,svg}', {
    allowEmpty: true,
    since: lastRun(imagesHandler)
  })
    .pipe(dest('build/images'))
    .pipe(browserSync.reload({stream: true}));
};

const fontsHandler = () => {
  return src('src/fonts/*.{woff,woff2}')
    .pipe(dest('build/fonts/'))
    .pipe(browserSync.reload({stream: true}));
};

const serve = () => {
  browserSync.init({
    server: 'build/',
    open: false,
    tunnel: false
  });
  
  watch(
    [
      'src/pages/**/*.pug', 
      'src/components/**/*.pug'
    ],
    {
      usePolling: true
    },
    pugHandler
  );
  
  watch(
    [
      'src/pages/**/*.scss', 
      'src/components/**/*.scss', 
      'src/scss/*.scss'
    ], 
    {
      usePolling: true
    },
    scssHandler
  );
  
  watch(
    'src/**/*.js', 
    {
      usePolling: true
    },
    jsHandler
  );
  
  watch(
    'src/images/*.{png,jpg,jpeg,webp,svg}', 
    {
      usePolling: true
    },
    imagesHandler
  );
  
  watch(
    'src/fonts/*.{woff,woff2}', 
    {
      usePolling: true
    },
    fontsHandler
  );
};

exports.build = series(
  cleanBuildDir,
  parallel(
    pugHandler,
    scssBuildHandler,
    jsHandler,
    imagesHandler,
    fontsHandler
  )
);

exports.default = series(
  cleanBuildDir,
  parallel(
    pugHandler,
    scssHandler,
    jsHandler,
    imagesHandler,
    fontsHandler
  ),
  serve
);
