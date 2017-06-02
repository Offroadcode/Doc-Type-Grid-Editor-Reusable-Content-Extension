module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);
    var path = require("path");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        pkgMeta: grunt.file.readJSON("config/meta.json"),
        dest: grunt.option("target") || "dist",
        basePath: path.join(
            "<%= dest %>",
            "App_Plugins",
            "<%= pkgMeta.name %>"
        ),

        watch: {
            options: {
                spawn: false,
                atBegin: true
            },         
            js: {
                files: ["DocTypeGridEditorReusableContent/**/*.js"],
                tasks: ["concat:dist"]
            },
            html: {
                files: ["DocTypeGridEditorReusableContent/**/*.html"],
                tasks: ["copy:html"]
            },
            sass: {
                files: ["DocTypeGridEditorReusableContent/**/*.scss"],
                tasks: ["sass", "copy:css"]
            },
            css: {
                files: ["DocTypeGridEditorReusableContent/**/*.css"],
                tasks: ["copy:css"]
            },
            manifest: {
                files: ["DocTypeGridEditorReusableContent/package.manifest"],
                tasks: ["copy:manifest"]
            }
        },

        concat: {
            options: {
                stripBanners: false
            },
            dist: {
                src: [
                    "DocTypeGridEditorReusableContent/js/doctypegrideditor.dialog.interceptor.js",
                    "DocTypeGridEditorReusableContent/js/doctypegrideditor.dialog.override.controller.js"
                ],
                dest: "<%= basePath %>/js/DocTypeGridEditorReusableContent.js"
            }
        },

        copy: {           
            html: {
                cwd: "DocTypeGridEditorReusableContent/views/",
                src: ["*.html"],
                dest: "<%= basePath %>/views/",
                expand: true,
                rename: function(dest, src) {
                    return dest + src;
                }
            },
            css: {
                cwd: "DocTypeGridEditorReusableContent/css/",
                src: ["DocTypeGridEditorReusableContent.css"],
                dest: "<%= basePath %>/css/",
                expand: true,
                rename: function(dest, src) {
                    return dest + src;
                }
            },
            manifest: {
                cwd: "DocTypeGridEditorReusableContent/",
                src: ["package.manifest"],
                dest: "<%= basePath %>/",
                expand: true,
                rename: function(dest, src) {
                    return dest + src;
                }
            },
            umbraco: {
                cwd: "<%= dest %>",
                src: "**/*",
                dest: "tmp/umbraco",
                expand: true
            }
        },

        umbracoPackage: {
            options: {
                name: "<%= pkgMeta.name %>",
                version: "<%= pkgMeta.version %>",
                url: "<%= pkgMeta.url %>",
                license: "<%= pkgMeta.license %>",
                licenseUrl: "<%= pkgMeta.licenseUrl %>",
                author: "<%= pkgMeta.author %>",
                authorUrl: "<%= pkgMeta.authorUrl %>",
                manifest: "config/package.xml",
                readme: "config/readme.txt",
                sourceDir: "tmp/umbraco",
                outputDir: "pkg"
            }
        },

        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            src: {
                src: ["app/**/*.js", "lib/**/*.js"]
            }
        },

        sass: {
            dist: {
                options: {
                    style: "compressed"
                },
                files: {
                    "DocTypeGridEditorReusableContent/css/DocTypeGridEditorReusableContent.css": "DocTypeGridEditorReusableContent/sass/DocTypeGridEditorReusableContent.scss"
                }
            }
        },

        clean: {
            build: '<%= grunt.config("basePath").substring(0, 4) == "dist" ? "dist/**/*" : "null" %>',
            tmp: ["tmp"]
        },
    });

    grunt.registerTask("default", [
        "concat",
        "sass:dist",
        "copy:html",
        "copy:manifest",
        "copy:css"
    ]);

    grunt.registerTask("umbraco", [
        "clean:tmp",
        "default",
        "copy:umbraco",
        "umbracoPackage",
        "clean:tmp"
    ]);
};
