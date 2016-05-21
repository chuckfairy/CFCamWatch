#!/usr/bin/env node

/**
 * CFCamWatch CLI
 *
 * @requires [ CFCamWatch ]
 *
 */
"use strict";

var CF = require( "../CFCamWatch.js" );

var GUI;

var FS = require( "fs" );

var CONFIG_FILE = __dirname + "/../config/config.json";

var CONFIG_FILE_EX = __dirname + "/../config/config.ex.json";


//Check and setup config

if( ! CF.Utils.fileExists( CONFIG_FILE ) ) {

    CF.Utils.copyFile( CONFIG_FILE_EX, CONFIG_FILE );

}


//Get config and launch

CF.Utils.getConfig( CONFIG_FILE, function( config ) {

    GUI = new CF.GUI( config );

});
