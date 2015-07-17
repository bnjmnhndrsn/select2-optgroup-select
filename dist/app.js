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
        }
    };
    
    OptgroupData.prototype.unselect = function (data) {
        OptgroupData.__super__.unselect.apply(this, arguments);
        var $optgroup = $(data.element.parentElement);
        $optgroup.removeClass('selected-custom');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWFpbi5qcyIsImxpYi9hZGFwdGVycy9vcHRncm91cC1kYXRhLmpzIiwibGliL2FkYXB0ZXJzL29wdGdyb3VwLXNlbGVjdGlvbi5qcyIsImxpYi9kZWNvcmF0b3JzL29wdGdyb3VwLXJlc3VsdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4vYWRhcHRlcnMvb3B0Z3JvdXAtc2VsZWN0aW9uJyk7XG5yZXF1aXJlKCcuL2FkYXB0ZXJzL29wdGdyb3VwLWRhdGEnKTtcbnJlcXVpcmUoJy4vZGVjb3JhdG9ycy9vcHRncm91cC1yZXN1bHRzJyk7XG5cbiQoZnVuY3Rpb24oKXtcbiAgICBcbiAgICAkLmZuLnNlbGVjdDIuYW1kLnJlcXVpcmUoW1wic2VsZWN0Mi9kcm9wZG93blwiLCBcIm9wdGdyb3VwRGF0YVwiLCBcIm9wdGdyb3VwU2VsZWN0aW9uXCIsIFwib3B0Z3JvdXBSZXN1bHRzXCJdLCBcbiAgICAgICAgZnVuY3Rpb24gKERyb3Bkb3duLCBPcHRncm91cERhdGEsIE9wdGdyb3VwU2VsZWN0aW9uLCBPcHRncm91cFJlc3VsdHMpIHtcblxuICAgICAgICAkKCcjdGFyZ2V0Jykuc2VsZWN0Mih7XG4gICAgICAgICAgICBkYXRhQWRhcHRlcjogT3B0Z3JvdXBEYXRhLFxuICAgICAgICAgICAgcmVzdWx0c0FkYXB0ZXI6IE9wdGdyb3VwUmVzdWx0cyxcbiAgICAgICAgICAgIC8vIHNlbGVjdGlvbkFkYXB0ZXI6IE9wdGdyb3VwU2VsZWN0aW9uLFxuICAgICAgICB9KTsgXG4gICAgfSk7XG59KTtcblxuXG4vKlxuXG52YXIgJHNwYW4gPSAkKCc8c3Bhbj4nKS50ZXh0KG9wdC50ZXh0KTtcbmlmIChvcHQuY2hpbGRyZW4pIHtcbiAgICB2YXIgY2hpbGRWYWxzID0gXy5wbHVjayhvcHQuY2hpbGRyZW4sICdpZCcpO1xuICAgICRzcGFuLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJyN0YXJnZXQnKS52YWwoY2hpbGRWYWxzKS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9KTtcbn1cblxucmV0dXJuICRzcGFuO1xuKi9cbiIsIiQuZm4uc2VsZWN0Mi5hbWQuZGVmaW5lKCdvcHRncm91cERhdGEnLCBbXG4gICAgJ3NlbGVjdDIvZGF0YS9zZWxlY3QnLFxuICAgICdzZWxlY3QyL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKFNlbGVjdEFkYXB0ZXIsIFV0aWxzKSB7XG4gICAgXG4gICAgZnVuY3Rpb24gT3B0Z3JvdXBEYXRhICgkZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICBPcHRncm91cERhdGEuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIFxuICAgIFV0aWxzLkV4dGVuZChPcHRncm91cERhdGEsIFNlbGVjdEFkYXB0ZXIpO1xuICAgIFxuICAgIE9wdGdyb3VwRGF0YS5wcm90b3R5cGUuY3VycmVudCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICB2YXIgZGF0YSA9IFtdO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCc6bm90KC5zZWxlY3RlZC1jdXN0b20pIDpzZWxlY3RlZCwgLnNlbGVjdGVkLWN1c3RvbScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRvcHRpb24gPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIG9wdGlvbiA9IHNlbGYuaXRlbSgkb3B0aW9uKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFvcHRpb24uaGFzT3duUHJvcGVydHkoJ2lkJykpIHtcbiAgICAgICAgICAgICAgICBvcHRpb24uaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZGF0YS5wdXNoKG9wdGlvbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNhbGxiYWNrKGRhdGEpO1xuICAgIH07XG4gICAgXG4gICAgT3B0Z3JvdXBEYXRhLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgICAgICBPcHRncm91cERhdGEuX19zdXBlcl9fLmJpbmQuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgICAgICAgIFxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cblxuICAgICAgICBjb250YWluZXIub24oJ29wdGdyb3VwOnNlbGVjdCcsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgIHNlbGYub3B0Z3JvdXBTZWxlY3QocGFyYW1zLmRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGNvbnRhaW5lci5vbignb3B0Z3JvdXA6dW5zZWxlY3QnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICBzZWxmLm9wdGdyb3VwVW5zZWxlY3QocGFyYW1zLmRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwRGF0YS5wcm90b3R5cGUuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgT3B0Z3JvdXBEYXRhLl9fc3VwZXJfXy5zZWxlY3QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgdmFyIG9wdGdyb3VwID0gZGF0YS5lbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG9wdGdyb3VwLmNoaWxkcmVuO1xuICAgICAgICB2YXIgYWxsU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhbGxTZWxlY3RlZCA9IGNoaWxkcmVuW2ldLnNlbGVjdGVkO1xuICAgICAgICAgICAgaWYgKCFhbGxTZWxlY3RlZCkgeyBicmVhazsgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoYWxsU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICQob3B0Z3JvdXApLmFkZENsYXNzKCdzZWxlY3RlZC1jdXN0b20nKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgT3B0Z3JvdXBEYXRhLnByb3RvdHlwZS51bnNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIE9wdGdyb3VwRGF0YS5fX3N1cGVyX18udW5zZWxlY3QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgdmFyICRvcHRncm91cCA9ICQoZGF0YS5lbGVtZW50LnBhcmVudEVsZW1lbnQpO1xuICAgICAgICAkb3B0Z3JvdXAucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkLWN1c3RvbScpO1xuICAgIH07XG4gICAgXG4gICAgT3B0Z3JvdXBEYXRhLnByb3RvdHlwZS5vcHRncm91cFNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBkYXRhLnNlbGVjdGVkID0gdHJ1ZTtcblxuICAgICAgICAkKGRhdGEuZWxlbWVudCkuYWRkQ2xhc3MoJ3NlbGVjdGVkLWN1c3RvbScpO1xuXG4gICAgICAgIHRoaXMuY3VycmVudChmdW5jdGlvbiAoY3VycmVudERhdGEpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSBbXTtcblxuICAgICAgICAgICAgZGF0YSA9IGRhdGEuY2hpbGRyZW4uY29uY2F0KGN1cnJlbnREYXRhKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkYXRhLmxlbmd0aDsgZCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gZGF0YVtkXS5pZDtcblxuICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkoaWQsIHZhbCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbC5wdXNoKGlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuJGVsZW1lbnQudmFsKHZhbCk7XG4gICAgICAgICAgICBzZWxmLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICB9KTtcblxuICAgIH07XG4gICAgXG4gICAgT3B0Z3JvdXBEYXRhLnByb3RvdHlwZS5vcHRncm91cFVuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIFxuICAgICAgICBkYXRhLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICAkKGRhdGEuZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkLWN1c3RvbScpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jdXJyZW50KGZ1bmN0aW9uIChjdXJyZW50RGF0YSkge1xuICAgICAgICAgICAgdmFyIHZhbCA9IFtdO1xuICAgICAgICAgICAgdmFyIGNoaWxkSWRzID0gJC5tYXAoZGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpe1xuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5pZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnREYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gY3VycmVudERhdGFbaV0uaWQ7XG4gICAgXG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShpZCwgY2hpbGRJZHMpID09PSAtMSAgJiYgJC5pbkFycmF5KGlkLCB2YWwpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB2YWwucHVzaChpZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgXG4gICAgICAgICAgICBzZWxmLiRlbGVtZW50LnZhbCh2YWwpO1xuICAgICAgICAgICAgc2VsZi4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gT3B0Z3JvdXBEYXRhO1xufSk7IiwiJC5mbi5zZWxlY3QyLmFtZC5kZWZpbmUoJ29wdGdyb3VwU2VsZWN0aW9uJywgW1xuICAgICdzZWxlY3QyL3NlbGVjdGlvbi9tdWx0aXBsZScsXG4gICAgJ3NlbGVjdDIvdXRpbHMnXG5dLCBmdW5jdGlvbiAoTXVsdGlwbGVTZWxlY3Rpb24sIFV0aWxzKSB7XG4gICAgXG4gICAgZnVuY3Rpb24gQ2xpY2thYmxlICgkZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICBDbGlja2FibGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIFxuICAgIFV0aWxzLkV4dGVuZChDbGlja2FibGUsIE11bHRpcGxlU2VsZWN0aW9uKTtcbiAgICAvLyBcbiAgICAvLyBDbGlja2FibGUucHJvdG90eXBlLnByb2Nlc3NEYXRhID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgLy8gICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAvLyAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgLy8gICAgIHZhciBjdXJyZW50T3B0Z3JvdXAgPSBudWxsO1xuICAgIC8vICAgICBcbiAgICAvLyAgICAgdmFyIHJlc2V0UXVldWUgPSBmdW5jdGlvbigpe1xuICAgIC8vICAgICAgICAgaWYgKGN1cnJlbnRPcHRncm91cCAmJiBjdXJyZW50T3B0Z3JvdXAuY2hpbGRyZW4ubGVuZ3RoID09PSBxdWV1ZS5sZW5ndGgpIHtcbiAgICAvLyAgICAgICAgICAgICByZXN1bHQucHVzaChjdXJyZW50T3B0Z3JvdXApO1xuICAgIC8vICAgICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICByZXN1bHQucHVzaC5hcHBseShyZXN1bHQsIHF1ZXVlKTtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIHF1ZXVlID0gW107XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgXG4gICAgLy8gICAgIHdoaWxlIChkYXRhLmxlbmd0aCkge1xuICAgIC8vICAgICAgICAgdmFyIGl0ZW0gPSBkYXRhLnNoaWZ0KCk7XG4gICAgLy8gICAgICAgICBcbiAgICAvLyAgICAgICAgIGlmIChpdGVtLmNoaWxkcmVuKSB7XG4gICAgLy8gICAgICAgICAgICAgcmVzZXRRdWV1ZSgpO1xuICAgIC8vICAgICAgICAgICAgIGN1cnJlbnRPcHRncm91cCA9IGl0ZW07XG4gICAgLy8gICAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgICAgIGlmIChjdXJyZW50T3B0Z3JvdXAgJiYgXy5jb250YWlucyhjdXJyZW50T3B0Z3JvdXAuY2hpbGRyZW4sIGl0ZW0pKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgIHF1ZXVlLnB1c2goaXRlbSk7XG4gICAgLy8gICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgcmVzZXRRdWV1ZSgpO1xuICAgIC8vICAgICAgICAgICAgICAgICBjdXJyZW50T3B0Z3JvdXAgPSBudWxsO1xuICAgIC8vICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcbiAgICAvLyAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgXG4gICAgLy8gICAgIHJlc2V0UXVldWUoKTtcbiAgICAvLyAgICAgXG4gICAgLy8gICAgIHJldHVybiByZXN1bHQ7XG4gICAgLy8gfTtcbiAgICAvLyBcbiAgICAvLyBDbGlja2FibGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgIC8vIFxuICAgIC8vICAgICB0aGlzLmNsZWFyKCk7XG4gICAgLy8gXG4gICAgLy8gICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vICAgICAgICAgcmV0dXJuO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIFxuICAgIC8vICAgICBkYXRhID0gdGhpcy5wcm9jZXNzRGF0YShkYXRhKTtcbiAgICAvLyAgICAgXG4gICAgLy8gICAgIHZhciAkc2VsZWN0aW9ucyA9IFtdO1xuICAgIC8vIFxuICAgIC8vICAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAvLyAgICAgICAgIHZhciBzZWxlY3Rpb24gPSBkYXRhW2RdO1xuICAgIC8vIFxuICAgIC8vICAgICAgICAgdmFyIGZvcm1hdHRlZCA9IHRoaXMuZGlzcGxheShzZWxlY3Rpb24pO1xuICAgIC8vICAgICAgICAgdmFyICRzZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbkNvbnRhaW5lcigpO1xuICAgIC8vIFxuICAgIC8vICAgICAgICAgJHNlbGVjdGlvbi5hcHBlbmQoZm9ybWF0dGVkKTtcbiAgICAvLyAgICAgICAgICRzZWxlY3Rpb24ucHJvcCgndGl0bGUnLCBzZWxlY3Rpb24udGl0bGUgfHwgc2VsZWN0aW9uLnRleHQpO1xuICAgIC8vIFxuICAgIC8vICAgICAgICAgJHNlbGVjdGlvbi5kYXRhKCdkYXRhJywgc2VsZWN0aW9uKTtcbiAgICAvLyBcbiAgICAvLyAgICAgICAgICRzZWxlY3Rpb25zLnB1c2goJHNlbGVjdGlvbik7XG4gICAgLy8gICAgIH1cbiAgICAvLyBcbiAgICAvLyBcbiAgICAvLyAgICAgdmFyICRyZW5kZXJlZCA9IHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJyk7XG4gICAgLy8gXG4gICAgLy8gICAgIFV0aWxzLmFwcGVuZE1hbnkoJHJlbmRlcmVkLCAkc2VsZWN0aW9ucyk7XG4gICAgLy8gfTtcblxuICAgICAgICBcbiAgICByZXR1cm4gQ2xpY2thYmxlO1xufSk7XG4iLCIkLmZuLnNlbGVjdDIuYW1kLmRlZmluZSgnb3B0Z3JvdXBSZXN1bHRzJywgW1xuICAgICdzZWxlY3QyL3Jlc3VsdHMnLFxuICAgICdzZWxlY3QyL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKFJlc3VsdHNBZGFwdGVyLCBVdGlscykge1xuICAgIFxuICAgIGZ1bmN0aW9uIE9wdGdyb3VwUmVzdWx0cyAoKSB7fTtcbiAgICBcbiAgICBPcHRncm91cFJlc3VsdHMucHJvdG90eXBlLm9wdGlvbiA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGRhdGEpIHtcbiAgICAgICAgdmFyIG9wdGlvbiA9IGRlY29yYXRlZC5jYWxsKHRoaXMsIGRhdGEpO1xuXG4gICAgICAgIGlmIChkYXRhLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICB2YXIgJGxhYmVsID0gJChvcHRpb24pLmZpbmQoJy5zZWxlY3QyLXJlc3VsdHNfX2dyb3VwJyk7XG4gICAgICAgICAgICAkbGFiZWwuYXR0cih7XG4gICAgICAgICAgICAgICAgICAncm9sZSc6ICd0cmVlaXRlbScsXG4gICAgICAgICAgICAgICAgICAnYXJpYS1zZWxlY3RlZCc6ICdmYWxzZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJGxhYmVsLmRhdGEoJ2RhdGEnLCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3B0aW9uO1xuICAgIH07XG4gICAgXG4gICAgT3B0Z3JvdXBSZXN1bHRzLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24oZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kcmVzdWx0cy5vbignbW91c2V1cCcsICcuc2VsZWN0Mi1yZXN1bHRzX19ncm91cCcsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGRhdGEgPSAkdGhpcy5kYXRhKCdkYXRhJyk7XG5cbiAgICAgICAgICAgIHZhciB0cmlnZ2VyID0gKCR0aGlzLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnKSA9PT0gJ3RydWUnKSAgPyAnb3B0Z3JvdXA6dW5zZWxlY3QnIDogJ29wdGdyb3VwOnNlbGVjdCc7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNlbGYudHJpZ2dlcih0cmlnZ2VyLCB7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0LFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGNvbnRhaW5lci5vbignb3B0Z3JvdXA6c2VsZWN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFjb250YWluZXIuaXNPcGVuKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuc2V0Q2xhc3NlcygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb250YWluZXIub24oJ29wdGdyb3VwOnVuc2VsZWN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFjb250YWluZXIuaXNPcGVuKCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLnNldENsYXNzZXMoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cFJlc3VsdHMucHJvdG90eXBlLnNldENsYXNzZXMgPSBmdW5jdGlvbihkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgICAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xuICAgICAgICBcbiAgICAgICAgdmFyICRncm91cHMgPSB0aGlzLiRyZXN1bHRzLmZpbmQoJy5zZWxlY3QyLXJlc3VsdHNfX2dyb3VwJyk7XG4gICAgICAgIFxuICAgICAgICAkZ3JvdXBzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRvcHRncm91cCA9ICQodGhpcyk7XG4gICAgICAgICAgICB2YXIgaXRlbSA9ICQuZGF0YSh0aGlzLCAnZGF0YScpO1xuICAgICAgICAgICAgJG9wdGdyb3VwLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCAkKGl0ZW0uZWxlbWVudCkuaGFzQ2xhc3MoJ3NlbGVjdGVkLWN1c3RvbScpKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuICAgIFxuICAgIHZhciBEZWNvcmF0ZWQgPSBVdGlscy5EZWNvcmF0ZShSZXN1bHRzQWRhcHRlciwgT3B0Z3JvdXBSZXN1bHRzKTtcbiAgICBcbiAgICByZXR1cm4gRGVjb3JhdGVkO1xufSk7Il19
