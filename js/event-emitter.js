define([], function() {
    "use strict";
    
    function EventEmitter() {
        this._eventTypes = {};
    }
    
    var _eep = EventEmitter.prototype;
    
    _eep.emitEvent = function(eventTypeName, eventPayload) {
        var eventType = this._eventTypes[eventTypeName];
        if (eventType) {
            for (var handlerIndex in eventType) {
                var handler = eventType[handlerIndex];
                handler(eventPayload);
            }
        }
    };
    
    _eep.subscribe = function(eventTypeName, eventHandler) {
        var eventType = this._eventTypes[eventTypeName];
        if (!eventType) {
            eventType = [];
            this._eventTypes[eventTypeName] = eventType; 
        }
        eventType.push(eventHandler);
    };
    
    return EventEmitter;
});

