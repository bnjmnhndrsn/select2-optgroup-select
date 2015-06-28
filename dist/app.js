(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./adapters/optgroup-selection');
require('./adapters/optgroup-data');
require('./decorators/optgroup-results');

$(function(){
    
    $.fn.select2.amd.require(["select2/dropdown", "optgroupData", "optgroupSelection", "optgroupResults"], 
        function (Dropdown, OptgroupData, OptgroupSelection, OptgroupResults) {

        $('#target').select2({
            dataAdapter: OptgroupData,
            resultsAdapter: OptgroupResults,
            selectionAdapter: OptgroupSelection,
        }); 
    });
});


/*

var $span = $('<span>').text(opt.text);
if (opt.children) {
    var childVals = _.pluck(opt.children, 'id');
    $span.click(function(){
        $('#target').val(childVals).trigger('change');
    });
}

return $span;
*/

},{"./adapters/optgroup-data":2,"./adapters/optgroup-selection":3,"./decorators/optgroup-results":4}],2:[function(require,module,exports){
$.fn.select2.amd.define('optgroupData', [
    'select2/data/select',
    'select2/utils'
], function (SelectAdapter, Utils) {
    
    function OptgroupData ($element, options) {
        OptgroupData.__super__.constructor.apply(this, arguments);
    }
    
    Utils.Extend(OptgroupData, SelectAdapter);
    
    OptgroupData.prototype.current = function (callback) {
        var data = [];
        var self = this;

        this.$element.find(':selected, .selected-custom').each(function () {
            var $option = $(this);
            var option = self.item($option);

            data.push(option);
        });
        console.log('data called');
        callback(data);
    };
    
    OptgroupData.prototype.select = function (data) {
        var self = this;

        data.selected = true;

        // If data.element is a DOM node, use it instead
        if ($(data.element).is('option')) {
            data.element.selected = true;

            this.$element.trigger('change');

            return;
        }
        
        $(data.element).addClass('selected-custom');

        this.current(function (currentData) {
            var val = [];

            data = data.children.concat(currentData);

            for (var d = 0; d < data.length; d++) {
                var id = data[d].id;

                if ($.inArray(id, val) === -1) {
                    val.push(id);
                }
            }

            self.$element.val(val);
            self.$element.trigger('change');
        });

    };

    OptgroupData.prototype.unselect = function (data) {
        var self = this;

        data.selected = false;

        if ($(data.element).is('option')) {
            data.element.selected = false;

            this.$element.trigger('change');

            return;
        }
        
        $(data.element).removeClass('selected-custom');
        
        this.current(function (currentData) {
            var val = [];
            
            for (var i = 0; i < currentData.length; i++) {
                var id = currentData[i].id;
                
                for (var j = 0; j < data.children.length; j++) {
                    if (data.children[j].id !== id && $.inArray(id, val) === -1) {
                        val.push(id);
                    }
                }

            }

            self.$element.val(val);

            self.$element.trigger('change');
        });
    };
    
    return OptgroupData;
});
},{}],3:[function(require,module,exports){
$.fn.select2.amd.define('optgroupSelection', [
    'select2/selection/multiple',
    'select2/utils'
], function (MultipleSelection, Utils) {
    
    function Clickable ($element, options) {
        Clickable.__super__.constructor.apply(this, arguments);
    }
    
    Utils.Extend(Clickable, MultipleSelection);
    
    // Clickable.prototype.getData = function(){
    //     var self = this
    //     var $optgroups = this.$element.find('optgroup');
    //
    //     this.optionOptgroupHash = {};
    //     this.optgroupCounts = {};
    //
    //
    //     $optgroups.each(function () {
    //       var $optgroup = $(this);
    //       var optgroupName = $optgroup.attr('label');
    //       var $options = $optgroup.find('option');
    //       self.optgroupCounts[optgroupName] = $options.length;
    //
    //       $options.each(function(){
    //           self.optionOptgroupHash[$(this).val()] = optgroupName;
    //       });
    //
    //     });
    // };
    
    // Clickable.prototype.getGroups = function(data) {
    //     var grouped = [];
    //
    //     var groups = _.mapObject(this.optgroupCounts, function(){ return [] });
    //
    //     for (var d = 0; d < data.length; d++) {
    //         var selection = data[d];
    //         var group = this.optionOptgroupHash[selection.id];
    //         groups[group].push(selection);
    //     }
    //
    //     _.each(this.optgroupCounts, function(val, key){
    //         if (val == groups[key].length) {
    //             grouped.push({
    //                 text: key
    //             });
    //         } else {
    //             grouped = grouped.concat(groups[key]);
    //         }
    //     });
    //
    //     return grouped;
    // }
    
    
    // Clickable.prototype.update = function (data) {
    //
    //     this.clear();
    //
    //     if (data.length === 0) {
    //         return;
    //     }
    //
    //     var grouped = this.getGroups(data);
    //     var $selections = [];
    //
    //     for (var d = 0; d < grouped.length; d++) {
    //         var selection = grouped[d];
    //
    //         var formatted = this.display(selection);
    //         var $selection = this.selectionContainer();
    //
    //         $selection.append(formatted);
    //         $selection.prop('title', selection.title || selection.text);
    //
    //         $selection.data('data', selection);
    //
    //         $selections.push($selection);
    //     }
    //
    //
    //     var $rendered = this.$selection.find('.select2-selection__rendered');
    //
    //     Utils.appendMany($rendered, $selections);
    // };

        
    return Clickable;
});

},{}],4:[function(require,module,exports){
$.fn.select2.amd.define('optgroupResults', [
    'select2/results',
    'select2/utils'
], function (ResultsAdapter, Utils) {
    
    function OptgroupResults () {};
    
    OptgroupResults.prototype.option = function (decorated, data) {
        var option = decorated.call(this, data);
        option.setAttribute('aria-selected', false);
        return option;
    };
    
    OptgroupResults.prototype.bind = function(decorated, container, $container) {
        var self = this;
        decorated.call(this, container, $container);
        
        this.$results.off('mouseup');
        this.$results.on('mouseup', '.select2-results__option[aria-selected]', function (evt) {
            var $this = $(this);

            var data = $this.data('data');
            
            var trigger = ($this.attr('aria-selected') === 'true')  ? 'unselect' : 'select';
  
            self.trigger(trigger, {
                originalEvent: evt,
                data: data
            });
                
            return false;
        });
    };
    
    var Decorated = Utils.Decorate(ResultsAdapter, OptgroupResults);
    
    return Decorated;
});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWFpbi5qcyIsImxpYi9hZGFwdGVycy9vcHRncm91cC1kYXRhLmpzIiwibGliL2FkYXB0ZXJzL29wdGdyb3VwLXNlbGVjdGlvbi5qcyIsImxpYi9kZWNvcmF0b3JzL29wdGdyb3VwLXJlc3VsdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi9hZGFwdGVycy9vcHRncm91cC1zZWxlY3Rpb24nKTtcbnJlcXVpcmUoJy4vYWRhcHRlcnMvb3B0Z3JvdXAtZGF0YScpO1xucmVxdWlyZSgnLi9kZWNvcmF0b3JzL29wdGdyb3VwLXJlc3VsdHMnKTtcblxuJChmdW5jdGlvbigpe1xuICAgIFxuICAgICQuZm4uc2VsZWN0Mi5hbWQucmVxdWlyZShbXCJzZWxlY3QyL2Ryb3Bkb3duXCIsIFwib3B0Z3JvdXBEYXRhXCIsIFwib3B0Z3JvdXBTZWxlY3Rpb25cIiwgXCJvcHRncm91cFJlc3VsdHNcIl0sIFxuICAgICAgICBmdW5jdGlvbiAoRHJvcGRvd24sIE9wdGdyb3VwRGF0YSwgT3B0Z3JvdXBTZWxlY3Rpb24sIE9wdGdyb3VwUmVzdWx0cykge1xuXG4gICAgICAgICQoJyN0YXJnZXQnKS5zZWxlY3QyKHtcbiAgICAgICAgICAgIGRhdGFBZGFwdGVyOiBPcHRncm91cERhdGEsXG4gICAgICAgICAgICByZXN1bHRzQWRhcHRlcjogT3B0Z3JvdXBSZXN1bHRzLFxuICAgICAgICAgICAgc2VsZWN0aW9uQWRhcHRlcjogT3B0Z3JvdXBTZWxlY3Rpb24sXG4gICAgICAgIH0pOyBcbiAgICB9KTtcbn0pO1xuXG5cbi8qXG5cbnZhciAkc3BhbiA9ICQoJzxzcGFuPicpLnRleHQob3B0LnRleHQpO1xuaWYgKG9wdC5jaGlsZHJlbikge1xuICAgIHZhciBjaGlsZFZhbHMgPSBfLnBsdWNrKG9wdC5jaGlsZHJlbiwgJ2lkJyk7XG4gICAgJHNwYW4uY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnI3RhcmdldCcpLnZhbChjaGlsZFZhbHMpLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH0pO1xufVxuXG5yZXR1cm4gJHNwYW47XG4qL1xuIiwiJC5mbi5zZWxlY3QyLmFtZC5kZWZpbmUoJ29wdGdyb3VwRGF0YScsIFtcbiAgICAnc2VsZWN0Mi9kYXRhL3NlbGVjdCcsXG4gICAgJ3NlbGVjdDIvdXRpbHMnXG5dLCBmdW5jdGlvbiAoU2VsZWN0QWRhcHRlciwgVXRpbHMpIHtcbiAgICBcbiAgICBmdW5jdGlvbiBPcHRncm91cERhdGEgKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgIE9wdGdyb3VwRGF0YS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgXG4gICAgVXRpbHMuRXh0ZW5kKE9wdGdyb3VwRGF0YSwgU2VsZWN0QWRhcHRlcik7XG4gICAgXG4gICAgT3B0Z3JvdXBEYXRhLnByb3RvdHlwZS5jdXJyZW50ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBkYXRhID0gW107XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICB0aGlzLiRlbGVtZW50LmZpbmQoJzpzZWxlY3RlZCwgLnNlbGVjdGVkLWN1c3RvbScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRvcHRpb24gPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIG9wdGlvbiA9IHNlbGYuaXRlbSgkb3B0aW9uKTtcblxuICAgICAgICAgICAgZGF0YS5wdXNoKG9wdGlvbik7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZygnZGF0YSBjYWxsZWQnKTtcbiAgICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBkYXRhLnNlbGVjdGVkID0gdHJ1ZTtcblxuICAgICAgICAvLyBJZiBkYXRhLmVsZW1lbnQgaXMgYSBET00gbm9kZSwgdXNlIGl0IGluc3RlYWRcbiAgICAgICAgaWYgKCQoZGF0YS5lbGVtZW50KS5pcygnb3B0aW9uJykpIHtcbiAgICAgICAgICAgIGRhdGEuZWxlbWVudC5zZWxlY3RlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgJChkYXRhLmVsZW1lbnQpLmFkZENsYXNzKCdzZWxlY3RlZC1jdXN0b20nKTtcblxuICAgICAgICB0aGlzLmN1cnJlbnQoZnVuY3Rpb24gKGN1cnJlbnREYXRhKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gW107XG5cbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLmNoaWxkcmVuLmNvbmNhdChjdXJyZW50RGF0YSk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGF0YS5sZW5ndGg7IGQrKykge1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IGRhdGFbZF0uaWQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KGlkLCB2YWwpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB2YWwucHVzaChpZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLiRlbGVtZW50LnZhbCh2YWwpO1xuICAgICAgICAgICAgc2VsZi4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgT3B0Z3JvdXBEYXRhLnByb3RvdHlwZS51bnNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBkYXRhLnNlbGVjdGVkID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKCQoZGF0YS5lbGVtZW50KS5pcygnb3B0aW9uJykpIHtcbiAgICAgICAgICAgIGRhdGEuZWxlbWVudC5zZWxlY3RlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICQoZGF0YS5lbGVtZW50KS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQtY3VzdG9tJyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmN1cnJlbnQoZnVuY3Rpb24gKGN1cnJlbnREYXRhKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gW107XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBjdXJyZW50RGF0YVtpXS5pZDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRhdGEuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuY2hpbGRyZW5bal0uaWQgIT09IGlkICYmICQuaW5BcnJheShpZCwgdmFsKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbC5wdXNoKGlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLiRlbGVtZW50LnZhbCh2YWwpO1xuXG4gICAgICAgICAgICBzZWxmLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBPcHRncm91cERhdGE7XG59KTsiLCIkLmZuLnNlbGVjdDIuYW1kLmRlZmluZSgnb3B0Z3JvdXBTZWxlY3Rpb24nLCBbXG4gICAgJ3NlbGVjdDIvc2VsZWN0aW9uL211bHRpcGxlJyxcbiAgICAnc2VsZWN0Mi91dGlscydcbl0sIGZ1bmN0aW9uIChNdWx0aXBsZVNlbGVjdGlvbiwgVXRpbHMpIHtcbiAgICBcbiAgICBmdW5jdGlvbiBDbGlja2FibGUgKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgIENsaWNrYWJsZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgXG4gICAgVXRpbHMuRXh0ZW5kKENsaWNrYWJsZSwgTXVsdGlwbGVTZWxlY3Rpb24pO1xuICAgIFxuICAgIC8vIENsaWNrYWJsZS5wcm90b3R5cGUuZ2V0RGF0YSA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgIHZhciBzZWxmID0gdGhpc1xuICAgIC8vICAgICB2YXIgJG9wdGdyb3VwcyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnb3B0Z3JvdXAnKTtcbiAgICAvL1xuICAgIC8vICAgICB0aGlzLm9wdGlvbk9wdGdyb3VwSGFzaCA9IHt9O1xuICAgIC8vICAgICB0aGlzLm9wdGdyb3VwQ291bnRzID0ge307XG4gICAgLy9cbiAgICAvL1xuICAgIC8vICAgICAkb3B0Z3JvdXBzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICAgIHZhciAkb3B0Z3JvdXAgPSAkKHRoaXMpO1xuICAgIC8vICAgICAgIHZhciBvcHRncm91cE5hbWUgPSAkb3B0Z3JvdXAuYXR0cignbGFiZWwnKTtcbiAgICAvLyAgICAgICB2YXIgJG9wdGlvbnMgPSAkb3B0Z3JvdXAuZmluZCgnb3B0aW9uJyk7XG4gICAgLy8gICAgICAgc2VsZi5vcHRncm91cENvdW50c1tvcHRncm91cE5hbWVdID0gJG9wdGlvbnMubGVuZ3RoO1xuICAgIC8vXG4gICAgLy8gICAgICAgJG9wdGlvbnMuZWFjaChmdW5jdGlvbigpe1xuICAgIC8vICAgICAgICAgICBzZWxmLm9wdGlvbk9wdGdyb3VwSGFzaFskKHRoaXMpLnZhbCgpXSA9IG9wdGdyb3VwTmFtZTtcbiAgICAvLyAgICAgICB9KTtcbiAgICAvL1xuICAgIC8vICAgICB9KTtcbiAgICAvLyB9O1xuICAgIFxuICAgIC8vIENsaWNrYWJsZS5wcm90b3R5cGUuZ2V0R3JvdXBzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIC8vICAgICB2YXIgZ3JvdXBlZCA9IFtdO1xuICAgIC8vXG4gICAgLy8gICAgIHZhciBncm91cHMgPSBfLm1hcE9iamVjdCh0aGlzLm9wdGdyb3VwQ291bnRzLCBmdW5jdGlvbigpeyByZXR1cm4gW10gfSk7XG4gICAgLy9cbiAgICAvLyAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkYXRhLmxlbmd0aDsgZCsrKSB7XG4gICAgLy8gICAgICAgICB2YXIgc2VsZWN0aW9uID0gZGF0YVtkXTtcbiAgICAvLyAgICAgICAgIHZhciBncm91cCA9IHRoaXMub3B0aW9uT3B0Z3JvdXBIYXNoW3NlbGVjdGlvbi5pZF07XG4gICAgLy8gICAgICAgICBncm91cHNbZ3JvdXBdLnB1c2goc2VsZWN0aW9uKTtcbiAgICAvLyAgICAgfVxuICAgIC8vXG4gICAgLy8gICAgIF8uZWFjaCh0aGlzLm9wdGdyb3VwQ291bnRzLCBmdW5jdGlvbih2YWwsIGtleSl7XG4gICAgLy8gICAgICAgICBpZiAodmFsID09IGdyb3Vwc1trZXldLmxlbmd0aCkge1xuICAgIC8vICAgICAgICAgICAgIGdyb3VwZWQucHVzaCh7XG4gICAgLy8gICAgICAgICAgICAgICAgIHRleHQ6IGtleVxuICAgIC8vICAgICAgICAgICAgIH0pO1xuICAgIC8vICAgICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICBncm91cGVkID0gZ3JvdXBlZC5jb25jYXQoZ3JvdXBzW2tleV0pO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9KTtcbiAgICAvL1xuICAgIC8vICAgICByZXR1cm4gZ3JvdXBlZDtcbiAgICAvLyB9XG4gICAgXG4gICAgXG4gICAgLy8gQ2xpY2thYmxlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIC8vXG4gICAgLy8gICAgIHRoaXMuY2xlYXIoKTtcbiAgICAvL1xuICAgIC8vICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAvLyAgICAgICAgIHJldHVybjtcbiAgICAvLyAgICAgfVxuICAgIC8vXG4gICAgLy8gICAgIHZhciBncm91cGVkID0gdGhpcy5nZXRHcm91cHMoZGF0YSk7XG4gICAgLy8gICAgIHZhciAkc2VsZWN0aW9ucyA9IFtdO1xuICAgIC8vXG4gICAgLy8gICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZ3JvdXBlZC5sZW5ndGg7IGQrKykge1xuICAgIC8vICAgICAgICAgdmFyIHNlbGVjdGlvbiA9IGdyb3VwZWRbZF07XG4gICAgLy9cbiAgICAvLyAgICAgICAgIHZhciBmb3JtYXR0ZWQgPSB0aGlzLmRpc3BsYXkoc2VsZWN0aW9uKTtcbiAgICAvLyAgICAgICAgIHZhciAkc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb25Db250YWluZXIoKTtcbiAgICAvL1xuICAgIC8vICAgICAgICAgJHNlbGVjdGlvbi5hcHBlbmQoZm9ybWF0dGVkKTtcbiAgICAvLyAgICAgICAgICRzZWxlY3Rpb24ucHJvcCgndGl0bGUnLCBzZWxlY3Rpb24udGl0bGUgfHwgc2VsZWN0aW9uLnRleHQpO1xuICAgIC8vXG4gICAgLy8gICAgICAgICAkc2VsZWN0aW9uLmRhdGEoJ2RhdGEnLCBzZWxlY3Rpb24pO1xuICAgIC8vXG4gICAgLy8gICAgICAgICAkc2VsZWN0aW9ucy5wdXNoKCRzZWxlY3Rpb24pO1xuICAgIC8vICAgICB9XG4gICAgLy9cbiAgICAvL1xuICAgIC8vICAgICB2YXIgJHJlbmRlcmVkID0gdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKTtcbiAgICAvL1xuICAgIC8vICAgICBVdGlscy5hcHBlbmRNYW55KCRyZW5kZXJlZCwgJHNlbGVjdGlvbnMpO1xuICAgIC8vIH07XG5cbiAgICAgICAgXG4gICAgcmV0dXJuIENsaWNrYWJsZTtcbn0pO1xuIiwiJC5mbi5zZWxlY3QyLmFtZC5kZWZpbmUoJ29wdGdyb3VwUmVzdWx0cycsIFtcbiAgICAnc2VsZWN0Mi9yZXN1bHRzJyxcbiAgICAnc2VsZWN0Mi91dGlscydcbl0sIGZ1bmN0aW9uIChSZXN1bHRzQWRhcHRlciwgVXRpbHMpIHtcbiAgICBcbiAgICBmdW5jdGlvbiBPcHRncm91cFJlc3VsdHMgKCkge307XG4gICAgXG4gICAgT3B0Z3JvdXBSZXN1bHRzLnByb3RvdHlwZS5vcHRpb24gPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBkYXRhKSB7XG4gICAgICAgIHZhciBvcHRpb24gPSBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBkYXRhKTtcbiAgICAgICAgb3B0aW9uLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbjtcbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwUmVzdWx0cy5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJHJlc3VsdHMub2ZmKCdtb3VzZXVwJyk7XG4gICAgICAgIHRoaXMuJHJlc3VsdHMub24oJ21vdXNldXAnLCAnLnNlbGVjdDItcmVzdWx0c19fb3B0aW9uW2FyaWEtc2VsZWN0ZWRdJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgdmFyIGRhdGEgPSAkdGhpcy5kYXRhKCdkYXRhJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciB0cmlnZ2VyID0gKCR0aGlzLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnKSA9PT0gJ3RydWUnKSAgPyAndW5zZWxlY3QnIDogJ3NlbGVjdCc7XG4gIFxuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKHRyaWdnZXIsIHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnQsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgXG4gICAgdmFyIERlY29yYXRlZCA9IFV0aWxzLkRlY29yYXRlKFJlc3VsdHNBZGFwdGVyLCBPcHRncm91cFJlc3VsdHMpO1xuICAgIFxuICAgIHJldHVybiBEZWNvcmF0ZWQ7XG59KTsiXX0=
