/**
 * CamWatch wrapper
 *
 * @requires [ FSWebcam ]
 *
 */
"use strict";

module.exports = {

    FSWebcam: require( __dirname + "/src/FSWebcam.js" ),

    Watcher: require( __dirname + "/src/Watcher.js" ),

    Info: require( __dirname + "/src/Info.js" ),

    Utils: require( __dirname + "/src/utils/Utils.js" ),

    EventDispatcher: require( __dirname + "/src/utils/EventDispatcher.js" ),

    GUI: require( __dirname + "/src/gui/" ),

    GUI_API: require( __dirname + "/src/gui/API.js" )

};
