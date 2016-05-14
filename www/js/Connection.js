/**
 * Main app connection to server
 *
 * @requires [ io ]
 *
 * @param CF.Watch.App App
 * @param Object options
 *
 */

CF.Watch.Connection = function( App, options ) {

    var scope = this;

    scope.app = App;

    scope.init();

};

CF.Watch.Connection.prototype = {

    io: window.io,

    opts: {},

    socket: null,

    init: function() {

        var scope = this;

        scope.socket = scope.io();

        scope.socket.on( "message-error", scope.createDisplay( "error" ) );

        scope.socket.on( "message", scope.createDisplay( "message" ) );

        scope.socket.on( "success", scope.createDisplay( "success" ) );

    },

    createDisplay: function( type ) {

        var scope = this;

        return function( data ) {

            scope.app.display( type, data );

        }

    },

    request: function( type, obj ) {

        this.socket.emit( type, obj );

    },

    on: function( type, callback ) {

        this.socket.on( type, callback );

    }

};
