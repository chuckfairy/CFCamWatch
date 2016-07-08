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

var HTTPResponse = require( __dirname + "/HTTPResponse.js" );

var API = require( __dirname + "/API.js" );

var Path = require( "path" );

var QueryString = require( "querystring" );

var FS = require( "fs" );


//Main class

function GUI( options ) {

    var scope = this;

    scope.opts = Utils.setDefaults( options, GUI.Defaults );

    scope.init();


    //Classes

    scope.HTTP = new HTTPResponse( scope.opts.http );

    scope.API = new API( scope, scope.HTTP.server, scope.opts.gui.password );

    scope.Watcher = new Watcher( scope.opts.watcher );


    //Main handlers

    scope.setEvents();

}

GUI.prototype = {

    constructor: GUI,


    //HTTP helper

    HTTP: null,


    //API

    API: null,


    //Cam watcher

    Watcher: null,


    //Opts

    opts: {},


    //Main

    init: function() { },


    //Set watch events

    setEvents: function() {

        var scope = this;

        scope.Watcher.on( "update", scope.sendUpdate.bind( scope ) );

        scope.API.on( "connect", function() {

            if( scope.opts.gui.verbose ) {

                console.log( "SOCKET CONNECTED" );

            }

        });

    },


    sendUpdate: function( cameraData ) {

        var scope = this;

        FS.readFile( cameraData.file, function( err, data ) {

            if( err ) { throw err; }

            var output = cameraData.Camera.opts.output === "bmp"
                ? "png"
                : cameraData.Camera.opts.output;

            var baseImage = "data:image/"
                + output
                + ";base64,"
                + new Buffer( data ).toString( "base64" );

            scope.API.emitAll( "update", {
                file: data.file,
                num: cameraData.num,
                base64: baseImage
            });

        });

    }

};


//Defaults

GUI.Defaults = {

    gui: {

        password: false,

        verbose: true

    }

};

module.exports = GUI;
