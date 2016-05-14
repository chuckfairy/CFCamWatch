/**
 * UI Handlers
 *
 * @requires [ document ]
 *
 */
CF.Watch.UI = function() {

    var scope = this;

    scope.imgArea = document.getElementById( "img" );

};

CF.Watch.UI.prototype = {

    constructor: CF.Watch.UI,


    imgArea: null,


    //Updater

    update: function( base64 ) {

        var scope = this;

        var img = document.createElement( "img" );
        img.src = base64;

        scope.imgArea.innerHTML = "";

        scope.imgArea.appendChild( img );

    }


};
