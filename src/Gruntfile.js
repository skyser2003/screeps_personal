const fs = require("fs");

const screepsInfo = JSON.parse(fs.readFileSync("screeps_info.json"));

module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-screeps");

    grunt.initConfig({
        screeps: {
            options: {
                email: screepsInfo["email"],
                token: screepsInfo["token"],
                branch: "default",
                //server: "season"
            },
            dist: {
                src: ["dist/*.js"]
            }
        }
    });
}