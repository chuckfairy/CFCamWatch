/**
 * Watcher
 *
 * @requires [ FSWebCam ]
 *
 */
"use strict";

var Async = require( "async" );

var Path = require( "path" );

var FS = require( "fs" );

var NodeWebcam = require( "node-webcam" );

var NodeZip = require( "node-zip" );

var Moment = require( "moment" );

var JSFtp = require( "jsftp" );

var Utils = require( __dirname + "/utils/Utils.js" );

var EventDispatcher = require( __dirname + "/utils/EventDispatcher.js" );


//Main Class

function Watcher( opts ) {

    var scope = this;

    scope.opts = Utils.setDefaults( opts, Watcher.Defaults );

    scope.setCameras();

    scope.watches = [];

    scope.archives = [];


    //Auto delete set after process quit

    if( scope.opts.autoDelete ) {

        scope.setAutoDelete();

    }


    //FTP connection start

    if( scope.opts.ftp.enabled ) {

        scope.setFTP();

    }


    //Auto start watching

    if( scope.opts.autoStart ) {

        scope.update();

    }

}

Watcher.prototype = {

    constructor: Watcher,


    //Opts

    opts: {},


    //Webcam class

    Cameras: null,


    //Update times

    startUpdateTime: Date.now(),

    lastUpdateTime: Date.now(),

    lastLocation: "",


    //Watched pictures

    watches: [],

    archives: [],


    //FTP

    ftp: null,


    //Main update

    update: function() {

        var scope = this;


        //Main udpate per camera

        var index = 0;

        function updateCamera( Camera, callback ) {

            var update = updateCamera.bind( scope, Camera, index );

            var location = scope.opts.dir
                + scope.opts.name
                + "camera" + index
                + "_" + Date.now();

            scope.lastLocation = location;

            Camera.capture( location, function( fileLocale ) {

                console.log( "FILE SAVED " + fileLocale );

                scope.lastUpdateTime = Date.now();

                scope.watches.push( fileLocale );

                scope.dispatch({
                    type: "update",
                    Camera: Camera,
                    num: index,
                    file: fileLocale
                });

                scope.checkWatches();

                index++;

                callback();

            });

        }


        //Loop

        Async.mapSeries( scope.Cameras, updateCamera, function() {

            if( ! scope.opts.autoUpdate ) { return; }

            if( scope.opts.time ) {

                setTimeout( scope.update.bind( scope ), scope.opts.time );

            } else {

                scope.update();

            }

        });

    },


    //Set cameras

    setCameras: function() {

        var scope = this;

        var devices = scope.opts.devices;

        scope.Cameras = [];

        function createCamera( device ) {

            var opts = { device: device };

            opts = Utils.setDefaults( opts, scope.opts.webcam );

            return NodeWebcam.create( opts );

        }

        if( devices ) {

            var dl = devices.length;

            for( var i = 0; i < dl; i ++ ) {

                var Camera = createCamera( devices[ i ] );

                scope.Cameras.push( Camera );

            }

        } else {

            var Camera = NodeWebcam.create( scope.opts.webcam );

            scope.Cameras.push( Camera );

        }

    },


    //check watches and delete to many in config

    checkWatches: function() {

        var scope = this;

        var deleteAfter = scope.opts.deleteAfter;

        var archive = scope.opts.archiveAfter;

        var wl = scope.watches.length;

        if( archive && wl > archive ) {

            return scope.archiveWatches();

        }

        if( ! deleteAfter ) { return; }

        if( wl < deleteAfter ) { return; }

        var deleteWatch = scope.watches.shift();

        scope.deleteWatch( deleteWatch );

    },


    //Archive zip

    archiveWatches: function() {

        var scope = this;

        var Zip = new NodeZip();

        var watches = scope.watches.splice( 0, scope.opts.archiveAfter );

        var wl = scope.watches.length;

        var dir = scope.opts.zipDir
            ? scope.opts.zipDir
            : scope.opts.dir;

        var zipName = dir
            + scope.opts.name
            + scope.startUpdateTime
            + "-"
            + scope.lastUpdateTime
            + ".zip";

        function zipWatch( watch, callback ) {

            FS.readFile( watch, function( err, data ) {

                Zip.file( Path.basename( watch ), data );

                scope.deleteWatch( watch );

                callback();

            });

        }

        Async.map( watches, zipWatch, function() {

            if( scope.opts.verbose ) {

                console.log( "ARCHIVING WATCHES " + zipName );

            }


            //Generate and write locally

            var data = Zip.generate({
                base64: false,
                compression: "DEFLATE"
            });

            FS.writeFile( zipName, data, 'binary' );

            scope.archives.push( zipName );


            //Rewrites

            scope.startUpdateTime = Date.now();


            //FTP upload

            if( !! scope.ftp ) {

                scope.ftpUpload( Path.basename( zipName ), data );

            }

        });

    },


    //Delete watch

    deleteWatch: function( location, callback ) {

        var scope = this;

        FS.unlink( location, function() {

            if( scope.opts.verbose ) {

                console.log( "FILE DELETE " + location );

            }

            scope.dispatch({
                type: "delete",
                file: location
            });

            callback && callback();

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

            var al = scope.archives.length;

            for( var i = 0; i < wl; i ++ ) {

                FS.unlinkSync( scope.watches[ i ] );

            }

            for( var i = 0; i < al; i ++ ) {

                FS.unlinkSync( scope.archives[ i ] );

            }

            scope.watches = [];

        }

        process.on( "exit", autoDelete );

        process.on( "SIGINT", autoDelete );

    },


    //Setup FTP

    setupFTP: function() {

        var scope = this;

        scope.ftp = new JSFtp( scope.opts.ftp );

    },


    //ftp upload

    ftpUpload: function( ftpFile, data, callback ) {

        var scope = this;

        scope.ftp.put( data, ftpData, function( err ) {

            if( err ) { throw err; }

            if( scope.opts.verbose ) {

                console.log( "UPLOADED ARCHIVE TO FTP " + zipName );

            }

            scope.dispatch({
                type: "ftp-upload",
                file: ftpFile
            });

            callback && callback();

        });

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

    deleteAfter: false,

    archiveAfter: 5,

    verbose: true,

    dir: Path.resolve( __dirname, "..", "cache" ) + "/",

    zipDir: false,

    webcam: {},

    ftp: {
        enabled: false,
        host: "",
        port: 3333,
        username: "",
        password: "",
        debugMode: true,
        dir: ""
    }

};

module.exports = Watcher;
