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
            // selectionAdapter: OptgroupSelection,
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

        this.$element.find(':not(.selected-custom) :selected, .selected-custom').each(function () {
            var $option = $(this);
            var option = self.item($option);
            
            if (!option.hasOwnProperty('id')) {
                option.id = false;
            }
            
            data.push(option);
        });

        callback(data);
    };
    
    OptgroupData.prototype.bind = function (container, $container) {
        OptgroupData.__super__.bind.apply(this, arguments);        
        var self = this;


        container.on('optgroup:select', function (params) {
            self.optgroupSelect(params.data);
        });
        
        container.on('optgroup:unselect', function (params) {
            self.optgroupUnselect(params.data);
        });
    };
    
    OptgroupData.prototype.select = function (data) {
        OptgroupData.__super__.select.apply(this, arguments);
        var optgroup = data.element.parentElement;
        var children = optgroup.children;
        var allSelected = true;
        for (var i = 0; i < children.length; i++) {
            allSelected = children[i].selected;
            if (!allSelected) { break; }
        }
        
        if (allSelected) {
            $(optgroup).addClass('selected-custom');
            this.$element.trigger('change');
        }
    };
    
    OptgroupData.prototype.unselect = function (data) {
        OptgroupData.__super__.unselect.apply(this, arguments);
        var $optgroup = $(data.element.parentElement);
        $optgroup.removeClass('selected-custom');
        this.$element.trigger('change');
    };
    
    OptgroupData.prototype.optgroupSelect = function (data) {
        var self = this;

        data.selected = true;

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
    
    OptgroupData.prototype.optgroupUnselect = function (data) {
        var self = this;
    
        data.selected = false;
        
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
    // 
    // Clickable.prototype.processData = function(data){
    //     var result = [];
    //     var queue = [];
    //     var currentOptgroup = null;
    //     
    //     var resetQueue = function(){
    //         if (currentOptgroup && currentOptgroup.children.length === queue.length) {
    //             result.push(currentOptgroup);
    //         } else {
    //             result.push.apply(result, queue);
    //         }
    //         queue = [];
    //     }
    //     
    //     while (data.length) {
    //         var item = data.shift();
    //         
    //         if (item.children) {
    //             resetQueue();
    //             currentOptgroup = item;
    //         } else {
    //             if (currentOptgroup && _.contains(currentOptgroup.children, item)) {
    //                 queue.push(item);
    //             } else {
    //                 resetQueue();
    //                 currentOptgroup = null;
    //                 result.push(item);
    //             }
    //         }
    //     }
    //     
    //     resetQueue();
    //     
    //     return result;
    // };
    // 
    // Clickable.prototype.update = function(data){
    // 
    //     this.clear();
    // 
    //     if (data.length === 0) {
    //         return;
    //     }
    //     
    //     data = this.processData(data);
    //     
    //     var $selections = [];
    // 
    //     for (var d = 0; d < data.length; d++) {
    //         var selection = data[d];
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

        if (data.children) {
            var $label = $(option).find('.select2-results__group');
            $label.attr({
                  'role': 'treeitem',
                  'aria-selected': 'false'
            });
            $label.data('data', data);
        }
        return option;
    };
    
    OptgroupResults.prototype.bind = function(decorated, container, $container) {
        var self = this;
        decorated.call(this, container, $container);
        
        this.$results.on('mouseup', '.select2-results__group', function(evt) {
            var $this = $(this);
            
            var data = $this.data('data');

            var trigger = ($this.attr('aria-selected') === 'true')  ? 'optgroup:unselect' : 'optgroup:select';
            
            self.trigger(trigger, {
                originalEvent: evt,
                data: data
            });
                
            return false;
        });
        
        container.on('optgroup:select', function () {
            if (!container.isOpen()) {
                return;
            }

            self.setClasses();
        });

        container.on('optgroup:unselect', function () {
            if (!container.isOpen()) {
              return;
            }

            self.setClasses();
        });
    };
    
    OptgroupResults.prototype.setClasses = function(decorated, container, $container) {
        decorated.call(this, container, $container);
        
        var $groups = this.$results.find('.select2-results__group');
        
        $groups.each(function () {
            var $optgroup = $(this);
            var item = $.data(this, 'data');
            $optgroup.attr('aria-selected', $(item.element).hasClass('selected-custom'));
        });

    };
    
    var Decorated = Utils.Decorate(ResultsAdapter, OptgroupResults);
    
    return Decorated;
});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWFpbi5qcyIsImxpYi9hZGFwdGVycy9vcHRncm91cC1kYXRhLmpzIiwibGliL2FkYXB0ZXJzL29wdGdyb3VwLXNlbGVjdGlvbi5qcyIsImxpYi9kZWNvcmF0b3JzL29wdGdyb3VwLXJlc3VsdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuL2FkYXB0ZXJzL29wdGdyb3VwLXNlbGVjdGlvbicpO1xucmVxdWlyZSgnLi9hZGFwdGVycy9vcHRncm91cC1kYXRhJyk7XG5yZXF1aXJlKCcuL2RlY29yYXRvcnMvb3B0Z3JvdXAtcmVzdWx0cycpO1xuXG4kKGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgJC5mbi5zZWxlY3QyLmFtZC5yZXF1aXJlKFtcInNlbGVjdDIvZHJvcGRvd25cIiwgXCJvcHRncm91cERhdGFcIiwgXCJvcHRncm91cFNlbGVjdGlvblwiLCBcIm9wdGdyb3VwUmVzdWx0c1wiXSwgXG4gICAgICAgIGZ1bmN0aW9uIChEcm9wZG93biwgT3B0Z3JvdXBEYXRhLCBPcHRncm91cFNlbGVjdGlvbiwgT3B0Z3JvdXBSZXN1bHRzKSB7XG5cbiAgICAgICAgJCgnI3RhcmdldCcpLnNlbGVjdDIoe1xuICAgICAgICAgICAgZGF0YUFkYXB0ZXI6IE9wdGdyb3VwRGF0YSxcbiAgICAgICAgICAgIHJlc3VsdHNBZGFwdGVyOiBPcHRncm91cFJlc3VsdHMsXG4gICAgICAgICAgICAvLyBzZWxlY3Rpb25BZGFwdGVyOiBPcHRncm91cFNlbGVjdGlvbixcbiAgICAgICAgfSk7IFxuICAgIH0pO1xufSk7XG5cblxuLypcblxudmFyICRzcGFuID0gJCgnPHNwYW4+JykudGV4dChvcHQudGV4dCk7XG5pZiAob3B0LmNoaWxkcmVuKSB7XG4gICAgdmFyIGNoaWxkVmFscyA9IF8ucGx1Y2sob3B0LmNoaWxkcmVuLCAnaWQnKTtcbiAgICAkc3Bhbi5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKCcjdGFyZ2V0JykudmFsKGNoaWxkVmFscykudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfSk7XG59XG5cbnJldHVybiAkc3BhbjtcbiovXG4iLCIkLmZuLnNlbGVjdDIuYW1kLmRlZmluZSgnb3B0Z3JvdXBEYXRhJywgW1xuICAgICdzZWxlY3QyL2RhdGEvc2VsZWN0JyxcbiAgICAnc2VsZWN0Mi91dGlscydcbl0sIGZ1bmN0aW9uIChTZWxlY3RBZGFwdGVyLCBVdGlscykge1xuICAgIFxuICAgIGZ1bmN0aW9uIE9wdGdyb3VwRGF0YSAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgT3B0Z3JvdXBEYXRhLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBcbiAgICBVdGlscy5FeHRlbmQoT3B0Z3JvdXBEYXRhLCBTZWxlY3RBZGFwdGVyKTtcbiAgICBcbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLmN1cnJlbnQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGRhdGEgPSBbXTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnOm5vdCguc2VsZWN0ZWQtY3VzdG9tKSA6c2VsZWN0ZWQsIC5zZWxlY3RlZC1jdXN0b20nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkb3B0aW9uID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBvcHRpb24gPSBzZWxmLml0ZW0oJG9wdGlvbik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghb3B0aW9uLmhhc093blByb3BlcnR5KCdpZCcpKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9uLmlkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGRhdGEucHVzaChvcHRpb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICBjYWxsYmFjayhkYXRhKTtcbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwRGF0YS5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICAgICAgT3B0Z3JvdXBEYXRhLl9fc3VwZXJfXy5iaW5kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7ICAgICAgICBcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG5cbiAgICAgICAgY29udGFpbmVyLm9uKCdvcHRncm91cDpzZWxlY3QnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICBzZWxmLm9wdGdyb3VwU2VsZWN0KHBhcmFtcy5kYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBjb250YWluZXIub24oJ29wdGdyb3VwOnVuc2VsZWN0JywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgc2VsZi5vcHRncm91cFVuc2VsZWN0KHBhcmFtcy5kYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIE9wdGdyb3VwRGF0YS5fX3N1cGVyX18uc2VsZWN0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIHZhciBvcHRncm91cCA9IGRhdGEuZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBvcHRncm91cC5jaGlsZHJlbjtcbiAgICAgICAgdmFyIGFsbFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYWxsU2VsZWN0ZWQgPSBjaGlsZHJlbltpXS5zZWxlY3RlZDtcbiAgICAgICAgICAgIGlmICghYWxsU2VsZWN0ZWQpIHsgYnJlYWs7IH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGFsbFNlbGVjdGVkKSB7XG4gICAgICAgICAgICAkKG9wdGdyb3VwKS5hZGRDbGFzcygnc2VsZWN0ZWQtY3VzdG9tJyk7XG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLnVuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgT3B0Z3JvdXBEYXRhLl9fc3VwZXJfXy51bnNlbGVjdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB2YXIgJG9wdGdyb3VwID0gJChkYXRhLmVsZW1lbnQucGFyZW50RWxlbWVudCk7XG4gICAgICAgICRvcHRncm91cC5yZW1vdmVDbGFzcygnc2VsZWN0ZWQtY3VzdG9tJyk7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLm9wdGdyb3VwU2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGRhdGEuc2VsZWN0ZWQgPSB0cnVlO1xuXG4gICAgICAgICQoZGF0YS5lbGVtZW50KS5hZGRDbGFzcygnc2VsZWN0ZWQtY3VzdG9tJyk7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50KGZ1bmN0aW9uIChjdXJyZW50RGF0YSkge1xuICAgICAgICAgICAgdmFyIHZhbCA9IFtdO1xuXG4gICAgICAgICAgICBkYXRhID0gZGF0YS5jaGlsZHJlbi5jb25jYXQoY3VycmVudERhdGEpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBkYXRhW2RdLmlkO1xuXG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShpZCwgdmFsKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsLnB1c2goaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi4kZWxlbWVudC52YWwodmFsKTtcbiAgICAgICAgICAgIHNlbGYuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLm9wdGdyb3VwVW5zZWxlY3QgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgXG4gICAgICAgIGRhdGEuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgICQoZGF0YS5lbGVtZW50KS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQtY3VzdG9tJyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmN1cnJlbnQoZnVuY3Rpb24gKGN1cnJlbnREYXRhKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gW107XG4gICAgICAgICAgICB2YXIgY2hpbGRJZHMgPSAkLm1hcChkYXRhLmNoaWxkcmVuLCBmdW5jdGlvbihjaGlsZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkLmlkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBjdXJyZW50RGF0YVtpXS5pZDtcbiAgICBcbiAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KGlkLCBjaGlsZElkcykgPT09IC0xICAmJiAkLmluQXJyYXkoaWQsIHZhbCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbC5wdXNoKGlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICBcbiAgICAgICAgICAgIHNlbGYuJGVsZW1lbnQudmFsKHZhbCk7XG4gICAgICAgICAgICBzZWxmLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBPcHRncm91cERhdGE7XG59KTsiLCIkLmZuLnNlbGVjdDIuYW1kLmRlZmluZSgnb3B0Z3JvdXBTZWxlY3Rpb24nLCBbXG4gICAgJ3NlbGVjdDIvc2VsZWN0aW9uL211bHRpcGxlJyxcbiAgICAnc2VsZWN0Mi91dGlscydcbl0sIGZ1bmN0aW9uIChNdWx0aXBsZVNlbGVjdGlvbiwgVXRpbHMpIHtcbiAgICBcbiAgICBmdW5jdGlvbiBDbGlja2FibGUgKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgIENsaWNrYWJsZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgXG4gICAgVXRpbHMuRXh0ZW5kKENsaWNrYWJsZSwgTXVsdGlwbGVTZWxlY3Rpb24pO1xuICAgIC8vIFxuICAgIC8vIENsaWNrYWJsZS5wcm90b3R5cGUucHJvY2Vzc0RhdGEgPSBmdW5jdGlvbihkYXRhKXtcbiAgICAvLyAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIC8vICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAvLyAgICAgdmFyIGN1cnJlbnRPcHRncm91cCA9IG51bGw7XG4gICAgLy8gICAgIFxuICAgIC8vICAgICB2YXIgcmVzZXRRdWV1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgICAgICBpZiAoY3VycmVudE9wdGdyb3VwICYmIGN1cnJlbnRPcHRncm91cC5jaGlsZHJlbi5sZW5ndGggPT09IHF1ZXVlLmxlbmd0aCkge1xuICAgIC8vICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGN1cnJlbnRPcHRncm91cCk7XG4gICAgLy8gICAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgICAgIHJlc3VsdC5wdXNoLmFwcGx5KHJlc3VsdCwgcXVldWUpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgICAgcXVldWUgPSBbXTtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBcbiAgICAvLyAgICAgd2hpbGUgKGRhdGEubGVuZ3RoKSB7XG4gICAgLy8gICAgICAgICB2YXIgaXRlbSA9IGRhdGEuc2hpZnQoKTtcbiAgICAvLyAgICAgICAgIFxuICAgIC8vICAgICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4pIHtcbiAgICAvLyAgICAgICAgICAgICByZXNldFF1ZXVlKCk7XG4gICAgLy8gICAgICAgICAgICAgY3VycmVudE9wdGdyb3VwID0gaXRlbTtcbiAgICAvLyAgICAgICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgICAgICAgaWYgKGN1cnJlbnRPcHRncm91cCAmJiBfLmNvbnRhaW5zKGN1cnJlbnRPcHRncm91cC5jaGlsZHJlbiwgaXRlbSkpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgcXVldWUucHVzaChpdGVtKTtcbiAgICAvLyAgICAgICAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgICAgICAgICByZXNldFF1ZXVlKCk7XG4gICAgLy8gICAgICAgICAgICAgICAgIGN1cnJlbnRPcHRncm91cCA9IG51bGw7XG4gICAgLy8gICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgIC8vICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBcbiAgICAvLyAgICAgcmVzZXRRdWV1ZSgpO1xuICAgIC8vICAgICBcbiAgICAvLyAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAvLyB9O1xuICAgIC8vIFxuICAgIC8vIENsaWNrYWJsZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgLy8gXG4gICAgLy8gICAgIHRoaXMuY2xlYXIoKTtcbiAgICAvLyBcbiAgICAvLyAgICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gICAgICAgICByZXR1cm47XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgXG4gICAgLy8gICAgIGRhdGEgPSB0aGlzLnByb2Nlc3NEYXRhKGRhdGEpO1xuICAgIC8vICAgICBcbiAgICAvLyAgICAgdmFyICRzZWxlY3Rpb25zID0gW107XG4gICAgLy8gXG4gICAgLy8gICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGF0YS5sZW5ndGg7IGQrKykge1xuICAgIC8vICAgICAgICAgdmFyIHNlbGVjdGlvbiA9IGRhdGFbZF07XG4gICAgLy8gXG4gICAgLy8gICAgICAgICB2YXIgZm9ybWF0dGVkID0gdGhpcy5kaXNwbGF5KHNlbGVjdGlvbik7XG4gICAgLy8gICAgICAgICB2YXIgJHNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uQ29udGFpbmVyKCk7XG4gICAgLy8gXG4gICAgLy8gICAgICAgICAkc2VsZWN0aW9uLmFwcGVuZChmb3JtYXR0ZWQpO1xuICAgIC8vICAgICAgICAgJHNlbGVjdGlvbi5wcm9wKCd0aXRsZScsIHNlbGVjdGlvbi50aXRsZSB8fCBzZWxlY3Rpb24udGV4dCk7XG4gICAgLy8gXG4gICAgLy8gICAgICAgICAkc2VsZWN0aW9uLmRhdGEoJ2RhdGEnLCBzZWxlY3Rpb24pO1xuICAgIC8vIFxuICAgIC8vICAgICAgICAgJHNlbGVjdGlvbnMucHVzaCgkc2VsZWN0aW9uKTtcbiAgICAvLyAgICAgfVxuICAgIC8vIFxuICAgIC8vIFxuICAgIC8vICAgICB2YXIgJHJlbmRlcmVkID0gdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKTtcbiAgICAvLyBcbiAgICAvLyAgICAgVXRpbHMuYXBwZW5kTWFueSgkcmVuZGVyZWQsICRzZWxlY3Rpb25zKTtcbiAgICAvLyB9O1xuXG4gICAgICAgIFxuICAgIHJldHVybiBDbGlja2FibGU7XG59KTtcbiIsIiQuZm4uc2VsZWN0Mi5hbWQuZGVmaW5lKCdvcHRncm91cFJlc3VsdHMnLCBbXG4gICAgJ3NlbGVjdDIvcmVzdWx0cycsXG4gICAgJ3NlbGVjdDIvdXRpbHMnXG5dLCBmdW5jdGlvbiAoUmVzdWx0c0FkYXB0ZXIsIFV0aWxzKSB7XG4gICAgXG4gICAgZnVuY3Rpb24gT3B0Z3JvdXBSZXN1bHRzICgpIHt9O1xuICAgIFxuICAgIE9wdGdyb3VwUmVzdWx0cy5wcm90b3R5cGUub3B0aW9uID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgZGF0YSkge1xuICAgICAgICB2YXIgb3B0aW9uID0gZGVjb3JhdGVkLmNhbGwodGhpcywgZGF0YSk7XG5cbiAgICAgICAgaWYgKGRhdGEuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIHZhciAkbGFiZWwgPSAkKG9wdGlvbikuZmluZCgnLnNlbGVjdDItcmVzdWx0c19fZ3JvdXAnKTtcbiAgICAgICAgICAgICRsYWJlbC5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICdyb2xlJzogJ3RyZWVpdGVtJyxcbiAgICAgICAgICAgICAgICAgICdhcmlhLXNlbGVjdGVkJzogJ2ZhbHNlJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkbGFiZWwuZGF0YSgnZGF0YScsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHRpb247XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cFJlc3VsdHMucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbihkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRyZXN1bHRzLm9uKCdtb3VzZXVwJywgJy5zZWxlY3QyLXJlc3VsdHNfX2dyb3VwJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgZGF0YSA9ICR0aGlzLmRhdGEoJ2RhdGEnKTtcblxuICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSAoJHRoaXMuYXR0cignYXJpYS1zZWxlY3RlZCcpID09PSAndHJ1ZScpICA/ICdvcHRncm91cDp1bnNlbGVjdCcgOiAnb3B0Z3JvdXA6c2VsZWN0JztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKHRyaWdnZXIsIHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnQsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgY29udGFpbmVyLm9uKCdvcHRncm91cDpzZWxlY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWNvbnRhaW5lci5pc09wZW4oKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5zZXRDbGFzc2VzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnRhaW5lci5vbignb3B0Z3JvdXA6dW5zZWxlY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWNvbnRhaW5lci5pc09wZW4oKSkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuc2V0Q2xhc3NlcygpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwUmVzdWx0cy5wcm90b3R5cGUuc2V0Q2xhc3NlcyA9IGZ1bmN0aW9uKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG4gICAgICAgIFxuICAgICAgICB2YXIgJGdyb3VwcyA9IHRoaXMuJHJlc3VsdHMuZmluZCgnLnNlbGVjdDItcmVzdWx0c19fZ3JvdXAnKTtcbiAgICAgICAgXG4gICAgICAgICRncm91cHMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJG9wdGdyb3VwID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBpdGVtID0gJC5kYXRhKHRoaXMsICdkYXRhJyk7XG4gICAgICAgICAgICAkb3B0Z3JvdXAuYXR0cignYXJpYS1zZWxlY3RlZCcsICQoaXRlbS5lbGVtZW50KS5oYXNDbGFzcygnc2VsZWN0ZWQtY3VzdG9tJykpO1xuICAgICAgICB9KTtcblxuICAgIH07XG4gICAgXG4gICAgdmFyIERlY29yYXRlZCA9IFV0aWxzLkRlY29yYXRlKFJlc3VsdHNBZGFwdGVyLCBPcHRncm91cFJlc3VsdHMpO1xuICAgIFxuICAgIHJldHVybiBEZWNvcmF0ZWQ7XG59KTsiXX0=
