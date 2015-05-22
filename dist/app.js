(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./adapters/clickable-optgroups');

$(function(){
    
    $.fn.select2.amd.require(["select2/dropdown", "clickableOptgroups"], function (Dropdown, clickableOptgroups) {

        $('#target').select2({
            dropdownAdapter: clickableOptgroups
        }); 
    });
});


},{"./adapters/clickable-optgroups":2}],2:[function(require,module,exports){
$.fn.select2.amd.define('clickableOptgroups', [
    'select2/dropdown',
    'select2/dropdown/attachBody',
    'select2/utils'
], function (Dropdown, AttachBody, Utils) {
    
    function Clickable (decorated, $element, options) {
        this.$dropdownParent = options.get('dropdownParent') || document.body;
        decorated.call(this, $element, options);
    }
    
    $.extend(Clickable.prototype, AttachBody.prototype);
    
    var Class = Utils.Decorate(Dropdown, Clickable);
    
    return Class;
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWFpbi5qcyIsImxpYi9hZGFwdGVycy9jbGlja2FibGUtb3B0Z3JvdXBzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4vYWRhcHRlcnMvY2xpY2thYmxlLW9wdGdyb3VwcycpO1xuXG4kKGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgJC5mbi5zZWxlY3QyLmFtZC5yZXF1aXJlKFtcInNlbGVjdDIvZHJvcGRvd25cIiwgXCJjbGlja2FibGVPcHRncm91cHNcIl0sIGZ1bmN0aW9uIChEcm9wZG93biwgY2xpY2thYmxlT3B0Z3JvdXBzKSB7XG5cbiAgICAgICAgJCgnI3RhcmdldCcpLnNlbGVjdDIoe1xuICAgICAgICAgICAgZHJvcGRvd25BZGFwdGVyOiBjbGlja2FibGVPcHRncm91cHNcbiAgICAgICAgfSk7IFxuICAgIH0pO1xufSk7XG5cbiIsIiQuZm4uc2VsZWN0Mi5hbWQuZGVmaW5lKCdjbGlja2FibGVPcHRncm91cHMnLCBbXG4gICAgJ3NlbGVjdDIvZHJvcGRvd24nLFxuICAgICdzZWxlY3QyL2Ryb3Bkb3duL2F0dGFjaEJvZHknLFxuICAgICdzZWxlY3QyL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKERyb3Bkb3duLCBBdHRhY2hCb2R5LCBVdGlscykge1xuICAgIFxuICAgIGZ1bmN0aW9uIENsaWNrYWJsZSAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLiRkcm9wZG93blBhcmVudCA9IG9wdGlvbnMuZ2V0KCdkcm9wZG93blBhcmVudCcpIHx8IGRvY3VtZW50LmJvZHk7XG4gICAgICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zKTtcbiAgICB9XG4gICAgXG4gICAgJC5leHRlbmQoQ2xpY2thYmxlLnByb3RvdHlwZSwgQXR0YWNoQm9keS5wcm90b3R5cGUpO1xuICAgIFxuICAgIHZhciBDbGFzcyA9IFV0aWxzLkRlY29yYXRlKERyb3Bkb3duLCBDbGlja2FibGUpO1xuICAgIFxuICAgIHJldHVybiBDbGFzcztcbn0pO1xuIl19
