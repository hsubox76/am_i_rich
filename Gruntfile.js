/*global module:false*/
var envify = require('envify/custom');

module.exports = function(grunt) {
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({

    clean: ["public"],

    concurrent: {
      dev: {
        tasks: ['shell:nodemon', 'watch', 'browserify:client-dev'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    // Task configuration.
    concat: {
      dist: {
        src: ['client/scripts/*.js'],
        dest: 'public/scripts/client.min.js'
      }
    },
    
    uglify: {
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'public/scripts/client.min.js'
      }
    },

    jshint: {
      server: {
        options: {
          '-W117': true,
          'globalstrict': true
        },
        src: ['server/**/index.js']
      },
      client: {
        options: {
          '-W117': true
        },
        src: ['client/**/*.js']
      },
      options: {
        curly: true,
        eqeqeq: true,
        esnext: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      }
    },

    eslint: {
      src: ["client/scripts/**/*.jsx", "client/routes/**/*.jsx"]
    },

    copy: {
      html: {
        files: [{
          expand: true,
          flatten: true,
          src: ['client/*.html'],
          dest: 'public/'
        }]
      },
      css: {
        files: [{
          expand: true,
          flatten: true,
          src: ['bower_components/**/bootstrap.min.css'],
          dest: 'public/styles/'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          flatten: true,
          src: ['bower_components/bootstrap/fonts/*.*', 'node_modules/font-awesome/fonts/*.*'],
          dest: 'public/fonts/'
        }]
      }
    },

    shell: {
      nodemon: {
          command: './node_modules/nodemon/bin/nodemon.js --harmony server/index.js'
      },
      forever: {
        command: './node_modules/forever/bin/forever start -c "node --harmony" server/index.js'
      }
    },

    browserify: {
      options: {
      },
      vendor: {
        src: [],
        dest: 'public/scripts/vendor.build.js',
        options: {
          require: [
            "d3",
            "react",
            "react-dom",
            "jquery",
            "lodash",
            "redux",
            "react-redux",
            "redux-devtools",
            "redux-devtools-log-monitor",
            "redux-devtools-dock-monitor",
            "livereactload/babel-transform",
            "redux-thunk"],
          browserifyOptions: {
            extensions: [".js", ".jsx"],
            debug: true,
            transform: [
              ["babelify", {
                presets: ["es2015"]
              }]
            ]
          }
        }
      },
      "client-dev": {
        src: ['client/scripts/index.jsx'],
        dest: 'public/scripts/app.build.js',
        options: {
          debug: true,
          watch: true,
          keepAlive: true,
          browserifyOptions: {
            extensions: [".js", ".jsx"],
            debug: true,
            transform: [
              "babelify",
              ["envify", {
                  NODE_ENV: 'development'
                }
              ]
            ],
            plugin: ["livereactload"]
          }
        }
      },
      "client-prod": {
        src: ['client/scripts/index.jsx'],
        dest: 'public/scripts/app.build.js',
        options: {
          browserifyOptions: {
            extensions: [".js", ".jsx"],
            transform: [
              ["babelify", {
                presets: ["es2015", "react"]
              }],
              ["envify", {
                NODE_ENV: 'production'
              }
              ]
            ]
          }
        }
      }
    },
    sass: {
      dist: {
        files: {
          'public/styles/app.css': 'client/styles/app.scss',
          'public/styles/font-awesome.css': 'node_modules/font-awesome/scss/font-awesome.scss'
        }
      }
    },
    watch: {
      //scripts: {
      //  files: ['client/**/*.jsx', 'client/**/*.js'],
      //  tasks: ['eslint', 'browserify:client']
      //},
      sass: {
        files: ['client/styles/*.scss'],
        tasks: ['sass']
      },
      css: {
        files: [
          'public/styles/**/*.css',
        ],
        tasks: [],
        options: {
          livereload: true
        },
      },
    }
  });

  // Default task.
  grunt.registerTask('check', ['eslint']);
  grunt.registerTask('default', ['clean', 'check', 'copy', 'sass',
    'browserify:client-dev']);
  grunt.registerTask('build-dev', ['clean', 'check', 'copy', 'sass',
    'browserify:client-dev']);
  grunt.registerTask('dev', ['clean', 'check', 'copy', 'sass', 'concurrent:dev']);
  grunt.registerTask('prod', ['clean', 'check', 'copy', 'sass',
    'browserify:client-prod', 'shell:forever']);

};
