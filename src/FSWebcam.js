/**
 * API for fswebcam
 *
 * @requires [ fswebcam ]
 *
 * @param Object options
 *
 */
"use strict";

var Utils = require( __dirname + "/utils/Utils.js" );

var CHILD_PROCESS = require('child_process');

var EXEC = CHILD_PROCESS.exec;


//Main class

function FSWebcam( options ) {

    var scope = this;

    scope.opts = Utils.setDefaults( options, FSWebcam.Defaults );

}

FSWebcam.prototype = {

    constructor: FSWebcam,


    //Opts

    opts: {},


    //bin command str

    bin: "fswebcam",


    /**
     * Generate shell statement
     *
     * @param String location
     *
     */
    generateSh: function( location ) {

        var scope = this;

        var resolution = " -r "
            + scope.opts.width + "x" + scope.opts.height;

        var output = "--" + scope.opts.output;

        var quality = scope.opts.quality;

        var delay = scope.opts.delay
            ? "-D " + scope.opts.delay
            : "";

        var sh = scope.bin + " "
            + resolution + " "
            + output + " "
            + quality + " "
            + delay + " "
            + location;

        return sh;

    },


    /**
     * Capture shot
     *
     *
     * @param String location
     * @param Function callback
     *
     */
    capture: function( location, callback ) {

        var scope = this;

        var fileType = FSWebcam.OutputTypes[ scope.opts.output ];

        location = location + "." + fileType;

        var sh = scope.generateSh( location );

        console.log( sh );

        EXEC( sh, function( err, out, derr ) {

            if( err ) {

                console.log( derr );

                throw err;

            }

            if( scope.opts.verbose && out ) {

                console.log( out );

            }

            callback && callback( location );

        });

    }

};


//Defaults

FSWebcam.Defaults = {

    banner: false,

    width: 1280,

    height: 720,

    delay: 0,

    quality: 100,

    output: "jpeg",

    verbose: true

};


//Output types

FSWebcam.OutputTypes = {

    "jpeg": "jpg",

    "png": "png"

};

module.exports = FSWebcam;
