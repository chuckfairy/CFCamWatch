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

    if( scope.opts.autoDelete ) {

        scope.setAutoDelete();

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

    lastLocation: "",


    //Watched pictures

    watches: [],


    //Main update

    update: function() {

        var scope = this;

        var location = scope.opts.dir
            + scope.opts.name
            + Date.now();

        scope.lastLocation = location;

        scope.FSWebcam.capture( location, function( fileLocale ) {

            var location = fileLocale;

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

    },


    //Set auto delete

    setAutoDelete: function() {

        console.log( "Auto delete enabled" );

        var scope = this;

        function autoDelete( code ) {

            console.log( "Exit code given", code );
            console.log( "Auto deleting images"  );

            var wl = scope.watches.length;

            for( var i = 0; i < wl; i ++ ) {

                FS.unlinkSync( scope.watches[ i ] );

            }

            scope.watches = [];

        }

        process.on( "exit", autoDelete );

        process.on( "SIGINT", autoDelete );

    }


};


//Extend from Dispatcher

EventDispatcher.prototype.apply( Watcher.prototype );


//Defaults

Watcher.Defaults = {

    name: "webcam_",

    time: 0,

    autoStart: true,

    autoUpdate: true,

    autoDelete: true,

    deleteAfter: 10,

    verbose: true,

    dir: Path.resolve( __dirname, "..", "cache" ) + "/"

};

module.exports = Watcher;
