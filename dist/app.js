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
            
            if (!option.hasOwnProperty('id')) {
                option.id = false;
            }
            
            data.push(option);
        });

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
            var childIds = $.map(data.children, function(child){
                return child.id;
            });
            
            for (var i = 0; i < currentData.length; i++) {
                var id = currentData[i].id;

                if ($.inArray(id, childIds) === -1  && $.inArray(id, val) === -1) {
                    val.push(id);
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
    
    Clickable.prototype.processData = function(data){
        var result = [];
        var queue = [];
        var currentOptgroup = null;
        
        var resetQueue = function(){
            if (currentOptgroup && currentOptgroup.children.length === queue.length) {
                result.push(currentOptgroup);
            } else {
                result.push.apply(result, queue);
            }
            queue = [];
        }
        
        while (data.length) {
            var item = data.shift();
            
            if (item.children) {
                resetQueue();
                currentOptgroup = item;
            } else {
                if (currentOptgroup && _.contains(currentOptgroup.children, item)) {
                    queue.push(item);
                } else {
                    resetQueue();
                    currentOptgroup = null;
                    result.push(item);
                }
            }
        }
        
        resetQueue();
        
        return result;
    };

    Clickable.prototype.update = function(data){

        this.clear();

        if (data.length === 0) {
            return;
        }
        
        data = this.processData(data);
        
        var $selections = [];

        for (var d = 0; d < data.length; d++) {
            var selection = data[d];

            var formatted = this.display(selection);
            var $selection = this.selectionContainer();

            $selection.append(formatted);
            $selection.prop('title', selection.title || selection.text);

            $selection.data('data', selection);

            $selections.push($selection);
        }


        var $rendered = this.$selection.find('.select2-selection__rendered');

        Utils.appendMany($rendered, $selections);
    };

        
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWFpbi5qcyIsImxpYi9hZGFwdGVycy9vcHRncm91cC1kYXRhLmpzIiwibGliL2FkYXB0ZXJzL29wdGdyb3VwLXNlbGVjdGlvbi5qcyIsImxpYi9kZWNvcmF0b3JzL29wdGdyb3VwLXJlc3VsdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi9hZGFwdGVycy9vcHRncm91cC1zZWxlY3Rpb24nKTtcbnJlcXVpcmUoJy4vYWRhcHRlcnMvb3B0Z3JvdXAtZGF0YScpO1xucmVxdWlyZSgnLi9kZWNvcmF0b3JzL29wdGdyb3VwLXJlc3VsdHMnKTtcblxuJChmdW5jdGlvbigpe1xuICAgIFxuICAgICQuZm4uc2VsZWN0Mi5hbWQucmVxdWlyZShbXCJzZWxlY3QyL2Ryb3Bkb3duXCIsIFwib3B0Z3JvdXBEYXRhXCIsIFwib3B0Z3JvdXBTZWxlY3Rpb25cIiwgXCJvcHRncm91cFJlc3VsdHNcIl0sIFxuICAgICAgICBmdW5jdGlvbiAoRHJvcGRvd24sIE9wdGdyb3VwRGF0YSwgT3B0Z3JvdXBTZWxlY3Rpb24sIE9wdGdyb3VwUmVzdWx0cykge1xuXG4gICAgICAgICQoJyN0YXJnZXQnKS5zZWxlY3QyKHtcbiAgICAgICAgICAgIGRhdGFBZGFwdGVyOiBPcHRncm91cERhdGEsXG4gICAgICAgICAgICByZXN1bHRzQWRhcHRlcjogT3B0Z3JvdXBSZXN1bHRzLFxuICAgICAgICAgICAgc2VsZWN0aW9uQWRhcHRlcjogT3B0Z3JvdXBTZWxlY3Rpb24sXG4gICAgICAgIH0pOyBcbiAgICB9KTtcbn0pO1xuXG5cbi8qXG5cbnZhciAkc3BhbiA9ICQoJzxzcGFuPicpLnRleHQob3B0LnRleHQpO1xuaWYgKG9wdC5jaGlsZHJlbikge1xuICAgIHZhciBjaGlsZFZhbHMgPSBfLnBsdWNrKG9wdC5jaGlsZHJlbiwgJ2lkJyk7XG4gICAgJHNwYW4uY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnI3RhcmdldCcpLnZhbChjaGlsZFZhbHMpLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH0pO1xufVxuXG5yZXR1cm4gJHNwYW47XG4qL1xuIiwiJC5mbi5zZWxlY3QyLmFtZC5kZWZpbmUoJ29wdGdyb3VwRGF0YScsIFtcbiAgICAnc2VsZWN0Mi9kYXRhL3NlbGVjdCcsXG4gICAgJ3NlbGVjdDIvdXRpbHMnXG5dLCBmdW5jdGlvbiAoU2VsZWN0QWRhcHRlciwgVXRpbHMpIHtcbiAgICBcbiAgICBmdW5jdGlvbiBPcHRncm91cERhdGEgKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgIE9wdGdyb3VwRGF0YS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgXG4gICAgVXRpbHMuRXh0ZW5kKE9wdGdyb3VwRGF0YSwgU2VsZWN0QWRhcHRlcik7XG4gICAgXG4gICAgT3B0Z3JvdXBEYXRhLnByb3RvdHlwZS5jdXJyZW50ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBkYXRhID0gW107XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICB0aGlzLiRlbGVtZW50LmZpbmQoJzpzZWxlY3RlZCwgLnNlbGVjdGVkLWN1c3RvbScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRvcHRpb24gPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIG9wdGlvbiA9IHNlbGYuaXRlbSgkb3B0aW9uKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFvcHRpb24uaGFzT3duUHJvcGVydHkoJ2lkJykpIHtcbiAgICAgICAgICAgICAgICBvcHRpb24uaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZGF0YS5wdXNoKG9wdGlvbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNhbGxiYWNrKGRhdGEpO1xuICAgIH07XG4gICAgXG4gICAgT3B0Z3JvdXBEYXRhLnByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgZGF0YS5zZWxlY3RlZCA9IHRydWU7XG5cbiAgICAgICAgLy8gSWYgZGF0YS5lbGVtZW50IGlzIGEgRE9NIG5vZGUsIHVzZSBpdCBpbnN0ZWFkXG4gICAgICAgIGlmICgkKGRhdGEuZWxlbWVudCkuaXMoJ29wdGlvbicpKSB7XG4gICAgICAgICAgICBkYXRhLmVsZW1lbnQuc2VsZWN0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICQoZGF0YS5lbGVtZW50KS5hZGRDbGFzcygnc2VsZWN0ZWQtY3VzdG9tJyk7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50KGZ1bmN0aW9uIChjdXJyZW50RGF0YSkge1xuICAgICAgICAgICAgdmFyIHZhbCA9IFtdO1xuXG4gICAgICAgICAgICBkYXRhID0gZGF0YS5jaGlsZHJlbi5jb25jYXQoY3VycmVudERhdGEpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBkYXRhW2RdLmlkO1xuXG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShpZCwgdmFsKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsLnB1c2goaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi4kZWxlbWVudC52YWwodmFsKTtcbiAgICAgICAgICAgIHNlbGYuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIE9wdGdyb3VwRGF0YS5wcm90b3R5cGUudW5zZWxlY3QgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgZGF0YS5zZWxlY3RlZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmICgkKGRhdGEuZWxlbWVudCkuaXMoJ29wdGlvbicpKSB7XG4gICAgICAgICAgICBkYXRhLmVsZW1lbnQuc2VsZWN0ZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAkKGRhdGEuZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkLWN1c3RvbScpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jdXJyZW50KGZ1bmN0aW9uIChjdXJyZW50RGF0YSkge1xuICAgICAgICAgICAgdmFyIHZhbCA9IFtdO1xuICAgICAgICAgICAgdmFyIGNoaWxkSWRzID0gJC5tYXAoZGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpe1xuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5pZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnREYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gY3VycmVudERhdGFbaV0uaWQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KGlkLCBjaGlsZElkcykgPT09IC0xICAmJiAkLmluQXJyYXkoaWQsIHZhbCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbC5wdXNoKGlkKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBzZWxmLiRlbGVtZW50LnZhbCh2YWwpO1xuXG4gICAgICAgICAgICBzZWxmLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBPcHRncm91cERhdGE7XG59KTsiLCIkLmZuLnNlbGVjdDIuYW1kLmRlZmluZSgnb3B0Z3JvdXBTZWxlY3Rpb24nLCBbXG4gICAgJ3NlbGVjdDIvc2VsZWN0aW9uL211bHRpcGxlJyxcbiAgICAnc2VsZWN0Mi91dGlscydcbl0sIGZ1bmN0aW9uIChNdWx0aXBsZVNlbGVjdGlvbiwgVXRpbHMpIHtcbiAgICBcbiAgICBmdW5jdGlvbiBDbGlja2FibGUgKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgIENsaWNrYWJsZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgXG4gICAgVXRpbHMuRXh0ZW5kKENsaWNrYWJsZSwgTXVsdGlwbGVTZWxlY3Rpb24pO1xuICAgIFxuICAgIC8vIENsaWNrYWJsZS5wcm90b3R5cGUuZ2V0RGF0YSA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgIHZhciBzZWxmID0gdGhpc1xuICAgIC8vICAgICB2YXIgJG9wdGdyb3VwcyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnb3B0Z3JvdXAnKTtcbiAgICAvL1xuICAgIC8vICAgICB0aGlzLm9wdGlvbk9wdGdyb3VwSGFzaCA9IHt9O1xuICAgIC8vICAgICB0aGlzLm9wdGdyb3VwQ291bnRzID0ge307XG4gICAgLy9cbiAgICAvL1xuICAgIC8vICAgICAkb3B0Z3JvdXBzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICAgIHZhciAkb3B0Z3JvdXAgPSAkKHRoaXMpO1xuICAgIC8vICAgICAgIHZhciBvcHRncm91cE5hbWUgPSAkb3B0Z3JvdXAuYXR0cignbGFiZWwnKTtcbiAgICAvLyAgICAgICB2YXIgJG9wdGlvbnMgPSAkb3B0Z3JvdXAuZmluZCgnb3B0aW9uJyk7XG4gICAgLy8gICAgICAgc2VsZi5vcHRncm91cENvdW50c1tvcHRncm91cE5hbWVdID0gJG9wdGlvbnMubGVuZ3RoO1xuICAgIC8vXG4gICAgLy8gICAgICAgJG9wdGlvbnMuZWFjaChmdW5jdGlvbigpe1xuICAgIC8vICAgICAgICAgICBzZWxmLm9wdGlvbk9wdGdyb3VwSGFzaFskKHRoaXMpLnZhbCgpXSA9IG9wdGdyb3VwTmFtZTtcbiAgICAvLyAgICAgICB9KTtcbiAgICAvL1xuICAgIC8vICAgICB9KTtcbiAgICAvLyB9O1xuICAgIFxuICAgIC8vIENsaWNrYWJsZS5wcm90b3R5cGUuZ2V0R3JvdXBzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIC8vICAgICB2YXIgZ3JvdXBlZCA9IFtdO1xuICAgIC8vXG4gICAgLy8gICAgIHZhciBncm91cHMgPSBfLm1hcE9iamVjdCh0aGlzLm9wdGdyb3VwQ291bnRzLCBmdW5jdGlvbigpeyByZXR1cm4gW10gfSk7XG4gICAgLy9cbiAgICAvLyAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkYXRhLmxlbmd0aDsgZCsrKSB7XG4gICAgLy8gICAgICAgICB2YXIgc2VsZWN0aW9uID0gZGF0YVtkXTtcbiAgICAvLyAgICAgICAgIHZhciBncm91cCA9IHRoaXMub3B0aW9uT3B0Z3JvdXBIYXNoW3NlbGVjdGlvbi5pZF07XG4gICAgLy8gICAgICAgICBncm91cHNbZ3JvdXBdLnB1c2goc2VsZWN0aW9uKTtcbiAgICAvLyAgICAgfVxuICAgIC8vXG4gICAgLy8gICAgIF8uZWFjaCh0aGlzLm9wdGdyb3VwQ291bnRzLCBmdW5jdGlvbih2YWwsIGtleSl7XG4gICAgLy8gICAgICAgICBpZiAodmFsID09IGdyb3Vwc1trZXldLmxlbmd0aCkge1xuICAgIC8vICAgICAgICAgICAgIGdyb3VwZWQucHVzaCh7XG4gICAgLy8gICAgICAgICAgICAgICAgIHRleHQ6IGtleVxuICAgIC8vICAgICAgICAgICAgIH0pO1xuICAgIC8vICAgICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICBncm91cGVkID0gZ3JvdXBlZC5jb25jYXQoZ3JvdXBzW2tleV0pO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9KTtcbiAgICAvL1xuICAgIC8vICAgICByZXR1cm4gZ3JvdXBlZDtcbiAgICAvLyB9XG4gICAgXG4gICAgQ2xpY2thYmxlLnByb3RvdHlwZS5wcm9jZXNzRGF0YSA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB2YXIgY3VycmVudE9wdGdyb3VwID0gbnVsbDtcbiAgICAgICAgXG4gICAgICAgIHZhciByZXNldFF1ZXVlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmIChjdXJyZW50T3B0Z3JvdXAgJiYgY3VycmVudE9wdGdyb3VwLmNoaWxkcmVuLmxlbmd0aCA9PT0gcXVldWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goY3VycmVudE9wdGdyb3VwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2guYXBwbHkocmVzdWx0LCBxdWV1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB3aGlsZSAoZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gZGF0YS5zaGlmdCgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoaXRlbS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIHJlc2V0UXVldWUoKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50T3B0Z3JvdXAgPSBpdGVtO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudE9wdGdyb3VwICYmIF8uY29udGFpbnMoY3VycmVudE9wdGdyb3VwLmNoaWxkcmVuLCBpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICBxdWV1ZS5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc2V0UXVldWUoKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudE9wdGdyb3VwID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXNldFF1ZXVlKCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICBDbGlja2FibGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGRhdGEpe1xuXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcblxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZGF0YSA9IHRoaXMucHJvY2Vzc0RhdGEoZGF0YSk7XG4gICAgICAgIFxuICAgICAgICB2YXIgJHNlbGVjdGlvbnMgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3Rpb24gPSBkYXRhW2RdO1xuXG4gICAgICAgICAgICB2YXIgZm9ybWF0dGVkID0gdGhpcy5kaXNwbGF5KHNlbGVjdGlvbik7XG4gICAgICAgICAgICB2YXIgJHNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uQ29udGFpbmVyKCk7XG5cbiAgICAgICAgICAgICRzZWxlY3Rpb24uYXBwZW5kKGZvcm1hdHRlZCk7XG4gICAgICAgICAgICAkc2VsZWN0aW9uLnByb3AoJ3RpdGxlJywgc2VsZWN0aW9uLnRpdGxlIHx8IHNlbGVjdGlvbi50ZXh0KTtcblxuICAgICAgICAgICAgJHNlbGVjdGlvbi5kYXRhKCdkYXRhJywgc2VsZWN0aW9uKTtcblxuICAgICAgICAgICAgJHNlbGVjdGlvbnMucHVzaCgkc2VsZWN0aW9uKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdmFyICRyZW5kZXJlZCA9IHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJyk7XG5cbiAgICAgICAgVXRpbHMuYXBwZW5kTWFueSgkcmVuZGVyZWQsICRzZWxlY3Rpb25zKTtcbiAgICB9O1xuXG4gICAgICAgIFxuICAgIHJldHVybiBDbGlja2FibGU7XG59KTtcbiIsIiQuZm4uc2VsZWN0Mi5hbWQuZGVmaW5lKCdvcHRncm91cFJlc3VsdHMnLCBbXG4gICAgJ3NlbGVjdDIvcmVzdWx0cycsXG4gICAgJ3NlbGVjdDIvdXRpbHMnXG5dLCBmdW5jdGlvbiAoUmVzdWx0c0FkYXB0ZXIsIFV0aWxzKSB7XG4gICAgXG4gICAgZnVuY3Rpb24gT3B0Z3JvdXBSZXN1bHRzICgpIHt9O1xuICAgIFxuICAgIE9wdGdyb3VwUmVzdWx0cy5wcm90b3R5cGUub3B0aW9uID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgZGF0YSkge1xuICAgICAgICB2YXIgb3B0aW9uID0gZGVjb3JhdGVkLmNhbGwodGhpcywgZGF0YSk7XG4gICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSk7XG4gICAgICAgIHJldHVybiBvcHRpb247XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cFJlc3VsdHMucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbihkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRyZXN1bHRzLm9mZignbW91c2V1cCcpO1xuICAgICAgICB0aGlzLiRyZXN1bHRzLm9uKCdtb3VzZXVwJywgJy5zZWxlY3QyLXJlc3VsdHNfX29wdGlvblthcmlhLXNlbGVjdGVkXScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YSgnZGF0YScpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdHJpZ2dlciA9ICgkdGhpcy5hdHRyKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJykgID8gJ3Vuc2VsZWN0JyA6ICdzZWxlY3QnO1xuICBcbiAgICAgICAgICAgIHNlbGYudHJpZ2dlcih0cmlnZ2VyLCB7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0LFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgIHZhciBEZWNvcmF0ZWQgPSBVdGlscy5EZWNvcmF0ZShSZXN1bHRzQWRhcHRlciwgT3B0Z3JvdXBSZXN1bHRzKTtcbiAgICBcbiAgICByZXR1cm4gRGVjb3JhdGVkO1xufSk7Il19
