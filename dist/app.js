(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./adapters/optgroup-selection');
require('./adapters/optgroup-data');
require('./decorators/optgroup-results');

$(function(){
    
    $.fn.select2.amd.require(["optgroupData", "optgroupSelection", "optgroupResults"], 
        function (OptgroupData, OptgroupSelection, OptgroupResults) {

        $('#target').select2({
            dataAdapter: OptgroupData,
            resultsAdapter: OptgroupResults,
            selectionAdapter: OptgroupSelection
        }); 
    });
});

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
        if ($(data.element).is('optgroup')){
            this.optgroupSelect(data);
            return;
        }
        
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
        if ($(data.element).is('optgroup')){
            this.optgroupUnselect(data);
            return;
        }
        
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
    'select2/selection/search',
    'select2/utils'
], function (MultipleSelection, SelectionSearch, Utils) {
    
    function OptgroupSelection ($element, options) {
        OptgroupSelection.__super__.constructor.apply(this, arguments);
    }
    
    Utils.Extend(OptgroupSelection, MultipleSelection);
    
    var Decorated = Utils.Decorate(OptgroupSelection, SelectionSearch);
        
    return Decorated;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWFpbi5qcyIsImxpYi9hZGFwdGVycy9vcHRncm91cC1kYXRhLmpzIiwibGliL2FkYXB0ZXJzL29wdGdyb3VwLXNlbGVjdGlvbi5qcyIsImxpYi9kZWNvcmF0b3JzL29wdGdyb3VwLXJlc3VsdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4vYWRhcHRlcnMvb3B0Z3JvdXAtc2VsZWN0aW9uJyk7XG5yZXF1aXJlKCcuL2FkYXB0ZXJzL29wdGdyb3VwLWRhdGEnKTtcbnJlcXVpcmUoJy4vZGVjb3JhdG9ycy9vcHRncm91cC1yZXN1bHRzJyk7XG5cbiQoZnVuY3Rpb24oKXtcbiAgICBcbiAgICAkLmZuLnNlbGVjdDIuYW1kLnJlcXVpcmUoW1wib3B0Z3JvdXBEYXRhXCIsIFwib3B0Z3JvdXBTZWxlY3Rpb25cIiwgXCJvcHRncm91cFJlc3VsdHNcIl0sIFxuICAgICAgICBmdW5jdGlvbiAoT3B0Z3JvdXBEYXRhLCBPcHRncm91cFNlbGVjdGlvbiwgT3B0Z3JvdXBSZXN1bHRzKSB7XG5cbiAgICAgICAgJCgnI3RhcmdldCcpLnNlbGVjdDIoe1xuICAgICAgICAgICAgZGF0YUFkYXB0ZXI6IE9wdGdyb3VwRGF0YSxcbiAgICAgICAgICAgIHJlc3VsdHNBZGFwdGVyOiBPcHRncm91cFJlc3VsdHMsXG4gICAgICAgICAgICBzZWxlY3Rpb25BZGFwdGVyOiBPcHRncm91cFNlbGVjdGlvblxuICAgICAgICB9KTsgXG4gICAgfSk7XG59KTtcbiIsIiQuZm4uc2VsZWN0Mi5hbWQuZGVmaW5lKCdvcHRncm91cERhdGEnLCBbXG4gICAgJ3NlbGVjdDIvZGF0YS9zZWxlY3QnLFxuICAgICdzZWxlY3QyL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKFNlbGVjdEFkYXB0ZXIsIFV0aWxzKSB7XG4gICAgXG4gICAgZnVuY3Rpb24gT3B0Z3JvdXBEYXRhICgkZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICBPcHRncm91cERhdGEuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIFxuICAgIFV0aWxzLkV4dGVuZChPcHRncm91cERhdGEsIFNlbGVjdEFkYXB0ZXIpO1xuICAgIFxuICAgIE9wdGdyb3VwRGF0YS5wcm90b3R5cGUuY3VycmVudCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICB2YXIgZGF0YSA9IFtdO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCc6bm90KC5zZWxlY3RlZC1jdXN0b20pIDpzZWxlY3RlZCwgLnNlbGVjdGVkLWN1c3RvbScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRvcHRpb24gPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIG9wdGlvbiA9IHNlbGYuaXRlbSgkb3B0aW9uKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFvcHRpb24uaGFzT3duUHJvcGVydHkoJ2lkJykpIHtcbiAgICAgICAgICAgICAgICBvcHRpb24uaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZGF0YS5wdXNoKG9wdGlvbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNhbGxiYWNrKGRhdGEpO1xuICAgIH07XG4gICAgXG4gICAgT3B0Z3JvdXBEYXRhLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgICAgICBPcHRncm91cERhdGEuX19zdXBlcl9fLmJpbmQuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgICAgICAgIFxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cblxuICAgICAgICBjb250YWluZXIub24oJ29wdGdyb3VwOnNlbGVjdCcsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgIHNlbGYub3B0Z3JvdXBTZWxlY3QocGFyYW1zLmRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGNvbnRhaW5lci5vbignb3B0Z3JvdXA6dW5zZWxlY3QnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICBzZWxmLm9wdGdyb3VwVW5zZWxlY3QocGFyYW1zLmRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwRGF0YS5wcm90b3R5cGUuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgaWYgKCQoZGF0YS5lbGVtZW50KS5pcygnb3B0Z3JvdXAnKSl7XG4gICAgICAgICAgICB0aGlzLm9wdGdyb3VwU2VsZWN0KGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBPcHRncm91cERhdGEuX19zdXBlcl9fLnNlbGVjdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICBcbiAgICAgICAgdmFyIG9wdGdyb3VwID0gZGF0YS5lbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG9wdGdyb3VwLmNoaWxkcmVuO1xuICAgICAgICB2YXIgYWxsU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhbGxTZWxlY3RlZCA9IGNoaWxkcmVuW2ldLnNlbGVjdGVkO1xuICAgICAgICAgICAgaWYgKCFhbGxTZWxlY3RlZCkgeyBicmVhazsgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoYWxsU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICQob3B0Z3JvdXApLmFkZENsYXNzKCdzZWxlY3RlZC1jdXN0b20nKTtcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwRGF0YS5wcm90b3R5cGUudW5zZWxlY3QgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAoJChkYXRhLmVsZW1lbnQpLmlzKCdvcHRncm91cCcpKXtcbiAgICAgICAgICAgIHRoaXMub3B0Z3JvdXBVbnNlbGVjdChkYXRhKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgT3B0Z3JvdXBEYXRhLl9fc3VwZXJfXy51bnNlbGVjdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICBcbiAgICAgICAgdmFyICRvcHRncm91cCA9ICQoZGF0YS5lbGVtZW50LnBhcmVudEVsZW1lbnQpO1xuICAgICAgICAkb3B0Z3JvdXAucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkLWN1c3RvbScpO1xuICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH07XG4gICAgXG4gICAgT3B0Z3JvdXBEYXRhLnByb3RvdHlwZS5vcHRncm91cFNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBkYXRhLnNlbGVjdGVkID0gdHJ1ZTtcblxuICAgICAgICAkKGRhdGEuZWxlbWVudCkuYWRkQ2xhc3MoJ3NlbGVjdGVkLWN1c3RvbScpO1xuXG4gICAgICAgIHRoaXMuY3VycmVudChmdW5jdGlvbiAoY3VycmVudERhdGEpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSBbXTtcblxuICAgICAgICAgICAgZGF0YSA9IGRhdGEuY2hpbGRyZW4uY29uY2F0KGN1cnJlbnREYXRhKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkYXRhLmxlbmd0aDsgZCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gZGF0YVtkXS5pZDtcblxuICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkoaWQsIHZhbCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbC5wdXNoKGlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuJGVsZW1lbnQudmFsKHZhbCk7XG4gICAgICAgICAgICBzZWxmLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICB9KTtcblxuICAgIH07XG4gICAgXG4gICAgT3B0Z3JvdXBEYXRhLnByb3RvdHlwZS5vcHRncm91cFVuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIFxuICAgICAgICBkYXRhLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICAkKGRhdGEuZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkLWN1c3RvbScpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jdXJyZW50KGZ1bmN0aW9uIChjdXJyZW50RGF0YSkge1xuICAgICAgICAgICAgdmFyIHZhbCA9IFtdO1xuICAgICAgICAgICAgdmFyIGNoaWxkSWRzID0gJC5tYXAoZGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpe1xuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5pZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnREYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gY3VycmVudERhdGFbaV0uaWQ7XG4gICAgXG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShpZCwgY2hpbGRJZHMpID09PSAtMSAgJiYgJC5pbkFycmF5KGlkLCB2YWwpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB2YWwucHVzaChpZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgXG4gICAgICAgICAgICBzZWxmLiRlbGVtZW50LnZhbCh2YWwpO1xuICAgICAgICAgICAgc2VsZi4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gT3B0Z3JvdXBEYXRhO1xufSk7IiwiJC5mbi5zZWxlY3QyLmFtZC5kZWZpbmUoJ29wdGdyb3VwU2VsZWN0aW9uJywgW1xuICAgICdzZWxlY3QyL3NlbGVjdGlvbi9tdWx0aXBsZScsXG4gICAgJ3NlbGVjdDIvc2VsZWN0aW9uL3NlYXJjaCcsXG4gICAgJ3NlbGVjdDIvdXRpbHMnXG5dLCBmdW5jdGlvbiAoTXVsdGlwbGVTZWxlY3Rpb24sIFNlbGVjdGlvblNlYXJjaCwgVXRpbHMpIHtcbiAgICBcbiAgICBmdW5jdGlvbiBPcHRncm91cFNlbGVjdGlvbiAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgT3B0Z3JvdXBTZWxlY3Rpb24uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIFxuICAgIFV0aWxzLkV4dGVuZChPcHRncm91cFNlbGVjdGlvbiwgTXVsdGlwbGVTZWxlY3Rpb24pO1xuICAgIFxuICAgIHZhciBEZWNvcmF0ZWQgPSBVdGlscy5EZWNvcmF0ZShPcHRncm91cFNlbGVjdGlvbiwgU2VsZWN0aW9uU2VhcmNoKTtcbiAgICAgICAgXG4gICAgcmV0dXJuIERlY29yYXRlZDtcbn0pO1xuIiwiJC5mbi5zZWxlY3QyLmFtZC5kZWZpbmUoJ29wdGdyb3VwUmVzdWx0cycsIFtcbiAgICAnc2VsZWN0Mi9yZXN1bHRzJyxcbiAgICAnc2VsZWN0Mi91dGlscydcbl0sIGZ1bmN0aW9uIChSZXN1bHRzQWRhcHRlciwgVXRpbHMpIHtcbiAgICBcbiAgICBmdW5jdGlvbiBPcHRncm91cFJlc3VsdHMgKCkge307XG4gICAgXG4gICAgT3B0Z3JvdXBSZXN1bHRzLnByb3RvdHlwZS5vcHRpb24gPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBkYXRhKSB7XG4gICAgICAgIHZhciBvcHRpb24gPSBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBkYXRhKTtcblxuICAgICAgICBpZiAoZGF0YS5jaGlsZHJlbikge1xuICAgICAgICAgICAgdmFyICRsYWJlbCA9ICQob3B0aW9uKS5maW5kKCcuc2VsZWN0Mi1yZXN1bHRzX19ncm91cCcpO1xuICAgICAgICAgICAgJGxhYmVsLmF0dHIoe1xuICAgICAgICAgICAgICAgICAgJ3JvbGUnOiAndHJlZWl0ZW0nLFxuICAgICAgICAgICAgICAgICAgJ2FyaWEtc2VsZWN0ZWQnOiAnZmFsc2UnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRsYWJlbC5kYXRhKCdkYXRhJywgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wdGlvbjtcbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwUmVzdWx0cy5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJHJlc3VsdHMub24oJ21vdXNldXAnLCAnLnNlbGVjdDItcmVzdWx0c19fZ3JvdXAnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YSgnZGF0YScpO1xuXG4gICAgICAgICAgICB2YXIgdHJpZ2dlciA9ICgkdGhpcy5hdHRyKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJykgID8gJ29wdGdyb3VwOnVuc2VsZWN0JyA6ICdvcHRncm91cDpzZWxlY3QnO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIodHJpZ2dlciwge1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBjb250YWluZXIub24oJ29wdGdyb3VwOnNlbGVjdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghY29udGFpbmVyLmlzT3BlbigpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLnNldENsYXNzZXMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29udGFpbmVyLm9uKCdvcHRncm91cDp1bnNlbGVjdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghY29udGFpbmVyLmlzT3BlbigpKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5zZXRDbGFzc2VzKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgXG4gICAgT3B0Z3JvdXBSZXN1bHRzLnByb3RvdHlwZS5zZXRDbGFzc2VzID0gZnVuY3Rpb24oZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICAgICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcbiAgICAgICAgXG4gICAgICAgIHZhciAkZ3JvdXBzID0gdGhpcy4kcmVzdWx0cy5maW5kKCcuc2VsZWN0Mi1yZXN1bHRzX19ncm91cCcpO1xuICAgICAgICBcbiAgICAgICAgJGdyb3Vwcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkb3B0Z3JvdXAgPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSAkLmRhdGEodGhpcywgJ2RhdGEnKTtcbiAgICAgICAgICAgICRvcHRncm91cC5hdHRyKCdhcmlhLXNlbGVjdGVkJywgJChpdGVtLmVsZW1lbnQpLmhhc0NsYXNzKCdzZWxlY3RlZC1jdXN0b20nKSk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcbiAgICBcbiAgICB2YXIgRGVjb3JhdGVkID0gVXRpbHMuRGVjb3JhdGUoUmVzdWx0c0FkYXB0ZXIsIE9wdGdyb3VwUmVzdWx0cyk7XG4gICAgXG4gICAgcmV0dXJuIERlY29yYXRlZDtcbn0pOyJdfQ==
