/**
 * GUI setup and actions
 *
 * @requires [ CFCrack, os, http, node-static ]
 *
 * @param CFCamWatch Cam
 *
 * @param Object options
 *
 */
"use strict";

var Http = require( "http" );

var NodeStatic = require( "node-static" );

var QueryString = require( "querystring" );


//Main class

function GUI( Cam, options ) {

    var scope = this;

    var options = typeof( options ) === "object" ? options : {};

    scope.cam = ( Cracker ) ? Cracker : require( "../" );

}
