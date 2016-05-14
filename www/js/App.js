/**
 * Main app and namespace
 *
 * @requires [ CF.Watch.Connection ]
 *
 */
"use strict";


//Namespace

var CF = CF || {};


//Main Constants

CF.Watch = {

    REVISION: 1

};


//Main

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

        scope.Connection.on( "update", function( data ) {

            console.log( "Cam update" );

            scope.UI.update( data.base64 );

        });

    }

};
