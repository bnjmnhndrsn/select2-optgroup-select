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
        
        if (data.children) {
            var $label = $(option).find('.select2-results__group');
            $label.attr({
                  'role': 'treeitem',
                  'aria-selected': 'false'
            });
            $.data($label, 'data', data);
        }
        return option;
    };
    
    OptgroupResults.prototype.bind = function(decorated, container, $container) {
        var self = this;
        decorated.call(this, container, $container);
        
        this.$results.on('mouseup', '.select2-results__group', function(evt) {
            var $this = $(this);
            
            var data = $this.data('data');
            console.log(data);
            //var trigger = ($this.attr('aria-selected') === 'true')  ? 'unselect' : 'select';
            
            // self.trigger(trigger, {
            //     originalEvent: evt,
            //     data: data
            // });
                
            return false;
        });
    };
    
    var Decorated = Utils.Decorate(ResultsAdapter, OptgroupResults);
    
    return Decorated;
});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWFpbi5qcyIsImxpYi9hZGFwdGVycy9vcHRncm91cC1kYXRhLmpzIiwibGliL2FkYXB0ZXJzL29wdGdyb3VwLXNlbGVjdGlvbi5qcyIsImxpYi9kZWNvcmF0b3JzL29wdGdyb3VwLXJlc3VsdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuL2FkYXB0ZXJzL29wdGdyb3VwLXNlbGVjdGlvbicpO1xucmVxdWlyZSgnLi9hZGFwdGVycy9vcHRncm91cC1kYXRhJyk7XG5yZXF1aXJlKCcuL2RlY29yYXRvcnMvb3B0Z3JvdXAtcmVzdWx0cycpO1xuXG4kKGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgJC5mbi5zZWxlY3QyLmFtZC5yZXF1aXJlKFtcInNlbGVjdDIvZHJvcGRvd25cIiwgXCJvcHRncm91cERhdGFcIiwgXCJvcHRncm91cFNlbGVjdGlvblwiLCBcIm9wdGdyb3VwUmVzdWx0c1wiXSwgXG4gICAgICAgIGZ1bmN0aW9uIChEcm9wZG93biwgT3B0Z3JvdXBEYXRhLCBPcHRncm91cFNlbGVjdGlvbiwgT3B0Z3JvdXBSZXN1bHRzKSB7XG5cbiAgICAgICAgJCgnI3RhcmdldCcpLnNlbGVjdDIoe1xuICAgICAgICAgICAgZGF0YUFkYXB0ZXI6IE9wdGdyb3VwRGF0YSxcbiAgICAgICAgICAgIHJlc3VsdHNBZGFwdGVyOiBPcHRncm91cFJlc3VsdHMsXG4gICAgICAgICAgICBzZWxlY3Rpb25BZGFwdGVyOiBPcHRncm91cFNlbGVjdGlvbixcbiAgICAgICAgfSk7IFxuICAgIH0pO1xufSk7XG5cblxuLypcblxudmFyICRzcGFuID0gJCgnPHNwYW4+JykudGV4dChvcHQudGV4dCk7XG5pZiAob3B0LmNoaWxkcmVuKSB7XG4gICAgdmFyIGNoaWxkVmFscyA9IF8ucGx1Y2sob3B0LmNoaWxkcmVuLCAnaWQnKTtcbiAgICAkc3Bhbi5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKCcjdGFyZ2V0JykudmFsKGNoaWxkVmFscykudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfSk7XG59XG5cbnJldHVybiAkc3BhbjtcbiovXG4iLCIkLmZuLnNlbGVjdDIuYW1kLmRlZmluZSgnb3B0Z3JvdXBEYXRhJywgW1xuICAgICdzZWxlY3QyL2RhdGEvc2VsZWN0JyxcbiAgICAnc2VsZWN0Mi91dGlscydcbl0sIGZ1bmN0aW9uIChTZWxlY3RBZGFwdGVyLCBVdGlscykge1xuICAgIFxuICAgIGZ1bmN0aW9uIE9wdGdyb3VwRGF0YSAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgT3B0Z3JvdXBEYXRhLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBcbiAgICBVdGlscy5FeHRlbmQoT3B0Z3JvdXBEYXRhLCBTZWxlY3RBZGFwdGVyKTtcbiAgICBcbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLmN1cnJlbnQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGRhdGEgPSBbXTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnOnNlbGVjdGVkLCAuc2VsZWN0ZWQtY3VzdG9tJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJG9wdGlvbiA9ICQodGhpcyk7XG4gICAgICAgICAgICB2YXIgb3B0aW9uID0gc2VsZi5pdGVtKCRvcHRpb24pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIW9wdGlvbi5oYXNPd25Qcm9wZXJ0eSgnaWQnKSkge1xuICAgICAgICAgICAgICAgIG9wdGlvbi5pZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBkYXRhLnB1c2gob3B0aW9uKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBkYXRhLnNlbGVjdGVkID0gdHJ1ZTtcblxuICAgICAgICAvLyBJZiBkYXRhLmVsZW1lbnQgaXMgYSBET00gbm9kZSwgdXNlIGl0IGluc3RlYWRcbiAgICAgICAgaWYgKCQoZGF0YS5lbGVtZW50KS5pcygnb3B0aW9uJykpIHtcbiAgICAgICAgICAgIGRhdGEuZWxlbWVudC5zZWxlY3RlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgJChkYXRhLmVsZW1lbnQpLmFkZENsYXNzKCdzZWxlY3RlZC1jdXN0b20nKTtcblxuICAgICAgICB0aGlzLmN1cnJlbnQoZnVuY3Rpb24gKGN1cnJlbnREYXRhKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gW107XG5cbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLmNoaWxkcmVuLmNvbmNhdChjdXJyZW50RGF0YSk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGF0YS5sZW5ndGg7IGQrKykge1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IGRhdGFbZF0uaWQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KGlkLCB2YWwpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB2YWwucHVzaChpZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLiRlbGVtZW50LnZhbCh2YWwpO1xuICAgICAgICAgICAgc2VsZi4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgT3B0Z3JvdXBEYXRhLnByb3RvdHlwZS51bnNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBkYXRhLnNlbGVjdGVkID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKCQoZGF0YS5lbGVtZW50KS5pcygnb3B0aW9uJykpIHtcbiAgICAgICAgICAgIGRhdGEuZWxlbWVudC5zZWxlY3RlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICQoZGF0YS5lbGVtZW50KS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQtY3VzdG9tJyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmN1cnJlbnQoZnVuY3Rpb24gKGN1cnJlbnREYXRhKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gW107XG4gICAgICAgICAgICB2YXIgY2hpbGRJZHMgPSAkLm1hcChkYXRhLmNoaWxkcmVuLCBmdW5jdGlvbihjaGlsZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkLmlkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBjdXJyZW50RGF0YVtpXS5pZDtcblxuICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkoaWQsIGNoaWxkSWRzKSA9PT0gLTEgICYmICQuaW5BcnJheShpZCwgdmFsKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsLnB1c2goaWQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIHNlbGYuJGVsZW1lbnQudmFsKHZhbCk7XG5cbiAgICAgICAgICAgIHNlbGYuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIE9wdGdyb3VwRGF0YTtcbn0pOyIsIiQuZm4uc2VsZWN0Mi5hbWQuZGVmaW5lKCdvcHRncm91cFNlbGVjdGlvbicsIFtcbiAgICAnc2VsZWN0Mi9zZWxlY3Rpb24vbXVsdGlwbGUnLFxuICAgICdzZWxlY3QyL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKE11bHRpcGxlU2VsZWN0aW9uLCBVdGlscykge1xuICAgIFxuICAgIGZ1bmN0aW9uIENsaWNrYWJsZSAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgQ2xpY2thYmxlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBcbiAgICBVdGlscy5FeHRlbmQoQ2xpY2thYmxlLCBNdWx0aXBsZVNlbGVjdGlvbik7XG4gICAgXG4gICAgLy8gQ2xpY2thYmxlLnByb3RvdHlwZS5nZXREYXRhID0gZnVuY3Rpb24oKXtcbiAgICAvLyAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgLy8gICAgIHZhciAkb3B0Z3JvdXBzID0gdGhpcy4kZWxlbWVudC5maW5kKCdvcHRncm91cCcpO1xuICAgIC8vXG4gICAgLy8gICAgIHRoaXMub3B0aW9uT3B0Z3JvdXBIYXNoID0ge307XG4gICAgLy8gICAgIHRoaXMub3B0Z3JvdXBDb3VudHMgPSB7fTtcbiAgICAvL1xuICAgIC8vXG4gICAgLy8gICAgICRvcHRncm91cHMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgLy8gICAgICAgdmFyICRvcHRncm91cCA9ICQodGhpcyk7XG4gICAgLy8gICAgICAgdmFyIG9wdGdyb3VwTmFtZSA9ICRvcHRncm91cC5hdHRyKCdsYWJlbCcpO1xuICAgIC8vICAgICAgIHZhciAkb3B0aW9ucyA9ICRvcHRncm91cC5maW5kKCdvcHRpb24nKTtcbiAgICAvLyAgICAgICBzZWxmLm9wdGdyb3VwQ291bnRzW29wdGdyb3VwTmFtZV0gPSAkb3B0aW9ucy5sZW5ndGg7XG4gICAgLy9cbiAgICAvLyAgICAgICAkb3B0aW9ucy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgICAgICAgIHNlbGYub3B0aW9uT3B0Z3JvdXBIYXNoWyQodGhpcykudmFsKCldID0gb3B0Z3JvdXBOYW1lO1xuICAgIC8vICAgICAgIH0pO1xuICAgIC8vXG4gICAgLy8gICAgIH0pO1xuICAgIC8vIH07XG4gICAgXG4gICAgLy8gQ2xpY2thYmxlLnByb3RvdHlwZS5nZXRHcm91cHMgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgLy8gICAgIHZhciBncm91cGVkID0gW107XG4gICAgLy9cbiAgICAvLyAgICAgdmFyIGdyb3VwcyA9IF8ubWFwT2JqZWN0KHRoaXMub3B0Z3JvdXBDb3VudHMsIGZ1bmN0aW9uKCl7IHJldHVybiBbXSB9KTtcbiAgICAvL1xuICAgIC8vICAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAvLyAgICAgICAgIHZhciBzZWxlY3Rpb24gPSBkYXRhW2RdO1xuICAgIC8vICAgICAgICAgdmFyIGdyb3VwID0gdGhpcy5vcHRpb25PcHRncm91cEhhc2hbc2VsZWN0aW9uLmlkXTtcbiAgICAvLyAgICAgICAgIGdyb3Vwc1tncm91cF0ucHVzaChzZWxlY3Rpb24pO1xuICAgIC8vICAgICB9XG4gICAgLy9cbiAgICAvLyAgICAgXy5lYWNoKHRoaXMub3B0Z3JvdXBDb3VudHMsIGZ1bmN0aW9uKHZhbCwga2V5KXtcbiAgICAvLyAgICAgICAgIGlmICh2YWwgPT0gZ3JvdXBzW2tleV0ubGVuZ3RoKSB7XG4gICAgLy8gICAgICAgICAgICAgZ3JvdXBlZC5wdXNoKHtcbiAgICAvLyAgICAgICAgICAgICAgICAgdGV4dDoga2V5XG4gICAgLy8gICAgICAgICAgICAgfSk7XG4gICAgLy8gICAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgICAgIGdyb3VwZWQgPSBncm91cGVkLmNvbmNhdChncm91cHNba2V5XSk7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH0pO1xuICAgIC8vXG4gICAgLy8gICAgIHJldHVybiBncm91cGVkO1xuICAgIC8vIH1cbiAgICBcbiAgICBDbGlja2FibGUucHJvdG90eXBlLnByb2Nlc3NEYXRhID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHZhciBjdXJyZW50T3B0Z3JvdXAgPSBudWxsO1xuICAgICAgICBcbiAgICAgICAgdmFyIHJlc2V0UXVldWUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRPcHRncm91cCAmJiBjdXJyZW50T3B0Z3JvdXAuY2hpbGRyZW4ubGVuZ3RoID09PSBxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjdXJyZW50T3B0Z3JvdXApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaC5hcHBseShyZXN1bHQsIHF1ZXVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHdoaWxlIChkYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBkYXRhLnNoaWZ0KCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChpdGVtLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgcmVzZXRRdWV1ZSgpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRPcHRncm91cCA9IGl0ZW07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50T3B0Z3JvdXAgJiYgXy5jb250YWlucyhjdXJyZW50T3B0Z3JvdXAuY2hpbGRyZW4sIGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzZXRRdWV1ZSgpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50T3B0Z3JvdXAgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJlc2V0UXVldWUoKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIENsaWNrYWJsZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oZGF0YSl7XG5cbiAgICAgICAgdGhpcy5jbGVhcigpO1xuXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBkYXRhID0gdGhpcy5wcm9jZXNzRGF0YShkYXRhKTtcbiAgICAgICAgXG4gICAgICAgIHZhciAkc2VsZWN0aW9ucyA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGF0YS5sZW5ndGg7IGQrKykge1xuICAgICAgICAgICAgdmFyIHNlbGVjdGlvbiA9IGRhdGFbZF07XG5cbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZWQgPSB0aGlzLmRpc3BsYXkoc2VsZWN0aW9uKTtcbiAgICAgICAgICAgIHZhciAkc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb25Db250YWluZXIoKTtcblxuICAgICAgICAgICAgJHNlbGVjdGlvbi5hcHBlbmQoZm9ybWF0dGVkKTtcbiAgICAgICAgICAgICRzZWxlY3Rpb24ucHJvcCgndGl0bGUnLCBzZWxlY3Rpb24udGl0bGUgfHwgc2VsZWN0aW9uLnRleHQpO1xuXG4gICAgICAgICAgICAkc2VsZWN0aW9uLmRhdGEoJ2RhdGEnLCBzZWxlY3Rpb24pO1xuXG4gICAgICAgICAgICAkc2VsZWN0aW9ucy5wdXNoKCRzZWxlY3Rpb24pO1xuICAgICAgICB9XG5cblxuICAgICAgICB2YXIgJHJlbmRlcmVkID0gdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKTtcblxuICAgICAgICBVdGlscy5hcHBlbmRNYW55KCRyZW5kZXJlZCwgJHNlbGVjdGlvbnMpO1xuICAgIH07XG5cbiAgICAgICAgXG4gICAgcmV0dXJuIENsaWNrYWJsZTtcbn0pO1xuIiwiJC5mbi5zZWxlY3QyLmFtZC5kZWZpbmUoJ29wdGdyb3VwUmVzdWx0cycsIFtcbiAgICAnc2VsZWN0Mi9yZXN1bHRzJyxcbiAgICAnc2VsZWN0Mi91dGlscydcbl0sIGZ1bmN0aW9uIChSZXN1bHRzQWRhcHRlciwgVXRpbHMpIHtcbiAgICBcbiAgICBmdW5jdGlvbiBPcHRncm91cFJlc3VsdHMgKCkge307XG4gICAgXG4gICAgT3B0Z3JvdXBSZXN1bHRzLnByb3RvdHlwZS5vcHRpb24gPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBkYXRhKSB7XG4gICAgICAgIHZhciBvcHRpb24gPSBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBkYXRhKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChkYXRhLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICB2YXIgJGxhYmVsID0gJChvcHRpb24pLmZpbmQoJy5zZWxlY3QyLXJlc3VsdHNfX2dyb3VwJyk7XG4gICAgICAgICAgICAkbGFiZWwuYXR0cih7XG4gICAgICAgICAgICAgICAgICAncm9sZSc6ICd0cmVlaXRlbScsXG4gICAgICAgICAgICAgICAgICAnYXJpYS1zZWxlY3RlZCc6ICdmYWxzZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJC5kYXRhKCRsYWJlbCwgJ2RhdGEnLCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3B0aW9uO1xuICAgIH07XG4gICAgXG4gICAgT3B0Z3JvdXBSZXN1bHRzLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24oZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kcmVzdWx0cy5vbignbW91c2V1cCcsICcuc2VsZWN0Mi1yZXN1bHRzX19ncm91cCcsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGRhdGEgPSAkdGhpcy5kYXRhKCdkYXRhJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgIC8vdmFyIHRyaWdnZXIgPSAoJHRoaXMuYXR0cignYXJpYS1zZWxlY3RlZCcpID09PSAndHJ1ZScpICA/ICd1bnNlbGVjdCcgOiAnc2VsZWN0JztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gc2VsZi50cmlnZ2VyKHRyaWdnZXIsIHtcbiAgICAgICAgICAgIC8vICAgICBvcmlnaW5hbEV2ZW50OiBldnQsXG4gICAgICAgICAgICAvLyAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgXG4gICAgdmFyIERlY29yYXRlZCA9IFV0aWxzLkRlY29yYXRlKFJlc3VsdHNBZGFwdGVyLCBPcHRncm91cFJlc3VsdHMpO1xuICAgIFxuICAgIHJldHVybiBEZWNvcmF0ZWQ7XG59KTsiXX0=
