/*global module:false*/
module.exports = function(grunt) {
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({

    concurrent: {
      dev: {
        tasks: ['shell:nodemon', 'watch'],
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
      ignore_warning: {
        options: {
          '-W117': true,
        },
        src: ['Gruntfile.js', 'server.js', 'server/**/*.js', 'test/**/*.js'],
      },
      options: {
        curly: true,
        eqeqeq: true,
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
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
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
          src: ['client/lib/styles/*.css'],
          dest: 'public/styles/'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          flatten: true,
          src: ['bower_components/bootstrap/fonts/*.*'],
          dest: 'public/fonts/'
        }]
      }
    },

    shell: {
      nodemon: {
          command: 'nodemon index.js'
      }
    },

    browserify: {
      options: {
        browserifyOptions: {
          extensions: [".js", ".jsx"],
          transform: [
            ["babelify", {
              presets: ["es2015", "react"]
            }]
          ]
        },
        watch: true
      },
      all: {
        src: ['client/scripts/**/*.jsx'],
        dest: 'public/scripts/app.build.js'
      }
    },
    sass: {
      dist: {
        files: {
          'public/styles/app.css': 'client/styles/app.scss'
        }
      }
    },
    watch: {
      jsx: {
        files: ['client/scripts/**/*.jsx', 'client/routes/**/*.jsx'],
        tasks: ['eslint']
      },
      css: {
        files: ['client/styles/*.scss'],
        tasks: ['sass']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'copy', 'sass', 'browserify']);
  grunt.registerTask('check', ['eslint']);
  grunt.registerTask('serve', ['browserify', 'concurrent:dev']);

};
