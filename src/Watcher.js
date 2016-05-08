/**
 * Watcher
 *
 * @requires [ FSWebCam ]
 *
 */
"use strict";

var Utils = require( __dirname + "/utils/Utils.js" );

var EventDispatcher = require( __dirname + "/utils/EventDispatcher.js" );

var Path = require( "path" );

var FS = require( "fs" );

var FSWebcam = require( __dirname + "/FSWebcam.js" );


//Main Class

function Watcher( Cam, opts ) {

    var scope = this;

    scope.FSWebcam = Cam ? Cam : new FSWebcam();

    scope.opts = Utils.setDefaults( opts, Watcher.Defaults );

    scope.watches = [];

    if( scope.opts.autoStart ) {

        scope.update();

    }

}

Watcher.prototype = {

    constructor: Watcher,


    //Opts

    opts: {},


    //Webcam class

    FSWebcam: null,


    //Update times

    lastUpdateTime: Date.now(),


    //Watched pictures

    watches: [],


    //Main update

    update: function() {

        var scope = this;

        var location = scope.opts.dir
            + scope.opts.name
            + Date.now();

        scope.FSWebcam.capture( location, function() {

            scope.lastUpdateTime = Date.now();

            scope.watches.push( location );

            scope.checkWatches();

            scope.dispatch({
                type: "update",
                file: location
            });

            if( ! scope.opts.autoUpdate ) { return; }

            if( scope.opts.time ) {

                setTimeout( scope.update.bind( scope ), scope.opts.time );

            } else {

                scope.update();

            }

        });

    },


    //check watches and delete to many in config

    checkWatches: function() {

        var scope = this;

        var deleteAfter = scope.opts.deleteAfter;

        var wl = scope.watches.length;

        if( ! deleteAfter ) { return; }

        if( wl < deleteAfter ) { return; }

        var deleteWatch = scope.watches.shift();

        FS.unlink( deleteWatch, function() {

            if( scope.opts.verbose ) {

                console.log( "FILE DELETE " + deleteWatch );

            }

            scope.dispatch({
                type: "delete",
                file: deleteWatch
            });

        });

    }


};


//Extend from Dispatcher

EventDispatcher.prototype.apply( Watcher.prototype );


//Defaults

Watcher.Defaults = {

    name: "webcam_",

    time: 5000,

    autoStart: true,

    autoUpdate: true,

    deleteAfter: 10,

    verbose: true,

    dir: Path.resolve( __dirname, "..", "cache" ) + "/"

};

module.exports = Watcher;
