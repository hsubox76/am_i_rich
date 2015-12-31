/*global module:false*/
module.exports = function(grunt) {
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({

    clean: ["public"],

    concurrent: {
      dev: {
        tasks: ['shell:nodemon', 'watch', 'browserify:client'],
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
          command: 'nodemon --harmony server/index.js'
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
            "redux-thunk"],
          browserifyOptions: {
            extensions: [".js", ".jsx"],
            transform: [
              ["babelify", {
                presets: ["es2015"]
              }]
            ]
          }
        }
      },
      client: {
        src: ['client/scripts/index.jsx'],
        dest: 'public/scripts/app.build.js',
        options: {
          external: ["node_modules/**/*.js"],
          debug: true,
          watch: true,
          keepAlive: true,
          browserifyOptions: {
            extensions: [".js", ".jsx"],
            debug: true,
            transform: [
              ["babelify", {
                presets: ["es2015", "react"]
              }]
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
      options: {
        livereload: true
      },
      //scripts: {
      //  files: ['client/**/*.jsx', 'client/**/*.js'],
      //  tasks: ['eslint', 'browserify:client']
      //},
      css: {
        files: ['client/styles/*.scss'],
        tasks: ['sass']
      }
    }
  });

  // Default task.
  grunt.registerTask('check', ['eslint']);
  grunt.registerTask('default', ['clean', 'check', 'copy', 'sass', 'browserify']);
  grunt.registerTask('serve', ['concurrent:dev']);

};
