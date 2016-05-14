/**
 * Constants info
 *
 *
 */

var Info = {};

Info.Username = process.env.USER;

Info.OS = require( "os" );

Info.Hostname = Info.OS.hostname();

Info.OSPlatform = Info.OS.platform();

Info.OSArch = Info.OS.arch();

Info.OSFreeMemory = Info.OS.freemem();

Info.Versions = process.versions;


//Meta

Info.AsciiArt = [
    "",
    " ______     ______   ______     ______     ______     ______     __  __",
    "/\\  ___\\   /\\  ___\\ /\\  ___\\   /\\  == \\   /\\  __ \\   /\\  ___\\   /\\ \\/ /",
    "\\ \\ \\____  \\ \\  __\\ \\ \\ \\____  \\ \\  __<   \\ \\  __ \\  \\ \\ \\____  \\ \\  _\"-.",
    " \\ \\_____\\  \\ \\_\\    \\ \\_____\\  \\ \\_\\ \\_\\  \\ \\_\\ \\_\\  \\ \\_____\\  \\ \\_\\ \\_\\",
    "  \\/_____/   \\/_/     \\/_____/   \\/_/ /_/   \\/_/\\/_/   \\/_____/   \\/_/\\/_/",
    ""
].join( "\n" );


//Export

module.exports = Info;
