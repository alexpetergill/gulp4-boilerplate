'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const browserSync = require('browser-sync').create()

const dirs = {
  src: 'src',
  dist: 'dist'
}

var paths = {
  styles: {
    src: `${dirs.src}/styles/style.scss`,
    dist: `${dirs.dist}/styles/`,
    wildcard: `${dirs.src}/styles/**/*.scss`
  },
  scripts: {
    src: `${dirs.src}/scripts/script.js`,
    dist: `${dirs.dist}/scripts/`,
    wildcard: `${dirs.src}/scripts/**/*.js`,
    dir: `${dirs.src}/scripts/`
  },
  images: {
    src: `${dirs.src}/images/**/*.*`,
    dist: `${dirs.dist}/images`,
  },
  templates: {
    src: `${dirs.src}/index.html`,
    dist: dirs.dist,
  }
};

const serve = () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
      index: "index.html",
      directory: false,
      https: false,
    },
    watch: true,
    port: 8083,
    open: true,
    cors: true,
    notify: false
  })
}

const styles = () => {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', function (error) {
      console.log(error);
    }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dist))
}

const scripts = () => {
  gulp.src(paths.scripts.src)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest(paths.scripts.dist))
}

const images = () => {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dist))
}

const templates = () => {
  return gulp.src(paths.templates.src)
    .pipe(gulp.dest(paths.templates.dist))
}

const watch = () => {
  gulp.watch(paths.styles.wildcard, gulp.series('styles')).on('change', browserSync.reload)
  gulp.watch(paths.scripts.wildcard, gulp.series('scripts')).on('change', browserSync.reload)
  gulp.watch(paths.templates.src, gulp.series('templates')).on('change', browserSync.reload)
}

gulp.task('styles', styles)
gulp.task('scripts', scripts)
gulp.task('templates', templates)
gulp.task('images', images)
gulp.task('serve', serve)
gulp.task('watch', watch)

gulp.task('default', gulp.parallel('styles', 'scripts', 'templates', 'images', 'serve', 'watch'))
