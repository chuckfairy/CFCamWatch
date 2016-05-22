/**
 * HTTP Response helper
 *
 * @requires [ http ]
 *
 */
"use strict";

var Utils = require( __dirname + "/../utils/Utils.js" );

var Http = require( "http" );

var NodeStatic = require( "node-static" );

var Path = require( "path" );


//Main class

var HTTPResponse = function( options ) {

    var scope = this;

    scope.opts = Utils.setDefaults( options, HTTPResponse.Defaults );

    scope.init();

};

HTTPResponse.prototype = {

    constructor: HTTPResponse,


    //Props

    opts: {},


    //Servers

    server: null,

    fileServer: null,


    //Main

    init: function() {

        var scope = this;

        scope.server = Http.createServer( scope.createServerResponse( scope.opts.location ) );
        scope.server.listen( scope.opts.port );

        scope.fileServer = new NodeStatic.Server( scope.opts.location );

        if( scope.opts.verbose ) {

            console.log(
                "Starting from location "
                + scope.opts.location
                + "\nPort "
                + scope.opts.port
            );

        }

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

};



//Defaults

HTTPResponse.Defaults = {

    port: 4200,

    location: Path.resolve( __dirname, "../../", "www" ) + "/",

    verbose: true

};


//Export

module.exports = HTTPResponse;
