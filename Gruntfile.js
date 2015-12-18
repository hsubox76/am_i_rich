/*global module:false*/
module.exports = function(grunt) {
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({

    clean: ["public"],

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
          src: ['bower_components/bootstrap/fonts/*.*'],
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
        files: ['client/scripts/**/*.jsx', 'client/components/**/*.jsx'],
        tasks: ['eslint']
      },
      css: {
        files: ['client/styles/*.scss'],
        tasks: ['sass']
      }
    }
  });

  // Default task.
  grunt.registerTask('check', ['jshint', 'eslint']);
  grunt.registerTask('default', ['clean', 'check', 'copy', 'sass', 'browserify']);
  grunt.registerTask('serve', ['browserify', 'concurrent:dev']);

};
