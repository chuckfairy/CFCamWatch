#!/usr/bin/env node

//Load server
var COMPILER = require("cfcompile");
var FS = COMPILER.getFS();
var Path = require( "path" );

//cfcompile js build

var url = Path.resolve( __dirname + "/../www/compile.json" );

COMPILER.compileFromConfigFile( url, function(data, err) {

    //Log errors
    if(err) {console.log(err);}

    //Write the build file
    console.log("\nWriting new file in /build/pinball.min.js");

    var writeUrl = Path.resolve( __dirname + "/../www/build/cfwatch.min.js" );

    FS.writeFile( writeUrl, data, function(err) {

        if(err) {console.log(err);}

    });

});
