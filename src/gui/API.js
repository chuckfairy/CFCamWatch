/**
 * API for api controller
 *
 * @requires [ socket.io, GUI ]
 *
 */

var IO = require( "socket.io" );

var Info = require( __dirname + "/../Info.js" );

var EventDispatcher = require( __dirname + "/../utils/EventDispatcher.js" );

function API( GUI, server ) {

    var scope = this;

    scope.gui = GUI;

    scope.server = server;

    scope.init();

}

API.prototype = {

    gui: null,

    server: null,

    io: null,

    socket: null,

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

        scope.socket = socket;

        scope.socket.on( "error", function( data ) {

            console.log( "[ERROR]", data );

        });

        scope.socket.on( "start-update", function( data ) {

            console.log( data );

        });

        scope.socket.on( "get-info", function() {

            scope.emit( "info", Info );

        });

    },


    //Emit to client

    emit: function( type, data ) {

        console.log( "data request", type );

        this.socket.emit( type, data );

    }

};

EventDispatcher.prototype.apply( API.prototype );


//Export

module.exports = API;
