// Плагины
const gulp = require('gulp')
// Препроцессор html
const gulpPug = require('gulp-pug')
// Препроцессоры css
const sass = require('gulp-sass')(require('sass'))
const less = require('gulp-less')
const stylus = require('gulp-stylus')
// typescript
const ts = require('gulp-typescript')
// coffeescript
const coffee = require('gulp-coffee')

// Плагин для переименования файлов в директории сборки
const rename = require('gulp-rename')
// Плагин минификации css
const cleanCSS = require('gulp-clean-css')
// Плагин для перевода нового стандарта JS в старый для поддержки старых браузеров
const babel = require('gulp-babel')
// Плагин минификации js
const uglify = require('gulp-uglify')
// Плагин объединения нескольких JS файлов в один
const concat = require('gulp-concat')
// Плагин для отображения правильного источника стилей и скриптов в devTools
const sourcemaps = require('gulp-sourcemaps')
// Плагин для добавления префиксов стилям
const autoprefixer = require('gulp-autoprefixer')
// Плагин для минификации html
const htmlMin = require('gulp-htmlmin')
// Плагин для минификации изображений
const imageMin = require('gulp-imagemin')
// Плагин для отображения размера файлов в терминале
const size = require('gulp-size')
// Плагин для избежания повторного сжатия, уже сжатых изображений
const newer = require('gulp-newer')
// Плагин удаления директорий
const del = require('del')

// Плагин для автоматического обновления страницы при изменении файлов
const browserSync = require('browser-sync').create();

// Костанты путей
const paths = {
    pug: {
        src: 'src/*.pug',
        dest: 'dist/'
    },
    html: {
      src: 'src/*.html',
      dest: 'dist/'
    },
    styles: {
        src: [
            'src/styles/**/*.sass',
            'src/styles/**/*.scss',
            //'src/styles/**/*.less',
            //'src/styles/**/*.styl'
        ],
        dest: 'dist/css/'
    },
    scripts: {
        src: [
            'src/scripts/**/*.js',
            // 'src/scripts/**/*.coffee',
            // 'src/scripts/**/*.ts',

        ],
        dest: 'dist/js/'
    },
    images: {
        src: 'src/img/**',
        dest: 'dist/img/',
    }
}

// Функция очистки каталога сборки (удаляет все файлы, кроме папки img)
function clean() {
    return del(['dist/*', '!dist/img'])
}

// Функция для обработки pug
function pug() {
    return gulp.src(paths.pug.src)
        .pipe(gulpPug())
        .pipe(size())
        .pipe(gulp.dest(paths.pug.dest))
        .pipe(browserSync.stream())
}

// Функция для обработки html
function html() {
    return gulp.src(paths.html.src)
        .pipe(htmlMin({
            collapseWhitespace: true,
        }))
        .pipe(size())
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream())
}

// Функция сборки стилей
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        //.pipe(less())
        //.pipe(stylus())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(size())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream())
}

// Функция сборки скриптов
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        // .pipe(ts({
        //     noImplicitAny: true,
        //     outFile: 'main.min.js'
        // }))
        // .pipe(coffee({ bare: true }))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(size())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream())
}

// Функция для обработки изображений
function img() {
    return gulp.src(paths.images.src)
        .pipe(newer(paths.images.dest))
        .pipe(imageMin({
            progressive: true,
        }))
        .pipe(size())
        .pipe(gulp.dest(paths.images.dest))
}

// Функция отслеживания изменений
function watch() {
    browserSync.init({
        server: {
            baseDir: './dist/'
        }
    })
    gulp.watch(paths.html.src).on('change', browserSync.reload)
    gulp.watch(paths.html.src, html)
    //gulp.watch(paths.pug.src, pug)
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
    gulp.watch(paths.images.src, img)
}

// Функция сборки, состоящая из последовательного выполнения отдельных функций
// стили, скрипты, картинки выполняются параллельно
const build = gulp.series(
    clean,
    html,
    //pug,
    gulp.parallel
    (styles, scripts, img),
    watch
)

exports.clean = clean
exports.pug = pug
exports.html = html
exports.img = img
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.build = build
exports.default = build
