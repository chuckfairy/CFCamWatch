/**
 * UI Handlers
 *
 * @requires [ document ]
 *
 */
CF.Watch.UI = function() {

    var scope = this;


    //Grab areas

    scope.imgArea = document.getElementById( "img" );

    scope.loginScreen = document.getElementById( "login-screen" );

    scope.passwordArea = document.getElementById( "password" );

    scope.loginBtn = document.getElementById( "passsword-submit" );

};

CF.Watch.UI.prototype = {

    constructor: CF.Watch.UI,


    //DOM areas

    imgArea: null,

    loginScreen: null,

    passwordArea: null,

    loginBtn: null,


    //Updater

    update: function( base64 ) {

        var scope = this;

        var img = document.createElement( "img" );
        img.src = base64;

        scope.imgArea.innerHTML = "";

        scope.imgArea.appendChild( img );

    },


    //Hide login

    hideLogin: function() {

        this.loginScreen.style.display = "none";

    },


    //Get current password

    getPassword: function() {

        return this.passwordArea.value;

    }

};
