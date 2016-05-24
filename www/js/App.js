/**
 * Main app and namespace
 *
 * @requires [ CF.Watch.Connection ]
 *
 */
CF.Watch.App = function( options ) {

    var scope = this;

    scope.Connection = new CF.Watch.Connection();

    scope.UI = new CF.Watch.UI();

    scope.init();

};

CF.Watch.App.prototype = {

    constructor: CF.Watch.App,


    //Main connect

    Connection: null,

    UI: null,


    //Main init

    init: function() {

        var scope = this;


        //Main connection img update

        scope.Connection.response( "update", function( data ) {

            console.log( "Cam update" );

            scope.UI.update( data.base64 );

        });


        //Info set

        scope.Connection.on( "get-info", function( data ) {

            if( scope.Connection.loggedIn ) {

                scope.UI;

            }

        });


        //Main login form

    }

};
