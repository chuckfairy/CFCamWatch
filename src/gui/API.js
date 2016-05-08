/**
 * API for api controller
 *
 * @requires [ socket.io, GUI ]
 *
 */

var IO = require( "socket.io" );

function API( GUI, server ) {

    var scope = this;

    scope.gui = GUI;

    scope.Watcher = GUI.Watcher;

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

        console.log( "Socket initalizing" );

        var scope = this;

        scope.io = IO( scope.server );

        scope.io.on( "connection", function( socket ) {

            scope.setSocket( socket );
            scope.setWifiEvents();

        });

    },


    //set io socket events and data

    setSocket: function( socket ) {

        var scope = this;

        scope.socket = socket;

        scope.socket.on( "error", function( data ) {

            console.log( "[ERROR]", data );

        });

        scope.socket.on( "command", function( data ) {

            console.log( data );

            if( !typeof( data ) === "object" && !data.method ) {

                scope.emit( "error", "Command sent does not have a type" );

            }

            console.log( "Data sent to command", data );

            switch( data.method ) {

                case "join":
                    scope.gui.commands.join( data );
                    break;

                case "crack":
                    scope.gui.commands.crack( data );
                    break;

                default:
                    scope.emit( "error", "Command method not found " + data.method );
                    break;

            }

        });

        scope.socket.on( "get-info", function() {

            var info = {
                username: scope.gui.cracker.Username,
                hostname: scope.gui.cracker.Hostname,
                platform: scope.gui.cracker.OSPlatform,
                architecture: scope.gui.cracker.OSArch,
                freemem: scope.gui.cracker.OSFreeMemory,
                versions: scope.gui.cracker.Versions
            };

            scope.emit( "info", info );

        });

        scope.socket.on( "get-networks", function() {

            scope.emit( "networks", scope.gui.wifi.networks );

        });

    },


    //Wifi api

    setWifiEvents: function() {

        var scope = this;

        scope.wireless.on( "appear", function( data ) {

            scope.emit( "message", "[NETWORK APPEARED] " + data.ssid );

            scope.emit( "network-show", data );

        });

        scope.wireless.on( "vanish", function( data ) {

            scope.emit( "message-error", "[NETWORK VANISHED] " + data.ssid + " " + data.address );

            scope.emit( "network-leave", data );

        });

        scope.wireless.on( "join", function( data ) {

            scope.emit( "network-join", data );

        });

    },


    //Emit to client

    emit: function( type, data ) {

        console.log( "data request", type, data );
        this.socket.emit( type, data );

    }

};

module.exports = API;
