/**
 * GUI setup and actions
 *
 * @requires [ CFCrack, os, http, node-static ]
 *
 * @param Watcher Watcher
 *
 * @param Object options
 *
 */
"use strict";

var Watcher = require( __dirname + "/../Watcher.js" );

var Utils = require( __dirname + "/../utils/Utils.js" );

var API = require( __dirname + "/API.js" );

var Http = require( "http" );

var NodeStatic = require( "node-static" );

var Path = require( "path" );

var QueryString = require( "querystring" );

var FS = require( "fs" );


//Main class

function GUI( options ) {

    var scope = this;

    scope.opts = Utils.setDefaults( options, GUI.Defaults );

    scope.init();

    scope.API = new API( scope, scope.server );

    scope.Watcher = new Watcher( null, scope.opts.watcher );

    //scope.API.on( "connect", scope.setEvents.bind( scope ) );

    scope.setEvents();

}

GUI.prototype = {

    constructor: GUI,


    //Cam watcher

    Watcher: null,


    //HTTP server

    server: null,



    //File server

    fileServer: null,


    //Opts

    opts: {},


    //Main

    init: function() {

        var scope = this;

        scope.server = Http.createServer( scope.createServerResponse( scope.opts.location ) );
        scope.server.listen( scope.opts.port );

        scope.fileServer = new NodeStatic.Server( scope.opts.location );

        console.log(
            "Starting from location "
            + scope.opts.location
            + "\nPort "
            + scope.opts.port
        );

    },


    //Main http access get

    createServerResponse: function( location ) {

        var scope = this;

        var serve = function( request, response ) {

            scope.fileServer.serve( request, response, function( err, result ) {

                if( err ) {

                    console.log( "Error on " + request.url + " - " + err.message );

                    response.writeHead( err.status, err.headers );

                    response.end();

                }

            });

        };

        return function( request, response ) {

            request.addListener( "end", function() {

                serve( request, response );

            }).resume();

        }

    },


    //Set watch events

    setEvents: function() {

        var scope = this;

        scope.Watcher.on( "update", scope.sendUpdate.bind( scope ) );

    },


    sendUpdate: function( data ) {

        var scope = this;

        FS.readFile( data.file, function( err, data ) {

            if( err ) { throw err; }

            var baseImage = "data:image/"
                + scope.Watcher.FSWebcam.opts.output
                + ";base64,"
                + new Buffer( data ).toString( "base64" );

            scope.API.emitAll( "update", {
                file: data.file,
                base64: baseImage
            });

        });

    }

};


//Defaults

GUI.Defaults = {
    port: 4200,
    location: Path.resolve( __dirname, "../../", "www" ) + "/",
    verbose: true
};

module.exports = GUI;
