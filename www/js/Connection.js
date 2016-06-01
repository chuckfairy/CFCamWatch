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

    loggedIn: false,

    opts: {},

    socket: null,

    init: function() {

        var scope = this;

        scope.socket = scope.io();

        scope.socket.on( "login-info", scope.setInfo.bind( scope ) );

        scope.socket.on( "login-success", scope.setLogin.bind( scope ) );

    },

    createDisplay: function( type ) {

        var scope = this;

        return function( data ) {

            scope.app.display( type, data );

        }

    },


    //Socket funcs

    request: function( type, obj ) {

        this.socket.emit( type, obj );

    },

    response: function( type, callback ) {

        this.socket.on( type, callback );

    },


    //Set info

    setInfo: function( data ) {

        var scope = this;

        if( !! data.logged ) {

            scope.setLogin();

        }

        console.log( data );

        scope.dispatch({
            type: "get-info",
            data: data
        });

    },


    //Login success and go

    setLogin: function() {

        var scope = this;

        scope.loggedIn = true;

        scope.dispatch({ type: "login" });

    },


    //Login

    login: function( pass ) {

        var scope = this;

        scope.socket.emit( "login", { pass: pass } );

    }

};

CF.Watch.Dispatcher.prototype.apply( CF.Watch.Connection.prototype );
