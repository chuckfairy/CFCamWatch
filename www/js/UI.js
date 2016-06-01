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

    scope.imgScreens = [];

    scope.loginScreen = document.getElementById( "login-screen" );

    scope.passwordArea = document.getElementById( "password" );

    scope.loginBtn = document.getElementById( "passsword-submit" );

};

CF.Watch.UI.prototype = {

    constructor: CF.Watch.UI,


    //DOM areas

    imgArea: null,

    imgScreens: null,

    loginScreen: null,

    passwordArea: null,

    loginBtn: null,


    //Updater

    update: function( area, base64 ) {

        var scope = this;

        var img = scope.imgScreens[ area ];
        img.src = base64;

    },


    //Set camera views

    setCameraViews: function( num ) {

        var scope = this;

        function createRow() {

            var div = document.createElement( "div" );

            div.className = "row";

            return div;

        }

        function createSegment( colSize ) {

            var div = document.createElement( "div" );

            div.className = "col-xs-" + colSize;

            return div;

        }

        function createArea() {

            var img = document.createElement( "img" );

            img.className = "img-fullscreen";

            return img;

        }

        if( num > 0 ) {

            var lastRow = null;

            for( var i = 0; i < num; i ++ ) {

                var row = lastRow;

                if( ! ( i % 2 ) || ! row ) {

                    row = createRow();

                }

                var seg = createSegment( 6 );

                var area = createArea();

                seg.appendChild( area );
                row.appendChild( seg );

                scope.imgArea.appendChild( row );

                scope.imgScreens.push( area );

                lastRow = row;

            }

        } else {

            var area = createArea();

            scope.imgArea.appendChild( area );

            scope.imgScreens.push( area );

        }

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
