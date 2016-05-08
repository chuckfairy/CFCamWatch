/**
 * GUI setup and actions
 *
 * @requires [ CFCrack, os, http, node-static ]
 *
 * @param Watcher Watcher
 *
 * @param Object options
 *
 */
"use strict";

var Http = require( "http" );

var NodeStatic = require( "node-static" );

var QueryString = require( "querystring" );


//Main class

function GUI( Watcher, options ) {

    var scope = this;

    var options = typeof( options ) === "object" ? options : {};

    scope.Watcher = Watcher ? Watcher : require( "../" );

}

GUI.prototype = {

    constructor: GUI,


};
