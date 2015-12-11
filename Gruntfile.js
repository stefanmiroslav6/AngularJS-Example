'use strict';

module.exports = function (grunt) {

    var serveStatic = require('serve-static');

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths for the application
    var appConfig = {
        base: '.',
        app: 'app',
        test: 'test',
        tmp: '.tmp',
        build: 'build/app'
    };

    // Env variables
    var env = require('./env');

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        appConfig: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= appConfig.app %>/**/*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            html: {
                files: ['<%= appConfig.app %>/index.html'],
                tasks: ['inject'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            inject: {
                files: {
                    expand: true,
                    cwd: '<%= appConfig.app %>',
                    src: ['/**/*.js', '/**/*/scss']
                },
                tasks: ['inject'],
                options: {
                    event: ['added', 'deleted']
                }
            },
            jsTest: {
                files: ['<%= appConfig.test %>/**/*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            compass: {
                files: ['<%= appConfig.app %>/**/*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer']
            },
            gruntfie: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= appConfig.app %>/**/*.html',
                    '<%= appConfig.tmp %>/styles/*.css',
                    '<%= appConfig.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect) {
                        return [
                            serveStatic(appConfig.tmp),
                            connect().use(
                                '/bower_components',
                                serveStatic('./bower_components')
                            ),
                            connect().use(
                                '/app',
                                serveStatic(appConfig.app)
                            ),
                            connect().use(
                                '/fonts',
                                serveStatic('./bower_components/bootstrap-sass/assets/fonts')
                            )
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            serveStatic(appConfig.tmp),
                            serveStatic(appConfig.test),
                            connect().use(
                                '/bower_components',
                                serveStatic('./bower_components')
                            ),
                            connect().use(
                                '/app',
                                serveStatic(appConfig.app)
                            )
                        ];
                    }
                }
            },
            build: {
                options: {
                    open: true,
                    base: '<%= appConfig.build %>'
                }
            }
        },

        // Make sure code styles are up to part and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= appConfig.app %>/**/*.js'
                ]
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['<%= appConfig.test %>/**/*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            build: {
                files: [{
                    dot: true,
                    src: [
                        '<%= appConfig.tmp %>',
                        '<%= appConfig.build %>'
                    ]
                }]
            },
            server: '<%= appConfig.tmp %>'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= appConfig.tmp %>',
                    src: '*.css',
                    dest: '<%= appConfig.tmp %>'
                }]
            }
        },

        // Automatically inject bower components into the app
        wiredep: {
            app: {
                src: ['<%= appConfig.tmp %>/index.html'],
                ignorePath: /\.\./
            },
            sass: {
                src: ['<%= appConfig.tmp %>/app.scss'],
                ignorePath: /\.\.\//
            }
        },

        // Automatically inject local dependencies into the app
        injector: {
            js: {
                options: {
                    template: '<%= appConfig.app %>/index.html',
                    destFile: '<%= appConfig.tmp %>/index.html',
                    relative: false,
                    addRootSlash: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= appConfig.app %>',
                    src: ['**/*.module.js', '**/*.js']
                }]
            },
            sass: {
                options: {
                    template: '<%= appConfig.app %>/app.scss',
                    destFile: '<%= appConfig.tmp %>/app.scss',
                    starttag: '// injector:{{ext}}',
                    endtag: '// endinjector',
                    transform: function(filePath) {
                        return '@import "' + filePath + '";';
                    },
                    addRootSlash: false
                },
                files: [{
                    expand: true,
                    cwd: '<%= appConfig.app %>',
                    src: ['**/*.scss', '!app.scss']
                }]
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: '<%= appConfig.tmp %>',
                cssDir: '<%= appConfig.tmp %>',
                importPath: ['.']
            },
            build: {
                options: {
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            build: {
                src: [
                    '<%= appConfig.build %>/*.js',
                    '<%= appConfig.build %>/*.css',
                    '<%= appConfig.build %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= appConfig.build %>/fonts/*'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so 
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= appConfig.tmp %>/index.html',
            options: {
                dest: '<%= appConfig.build %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglify'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on fileref and the useminPrepare configuration
        usemin: {
            html: ['<%= appConfig.build %>/*.html'],
            css: ['<%= appConfig.build %>/*.css'],
            options: {
                assetsDirs: ['<%= appConfig.build %>', '<%= appConfig.build %>/images']
            }
        },

        imagemin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= appConfig.app/images',
                    src: '*.{png,jpg,jpeg,gif}',
                    dest: '<%= appConfig.build/images'
                }]
            }
        },

        svgmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= appConfig.build/images',
                    src: '*.svg',
                    dest: '<%= appConfig.build/images'
                }]
            }
        },

        htmlmin: {
            build: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= appConfig.build',
                    src: '*.html',
                    dest: '<%= appConfig.build'
                }]
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= appConfig.tmp %>',
                    src: ['*.js', '!oldieshim.js'],
                    dest: '<%= appConfig.tmp %>'
                }]
            }
        },

        // Replace Google CDN reference
        cdnify: {
            build: {
                html: ['<%= appConfig.build %>/*.html']
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            build: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= appConfig.app %>',
                    dest: '<%= appConfig.build %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/**/*.{webp}',
                        'fonts/**/*'
                    ]
                }, {
                    expand: true,
                    cwd: '<%= appConfig.tmp %>',
                    dest: '<%= appConfig.build %>',
                    src: ['index.html']
                }, {
                    expand: true,
                    cwd: 'bower_components/bootstrap-sass/assets',
                    src: 'fonts/**/*',
                    dest: '<%= appConfig.build %>'
                }]
            },
            server: {
                expand: true,
                cwd: '<%= appConfig.app %>',
                dest: '<%= appConfig.tmp %>',
                src: ['index.html', 'app.scss']
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'compass:server'
            ],
            test: [
                'compass'
            ],
            build: [
                'compass:build',
                'imagemin',
                'svgmin'
            ]
        },

        // Concatenate & register AngularJS templates in the $templateCache
        ngtemplates:  {
            app: {
                src: ['<%= appConfig.app %>/**/*.html', '!<%= appConfig.app %>/index.html'],
                dest: '<%= appConfig.tmp %>/templates.js',
                options:  {
                    module: 'app.core',
                    htmlmin: '<%= htmlmin.build.options %>',
                    usemin: 'scripts/app.js' // <~~ This came from the <!-- build:js --> block 
                }
            }
        },

        ngconstant: {
            // Options for all targets
            options: {
                space: '  ',
                wrap: true,
                name: 'app.env'
            },
            // Environment targets
            development: {
                options: {
                    dest: '<%= appConfig.app %>/app.env.js'
                },
                constants: {
                    ENV: env.development
                }
            },
            production: {
                options: {
                    dest: '<%= appConfig.app %>/app.env.js'
                },
                constants: {
                    ENV: env.production
                }
            }
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        }
    });

    grunt.registerTask('inject', 'Inject into main html and sass', [
        'injector',
        'wiredep'
    ]);

    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
        if (target === 'build') {
            return grunt.task.run(['minified', 'connect:build:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'ngconstant:development',
            'inject',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('minified', [
        'clean:build',
        'ngconstant:production',
        'inject',
        'useminPrepare',
        'concurrent:build',
        'autoprefixer',
        'ngtemplates',
        'concat',
        'ngAnnotate',
        'copy:build',
        'cdnify',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'minfied'
    ]);
};