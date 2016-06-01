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

    scope.images = [];

    scope.cameras = [];

    scope.init();

};

CF.Watch.App.prototype = {

    constructor: CF.Watch.App,


    //Main connect

    Connection: null,

    UI: null,


    //Mem

    images: [],


    //Main init

    init: function() {

        var scope = this;


        //Main connection events

        scope.setConnectionEvents();


        //Main login form

        scope.setDomEvents();

    },


    //Connection events

    setConnectionEvents: function() {

        var scope = this;


        //Connection login

        scope.Connection.on( "login", scope.login.bind( scope ) );


        //Main connection img update

        scope.Connection.response( "update", function( data ) {

            console.log( "Cam update" );

            var camNum = data.num|0;

            console.log( "CAM NUM", camNum );

            scope.images.push( data.base64 );

            scope.UI.update( camNum, data.base64 );

        });


        //Info set

        scope.Connection.on( "get-info", function( data ) {

            console.log( "GET INFO", data );

            scope.UI.setCameraViews( data.data.num );

        });

    },


    //Dom Events main login

    setDomEvents: function() {

        var scope = this;

        scope.UI.loginBtn.onclick = function() {

            var pass = scope.UI.getPassword();

            console.log( pass );

            scope.Connection.login( pass );

        };

    },


    //Login main

    login: function() {

        var scope = this;

        scope.UI.hideLogin();

    }

};
