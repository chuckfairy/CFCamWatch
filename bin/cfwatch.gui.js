#!/usr/bin/env node

/**
 * CFCamWatch CLI
 *
 * @requires [ CFCamWatch ]
 *
 */
"use strict";

var CF = require( "../CFWatch.js" );

var GUI;

var FS = require( "fs" );

var Path = require( "path" );

var CONFIG_FILE = Path.resolve( __dirname, "..", "config/config.json" );

var CONFIG_FILE_EX = Path.resolve( __dirname, "..", "config/config.ex.json" );


//Check and setup config

if( ! CF.Utils.fileExists( CONFIG_FILE ) ) {

    CF.Utils.copyFile( CONFIG_FILE_EX, CONFIG_FILE );

}


//Get config and launch

CF.Utils.getConfig( CONFIG_FILE, function( config ) {

    GUI = new CF.GUI( config );

});
