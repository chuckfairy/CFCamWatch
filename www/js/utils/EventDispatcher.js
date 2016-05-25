/**
 * based on mrdoob's named like Node's EventEmitter
 * Used primarily as an inheritance via apply
 *
 */
CF.Watch.Dispatcher = function() {};

CF.Watch.Dispatcher.prototype = {

	constructor: CF.Watch.Dispatcher,

	apply: function ( object ) {

		object.on = CF.Watch.Dispatcher.prototype.on;
		object.hasListener = CF.Watch.Dispatcher.prototype.hasListener;
		object.removeListener = CF.Watch.Dispatcher.prototype.removeListener;
		object.dispatch = CF.Watch.Dispatcher.prototype.dispatch;

        return object;

	},

	on: function ( type, listener ) {

		if ( this._listeners === undefined ) { this._listeners = {}; }

		var listeners = this._listeners;

		if ( listeners[ type ] === undefined ) {

			listeners[ type ] = [];

		}

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {

			listeners[ type ].push( listener );

		}

	},

	hasListener: function ( type, listener ) {

		if ( this._listeners === undefined ) { return false; }

		var listeners = this._listeners;

		if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {

			return true;

		}

		return false;

	},

	removeListener: function ( type, listener ) {

		if ( this._listeners === undefined ) { return; }

		var listeners = this._listeners;
		var listenerArray = listeners[ type ];

		if ( listenerArray !== undefined ) {

			var index = listenerArray.indexOf( listener );

			if ( index !== - 1 ) {

				listenerArray.splice( index, 1 );

			}

		}

	},

	dispatch: function ( event ) {

		if ( this._listeners === undefined ) { return; }

		var listeners = this._listeners;
		var listenerArray = listeners[ event.type ];

		if ( listenerArray !== undefined ) {

			event.target = this;

			var array = [];
			var length = listenerArray.length;

			for ( var i = 0; i < length; i++ ) {

				array[ i ] = listenerArray[ i ];

			}

			for ( var i = 0; i < length; i++ ) {

				array[ i ].call( this, event );

			}

		}

	}

};
