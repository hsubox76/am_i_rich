/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    concurrent: {
      dev: {
        tasks: ['shell:nodemon', 'watch:scripts'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    // Task configuration.
    concat: {
      dist: {
        src: ['client/scripts/*.js'],
        dest: 'public/scripts/'
      }
    },
    
    uglify: {
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'public/scripts/*.min.js'
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
        dest: 'client/scripts/app.build.js'
      }
    },

    watch: {
      scripts: {
        files: ['client/scripts/*.jsx', 'client/routes/*.js'],
        tasks: ['browserify']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-concurrent');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('serve', ['browserify', 'concurrent:dev']);

};
