(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./adapters/clickable-optgroups');

$(function(){
    
    $.fn.select2.amd.require(["select2/dropdown", "clickableOptgroups"], function (Dropdown, clickableOptgroups) {

        $('#target').select2({
            dropdownAdapter: clickableOptgroups,
            templateResult: function(opt){
                var $span = $('<span>').text(opt.text);
                if (opt.children) {
                    var childVals = _.pluck(opt.children, 'id');
                    $span.click(function(){
                        $('#target').val(childVals).trigger('change');
                    });
                }
                
                return $span;
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWFpbi5qcyIsImxpYi9hZGFwdGVycy9jbGlja2FibGUtb3B0Z3JvdXBzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi9hZGFwdGVycy9jbGlja2FibGUtb3B0Z3JvdXBzJyk7XG5cbiQoZnVuY3Rpb24oKXtcbiAgICBcbiAgICAkLmZuLnNlbGVjdDIuYW1kLnJlcXVpcmUoW1wic2VsZWN0Mi9kcm9wZG93blwiLCBcImNsaWNrYWJsZU9wdGdyb3Vwc1wiXSwgZnVuY3Rpb24gKERyb3Bkb3duLCBjbGlja2FibGVPcHRncm91cHMpIHtcblxuICAgICAgICAkKCcjdGFyZ2V0Jykuc2VsZWN0Mih7XG4gICAgICAgICAgICBkcm9wZG93bkFkYXB0ZXI6IGNsaWNrYWJsZU9wdGdyb3VwcyxcbiAgICAgICAgICAgIHRlbXBsYXRlUmVzdWx0OiBmdW5jdGlvbihvcHQpe1xuICAgICAgICAgICAgICAgIHZhciAkc3BhbiA9ICQoJzxzcGFuPicpLnRleHQob3B0LnRleHQpO1xuICAgICAgICAgICAgICAgIGlmIChvcHQuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkVmFscyA9IF8ucGx1Y2sob3B0LmNoaWxkcmVuLCAnaWQnKTtcbiAgICAgICAgICAgICAgICAgICAgJHNwYW4uY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyN0YXJnZXQnKS52YWwoY2hpbGRWYWxzKS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiAkc3BhbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7IFxuICAgIH0pO1xufSk7XG5cbiIsIiQuZm4uc2VsZWN0Mi5hbWQuZGVmaW5lKCdjbGlja2FibGVPcHRncm91cHMnLCBbXG4gICAgJ3NlbGVjdDIvZHJvcGRvd24nLFxuICAgICdzZWxlY3QyL2Ryb3Bkb3duL2F0dGFjaEJvZHknLFxuICAgICdzZWxlY3QyL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKERyb3Bkb3duLCBBdHRhY2hCb2R5LCBVdGlscykge1xuICAgIFxuICAgIGZ1bmN0aW9uIENsaWNrYWJsZSAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLiRkcm9wZG93blBhcmVudCA9IG9wdGlvbnMuZ2V0KCdkcm9wZG93blBhcmVudCcpIHx8IGRvY3VtZW50LmJvZHk7XG4gICAgICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zKTtcbiAgICB9XG4gICAgXG4gICAgJC5leHRlbmQoQ2xpY2thYmxlLnByb3RvdHlwZSwgQXR0YWNoQm9keS5wcm90b3R5cGUpO1xuICAgIFxuICAgIHZhciBDbGFzcyA9IFV0aWxzLkRlY29yYXRlKERyb3Bkb3duLCBDbGlja2FibGUpO1xuICAgIFxuICAgIHJldHVybiBDbGFzcztcbn0pO1xuIl19
