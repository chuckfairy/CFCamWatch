/**
 * based on mrdoob's named like Node's EventEmitter
 * Used primarily as an inheritance via apply
 *
 */
CF.EventDispatcher = function() {};

CF.EventDispatcher.prototype = {

	constructor: EventDispatcher,

	apply: function ( object ) {

		object.on = CF.EventDispatcher.prototype.on;
		object.hasListener = CF.EventDispatcher.prototype.hasListener;
		object.removeListener = CF.EventDispatcher.prototype.removeListener;
		object.dispatch = CF.EventDispatcher.prototype.dispatch;

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
