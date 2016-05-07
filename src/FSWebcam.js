/**
 * API for fswebcam
 *
 * @requires [ fswebcam ]
 *
 * @param Object options
 *
 */
"use strict";

var CHILD_PROCESS = require('child_process');

var EXEC = CHILD_PROCESS.exec;

var Utils = require( "utils/Utils.js" );



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

        var sh = scope.opts.bin + " "
            + resolution + " "
            + output + " "
            + delay + " "
            + location;

        return sh;

    },


    /**
     * Capture shot
     *
     * @param String location
     * @param Function callback
     *
     */
    capture: function( location, callback ) {

        var sh = scope.generateSh( location );

        console.log( sh );

        return;

        EXEC( sh, function( response ) {

            console.log( response );

            callback && callback();

        });

    }

};


//Defaults

FSWebcam.Defaults = {

    banner: false,

    width: 640,

    height: 480,

    delay: 0,

    quality: 100,

    output: "jpeg"

};
