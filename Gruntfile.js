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
      }
    },

    shell: {
      nodemon: {
          command: 'nodemon index.js'
      }
    },

    browserify: {
      options: {
        transform: [require('grunt-react').browserify]
      },
      client: {
        src: ['client/scripts/*.jsx'],
        dest: 'public/scripts/app.build.js'
      },
      lib: {
        src: ['client/lib/scripts/jquery.min.js',
        'client/lib/scripts/d3.min.js'],
        dest: 'public/lib/scripts/lib.min.js'
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
      scripts: {
        files: ['client/scripts/*.jsx', 'client/routes/*.js'],
        tasks: ['browserify']
      },
      css: {
        files: ['client/styles/*.scss'],
        tasks: ['sass']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'copy', 'sass', 'browserify']);
  grunt.registerTask('serve', ['browserify', 'concurrent:dev']);

};
