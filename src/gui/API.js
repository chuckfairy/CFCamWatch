/**
 * API for api controller
 *
 * @requires [ socket.io, GUI ]
 *
 */
"use strict";

var IO = require( "socket.io" );

var Info = require( __dirname + "/../Info.js" );

var EventDispatcher = require( __dirname + "/../utils/EventDispatcher.js" );


//Main Class

function API( GUI, server, pass ) {

    var scope = this;

    scope.gui = GUI;

    scope.server = server;

    scope.sockets = [];

    scope.init();

}

API.prototype = {

    gui: null,

    server: null,

    io: null,

    socket: null,

    sockets: [],

    opts: {},


    //main startup of socket

    init: function() {

        var scope = this;

        scope.io = IO( scope.server );

        scope.io.on( "connection", function( socket ) {

            console.log( "Socket initalizing" );

            scope.setSocket( socket );

            scope.dispatch( { type: "connect" } );

        });

    },


    //set io socket events and data

    setSocket: function( socket ) {

        var scope = this;

        scope.sockets.push( socket );

        socket.on( "error", function( data ) {

            console.log( "[ERROR]", data );

        });

        socket.on( "start-update", function( data ) {

            console.log( data );

        });

        socket.on( "get-info", function() {

            scope.emit( "info", Info );

        });

    },


    //Emit to client

    emitAll: function( type, data ) {

        var scope = this;

        scope.io.emit( type, data );

    },


    //Emit to socket

    emit: function( socket, type, data ) {

        socket.emit( type, data );

    }

};

EventDispatcher.prototype.apply( API.prototype );


//Export

module.exports = API;
