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

var API = require( __dirname + "/../API.js" );

var Http = require( "http" );

var NodeStatic = require( "node-static" );

var Path = require( "path" );

var QueryString = require( "querystring" );


//Main class

function GUI( Watch, options ) {

    var scope = this;

    var options = typeof( options ) === "object" ? options : {};

    scope.Watcher = Watch ? Watch : new Watcher();

    scope.API = new API( scope, scope.server );

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


    //Send special command to node

    command: function( data, callback ) {

        var scope = this;

        var command = scope.commands[ data.method ].bind( scope );

        if( !command ) {

            throw new Error( "Command not found " + data.method );

        }

        command( data, callback );

    }

};


//Defaults

GUI.Defaults = {
    port: 4200,
    location: Path.resolve( __dirname, "../../", "www" ) + "/",
    verbose: true
};

module.exports = GUI;
