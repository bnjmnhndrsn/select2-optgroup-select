(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var TestAdapter = require('./adapters/test');

$(function(){

    $('#target').select2({
        selectionAdapter: TestAdapter
    }); 

});
},{"./adapters/test":2}],2:[function(require,module,exports){
var TestAdapter = function () { };

TestAdapter.prototype.update = function (data) { 
    console.log('asdfknasoignagiorarionarbinarb');
}

TestAdapter.prototype.render = function () { };

TestAdapter.prototype.bind = function (container, $container) { };

TestAdapter.prototype.position = function ($rendered, $defaultContainer) { };

TestAdapter.prototype.destroy = function () { };

module.exports = TestAdapter;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWFpbi5qcyIsImxpYi9hZGFwdGVycy90ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgVGVzdEFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL3Rlc3QnKTtcblxuJChmdW5jdGlvbigpe1xuXG4gICAgJCgnI3RhcmdldCcpLnNlbGVjdDIoe1xuICAgICAgICBzZWxlY3Rpb25BZGFwdGVyOiBUZXN0QWRhcHRlclxuICAgIH0pOyBcblxufSk7IiwidmFyIFRlc3RBZGFwdGVyID0gZnVuY3Rpb24gKCkgeyB9O1xuXG5UZXN0QWRhcHRlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGRhdGEpIHsgXG4gICAgY29uc29sZS5sb2coJ2FzZGZrbmFzb2lnbmFnaW9yYXJpb25hcmJpbmFyYicpO1xufVxuXG5UZXN0QWRhcHRlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkgeyB9O1xuXG5UZXN0QWRhcHRlci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChjb250YWluZXIsICRjb250YWluZXIpIHsgfTtcblxuVGVzdEFkYXB0ZXIucHJvdG90eXBlLnBvc2l0aW9uID0gZnVuY3Rpb24gKCRyZW5kZXJlZCwgJGRlZmF1bHRDb250YWluZXIpIHsgfTtcblxuVGVzdEFkYXB0ZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gVGVzdEFkYXB0ZXI7Il19
