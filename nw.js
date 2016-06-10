/**
 * NW view
 *
 */
"use strict";

var CF = require( __dirname + "/index.js" );

var GUI;

var NWGUI = require( "nw.gui" );

var FS = require( "fs" );

var Path = require( "path" );

var CONFIG_FILE = Path.resolve( __dirname, "config/config.json" );

var CONFIG_FILE_EX = Path.resolve( __dirname, "config/config.ex.json" );


//Check and setup config

if( ! CF.Utils.fileExists( CONFIG_FILE ) ) {

    CF.Utils.copyFile( CONFIG_FILE_EX, CONFIG_FILE );

}


//Get config and launch

CF.Utils.getConfig( CONFIG_FILE, function( config ) {

    GUI = new CF.GUI( config );

    NWGUI.Window.open( "http://localhost:" + GUI.HTTP.opts.port );

});
