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

    if( !! pass ) {

        scope.authentication = pass;

    }

    scope.init();

}

API.prototype = {

    gui: null,

    server: null,

    io: null,

    sockets: [],

    authentication: false,

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

        socket.authenicated = false;


        //Auto login if no pass

        if( scope.authenication === false ) {

            scope.loginSocket( socket );

        }


        //Set info login

        socket.emit( "login-info", {
            logged: ! scope.authentication,
            num: scope.gui.Watcher.Cameras.length
        } );


        //Disconnect socket

        socket.on( "disconnect", function() {

            if( socket.authenticated ) {

                var i = scope.sockets.indexOf( socket );
                scope.sockets.splice( i, 1 );

            }

        });


        //Login action

        socket.on( "login", function( data ) {

            console.log( data );

            data.pass = data.pass || "";

            if( data.pass.trim() === scope.authentication ) {

                scope.loginSocket( socket );

                socket.emit( "login-success", {} );

            }

        });


        //Socket err

        socket.on( "error", function( data ) {

            console.log( "[ERROR]", data );

        });

    },


    //Socket login

    loginSocket: function( socket ) {

        var scope = this;

        scope.sockets.push( socket );

        socket.authenicated = true;

    },


    //Emit to client

    emitAll: function( type, data ) {

        var scope = this;

        var sl = scope.sockets.length;

        for( var i = 0; i < sl; i ++ ) {

            var socket = scope.sockets[ i ];

            socket.emit( type, data );

        }

    },


    //Emit to socket

    emit: function( socket, type, data ) {

        socket.emit( type, data );

    }

};

EventDispatcher.prototype.apply( API.prototype );


//Export

module.exports = API;
