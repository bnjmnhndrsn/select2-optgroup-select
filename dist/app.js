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
        data.selected = true;
        $(data.element).addClass('selected-custom');
        var vals = this.$element.val() || [];
        var newVals = $.map(data.children, function(child){
            return '' + child.id;
        });
        
        newVals.forEach(function(val){
            if ($.inArray(val, vals) == -1){
                vals.push(val);
            }
        });
        
        this.$element.val(vals);
        this.$element.trigger('change');
    };
    
    OptgroupData.prototype.optgroupUnselect = function (data) {
        data.selected = false;
        $(data.element).removeClass('selected-custom');
        var vals = this.$element.val() || [];
        var removeVals = $.map(data.children, function(child){
            return '' + child.id;
        });
        var newVals = [];
        
        vals.forEach(function(val){
            if ($.inArray(val, removeVals) == -1){
                newVals.push(val);
            }
        });
        debugger;
        this.$element.val(newVals);
        this.$element.trigger('change');
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
    
    function OptgroupResults () {
        OptgroupResults.__super__.constructor.apply(this, arguments);
    };
    
    Utils.Extend(OptgroupResults, ResultsAdapter);
    
    OptgroupResults.prototype.option = function (data) {
        var option = OptgroupResults.__super__.option.call(this, data);

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
    
    OptgroupResults.prototype.bind = function(container, $container) {
        OptgroupResults.__super__.bind.call(this, container, $container);
        
        var self = this;
        
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
        
        this.$results.on('mouseenter', '.select2-results__group[aria-selected]', function(evt) {
            var data = $(this).data('data');

            self.getHighlightedResults()
                .removeClass('select2-results__option--highlighted');

            self.trigger('results:focus', {
                data: data,
                element: $(this)
            });
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
    
    OptgroupResults.prototype.setClasses = function(container, $container) {
        var self = this;

        this.data.current(function (selected) {
            var selectedIds = [];
            var optgroupLabels = [];
            
            $.each(selected, function (i, obj) {
                if (obj.children) {
                    optgroupLabels.push(obj.text);
                    $.each(obj.children, function(j, child) {
                        selectedIds.push(child.id.toString());
                    });
                } else {
                    selectedIds.push(obj.id.toString());
                }
            });

            var $options = self.$results.find('.select2-results__option[aria-selected]');

            $options.each(function () {
                var $option = $(this);

                var item = $.data(this, 'data');

                // id needs to be converted to a string when comparing
                var id = '' + item.id;

                if ((item.element != null && item.element.selected) || 
                    (item.element == null && $.inArray(id, selectedIds) > -1)) {
                        $option.attr('aria-selected', 'true');
                } else {
                    $option.attr('aria-selected', 'false');
                }
            });

        
            var $groups = self.$results.find('.select2-results__group[aria-selected]');
        
            $groups.each(function () {
                var $optgroup = $(this);
                var item = $.data(this, 'data');
                var text = item.text;
                var $element = $(item.element);

                if ( $element.hasClass('selected-custom') || $.inArray(text, optgroupLabels) > -1) {
                    $optgroup.attr('aria-selected', 'true');
                } else {
                    $optgroup.attr('aria-selected', 'false');
                }
            });
        });

    };
    
    return OptgroupResults;
});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWFpbi5qcyIsImxpYi9hZGFwdGVycy9vcHRncm91cC1kYXRhLmpzIiwibGliL2FkYXB0ZXJzL29wdGdyb3VwLXNlbGVjdGlvbi5qcyIsImxpYi9kZWNvcmF0b3JzL29wdGdyb3VwLXJlc3VsdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuL2FkYXB0ZXJzL29wdGdyb3VwLXNlbGVjdGlvbicpO1xucmVxdWlyZSgnLi9hZGFwdGVycy9vcHRncm91cC1kYXRhJyk7XG5yZXF1aXJlKCcuL2RlY29yYXRvcnMvb3B0Z3JvdXAtcmVzdWx0cycpO1xuXG4kKGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgJC5mbi5zZWxlY3QyLmFtZC5yZXF1aXJlKFtcIm9wdGdyb3VwRGF0YVwiLCBcIm9wdGdyb3VwU2VsZWN0aW9uXCIsIFwib3B0Z3JvdXBSZXN1bHRzXCJdLCBcbiAgICAgICAgZnVuY3Rpb24gKE9wdGdyb3VwRGF0YSwgT3B0Z3JvdXBTZWxlY3Rpb24sIE9wdGdyb3VwUmVzdWx0cykge1xuXG4gICAgICAgICQoJyN0YXJnZXQnKS5zZWxlY3QyKHtcbiAgICAgICAgICAgIGRhdGFBZGFwdGVyOiBPcHRncm91cERhdGEsXG4gICAgICAgICAgICByZXN1bHRzQWRhcHRlcjogT3B0Z3JvdXBSZXN1bHRzLFxuICAgICAgICAgICAgc2VsZWN0aW9uQWRhcHRlcjogT3B0Z3JvdXBTZWxlY3Rpb25cbiAgICAgICAgfSk7IFxuICAgIH0pO1xufSk7XG4iLCIkLmZuLnNlbGVjdDIuYW1kLmRlZmluZSgnb3B0Z3JvdXBEYXRhJywgW1xuICAgICdzZWxlY3QyL2RhdGEvc2VsZWN0JyxcbiAgICAnc2VsZWN0Mi91dGlscydcbl0sIGZ1bmN0aW9uIChTZWxlY3RBZGFwdGVyLCBVdGlscykge1xuICAgIFxuICAgIGZ1bmN0aW9uIE9wdGdyb3VwRGF0YSAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgT3B0Z3JvdXBEYXRhLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBcbiAgICBVdGlscy5FeHRlbmQoT3B0Z3JvdXBEYXRhLCBTZWxlY3RBZGFwdGVyKTtcbiAgICBcbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLmN1cnJlbnQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGRhdGEgPSBbXTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnOm5vdCguc2VsZWN0ZWQtY3VzdG9tKSA6c2VsZWN0ZWQsIC5zZWxlY3RlZC1jdXN0b20nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkb3B0aW9uID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBvcHRpb24gPSBzZWxmLml0ZW0oJG9wdGlvbik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghb3B0aW9uLmhhc093blByb3BlcnR5KCdpZCcpKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9uLmlkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGRhdGEucHVzaChvcHRpb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICBjYWxsYmFjayhkYXRhKTtcbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwRGF0YS5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICAgICAgT3B0Z3JvdXBEYXRhLl9fc3VwZXJfXy5iaW5kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7ICAgICAgICBcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG5cbiAgICAgICAgY29udGFpbmVyLm9uKCdvcHRncm91cDpzZWxlY3QnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICBzZWxmLm9wdGdyb3VwU2VsZWN0KHBhcmFtcy5kYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBjb250YWluZXIub24oJ29wdGdyb3VwOnVuc2VsZWN0JywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgc2VsZi5vcHRncm91cFVuc2VsZWN0KHBhcmFtcy5kYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmICgkKGRhdGEuZWxlbWVudCkuaXMoJ29wdGdyb3VwJykpe1xuICAgICAgICAgICAgdGhpcy5vcHRncm91cFNlbGVjdChkYXRhKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgT3B0Z3JvdXBEYXRhLl9fc3VwZXJfXy5zZWxlY3QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBvcHRncm91cCA9IGRhdGEuZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBvcHRncm91cC5jaGlsZHJlbjtcbiAgICAgICAgdmFyIGFsbFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYWxsU2VsZWN0ZWQgPSBjaGlsZHJlbltpXS5zZWxlY3RlZDtcbiAgICAgICAgICAgIGlmICghYWxsU2VsZWN0ZWQpIHsgYnJlYWs7IH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGFsbFNlbGVjdGVkKSB7XG4gICAgICAgICAgICAkKG9wdGdyb3VwKS5hZGRDbGFzcygnc2VsZWN0ZWQtY3VzdG9tJyk7XG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLnVuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgaWYgKCQoZGF0YS5lbGVtZW50KS5pcygnb3B0Z3JvdXAnKSl7XG4gICAgICAgICAgICB0aGlzLm9wdGdyb3VwVW5zZWxlY3QoZGF0YSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIE9wdGdyb3VwRGF0YS5fX3N1cGVyX18udW5zZWxlY3QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgXG4gICAgICAgIHZhciAkb3B0Z3JvdXAgPSAkKGRhdGEuZWxlbWVudC5wYXJlbnRFbGVtZW50KTtcbiAgICAgICAgJG9wdGdyb3VwLnJlbW92ZUNsYXNzKCdzZWxlY3RlZC1jdXN0b20nKTtcbiAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwRGF0YS5wcm90b3R5cGUub3B0Z3JvdXBTZWxlY3QgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBkYXRhLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgJChkYXRhLmVsZW1lbnQpLmFkZENsYXNzKCdzZWxlY3RlZC1jdXN0b20nKTtcbiAgICAgICAgdmFyIHZhbHMgPSB0aGlzLiRlbGVtZW50LnZhbCgpIHx8IFtdO1xuICAgICAgICB2YXIgbmV3VmFscyA9ICQubWFwKGRhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkKXtcbiAgICAgICAgICAgIHJldHVybiAnJyArIGNoaWxkLmlkO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIG5ld1ZhbHMuZm9yRWFjaChmdW5jdGlvbih2YWwpe1xuICAgICAgICAgICAgaWYgKCQuaW5BcnJheSh2YWwsIHZhbHMpID09IC0xKXtcbiAgICAgICAgICAgICAgICB2YWxzLnB1c2godmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbGVtZW50LnZhbCh2YWxzKTtcbiAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwRGF0YS5wcm90b3R5cGUub3B0Z3JvdXBVbnNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGRhdGEuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgJChkYXRhLmVsZW1lbnQpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZC1jdXN0b20nKTtcbiAgICAgICAgdmFyIHZhbHMgPSB0aGlzLiRlbGVtZW50LnZhbCgpIHx8IFtdO1xuICAgICAgICB2YXIgcmVtb3ZlVmFscyA9ICQubWFwKGRhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkKXtcbiAgICAgICAgICAgIHJldHVybiAnJyArIGNoaWxkLmlkO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIG5ld1ZhbHMgPSBbXTtcbiAgICAgICAgXG4gICAgICAgIHZhbHMuZm9yRWFjaChmdW5jdGlvbih2YWwpe1xuICAgICAgICAgICAgaWYgKCQuaW5BcnJheSh2YWwsIHJlbW92ZVZhbHMpID09IC0xKXtcbiAgICAgICAgICAgICAgICBuZXdWYWxzLnB1c2godmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICB0aGlzLiRlbGVtZW50LnZhbChuZXdWYWxzKTtcbiAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBPcHRncm91cERhdGE7XG59KTsiLCIkLmZuLnNlbGVjdDIuYW1kLmRlZmluZSgnb3B0Z3JvdXBTZWxlY3Rpb24nLCBbXG4gICAgJ3NlbGVjdDIvc2VsZWN0aW9uL211bHRpcGxlJyxcbiAgICAnc2VsZWN0Mi9zZWxlY3Rpb24vc2VhcmNoJyxcbiAgICAnc2VsZWN0Mi91dGlscydcbl0sIGZ1bmN0aW9uIChNdWx0aXBsZVNlbGVjdGlvbiwgU2VsZWN0aW9uU2VhcmNoLCBVdGlscykge1xuICAgIFxuICAgIGZ1bmN0aW9uIE9wdGdyb3VwU2VsZWN0aW9uICgkZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICBPcHRncm91cFNlbGVjdGlvbi5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgXG4gICAgVXRpbHMuRXh0ZW5kKE9wdGdyb3VwU2VsZWN0aW9uLCBNdWx0aXBsZVNlbGVjdGlvbik7XG4gICAgXG4gICAgdmFyIERlY29yYXRlZCA9IFV0aWxzLkRlY29yYXRlKE9wdGdyb3VwU2VsZWN0aW9uLCBTZWxlY3Rpb25TZWFyY2gpO1xuICAgICAgICBcbiAgICByZXR1cm4gRGVjb3JhdGVkO1xufSk7XG4iLCIkLmZuLnNlbGVjdDIuYW1kLmRlZmluZSgnb3B0Z3JvdXBSZXN1bHRzJywgW1xuICAgICdzZWxlY3QyL3Jlc3VsdHMnLFxuICAgICdzZWxlY3QyL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKFJlc3VsdHNBZGFwdGVyLCBVdGlscykge1xuICAgIFxuICAgIGZ1bmN0aW9uIE9wdGdyb3VwUmVzdWx0cyAoKSB7XG4gICAgICAgIE9wdGdyb3VwUmVzdWx0cy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIFxuICAgIFV0aWxzLkV4dGVuZChPcHRncm91cFJlc3VsdHMsIFJlc3VsdHNBZGFwdGVyKTtcbiAgICBcbiAgICBPcHRncm91cFJlc3VsdHMucHJvdG90eXBlLm9wdGlvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHZhciBvcHRpb24gPSBPcHRncm91cFJlc3VsdHMuX19zdXBlcl9fLm9wdGlvbi5jYWxsKHRoaXMsIGRhdGEpO1xuXG4gICAgICAgIGlmIChkYXRhLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICB2YXIgJGxhYmVsID0gJChvcHRpb24pLmZpbmQoJy5zZWxlY3QyLXJlc3VsdHNfX2dyb3VwJyk7XG4gICAgICAgICAgICAkbGFiZWwuYXR0cih7XG4gICAgICAgICAgICAgICAgICAncm9sZSc6ICd0cmVlaXRlbScsXG4gICAgICAgICAgICAgICAgICAnYXJpYS1zZWxlY3RlZCc6ICdmYWxzZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJGxhYmVsLmRhdGEoJ2RhdGEnLCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIG9wdGlvbjtcbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwUmVzdWx0cy5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgICAgICBPcHRncm91cFJlc3VsdHMuX19zdXBlcl9fLmJpbmQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xuICAgICAgICBcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kcmVzdWx0cy5vbignbW91c2V1cCcsICcuc2VsZWN0Mi1yZXN1bHRzX19ncm91cCcsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGRhdGEgPSAkdGhpcy5kYXRhKCdkYXRhJyk7XG5cbiAgICAgICAgICAgIHZhciB0cmlnZ2VyID0gKCR0aGlzLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnKSA9PT0gJ3RydWUnKSAgPyAnb3B0Z3JvdXA6dW5zZWxlY3QnIDogJ29wdGdyb3VwOnNlbGVjdCc7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNlbGYudHJpZ2dlcih0cmlnZ2VyLCB7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0LFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJHJlc3VsdHMub24oJ21vdXNlZW50ZXInLCAnLnNlbGVjdDItcmVzdWx0c19fZ3JvdXBbYXJpYS1zZWxlY3RlZF0nLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gJCh0aGlzKS5kYXRhKCdkYXRhJyk7XG5cbiAgICAgICAgICAgIHNlbGYuZ2V0SGlnaGxpZ2h0ZWRSZXN1bHRzKClcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItcmVzdWx0c19fb3B0aW9uLS1oaWdobGlnaHRlZCcpO1xuXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoJ3Jlc3VsdHM6Zm9jdXMnLCB7XG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAkKHRoaXMpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBjb250YWluZXIub24oJ29wdGdyb3VwOnNlbGVjdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghY29udGFpbmVyLmlzT3BlbigpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLnNldENsYXNzZXMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29udGFpbmVyLm9uKCdvcHRncm91cDp1bnNlbGVjdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghY29udGFpbmVyLmlzT3BlbigpKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5zZXRDbGFzc2VzKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgXG4gICAgT3B0Z3JvdXBSZXN1bHRzLnByb3RvdHlwZS5zZXRDbGFzc2VzID0gZnVuY3Rpb24oY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICB0aGlzLmRhdGEuY3VycmVudChmdW5jdGlvbiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZElkcyA9IFtdO1xuICAgICAgICAgICAgdmFyIG9wdGdyb3VwTGFiZWxzID0gW107XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQuZWFjaChzZWxlY3RlZCwgZnVuY3Rpb24gKGksIG9iaikge1xuICAgICAgICAgICAgICAgIGlmIChvYmouY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0Z3JvdXBMYWJlbHMucHVzaChvYmoudGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChvYmouY2hpbGRyZW4sIGZ1bmN0aW9uKGosIGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZElkcy5wdXNoKGNoaWxkLmlkLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZElkcy5wdXNoKG9iai5pZC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyICRvcHRpb25zID0gc2VsZi4kcmVzdWx0cy5maW5kKCcuc2VsZWN0Mi1yZXN1bHRzX19vcHRpb25bYXJpYS1zZWxlY3RlZF0nKTtcblxuICAgICAgICAgICAgJG9wdGlvbnMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyICRvcHRpb24gPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSAkLmRhdGEodGhpcywgJ2RhdGEnKTtcblxuICAgICAgICAgICAgICAgIC8vIGlkIG5lZWRzIHRvIGJlIGNvbnZlcnRlZCB0byBhIHN0cmluZyB3aGVuIGNvbXBhcmluZ1xuICAgICAgICAgICAgICAgIHZhciBpZCA9ICcnICsgaXRlbS5pZDtcblxuICAgICAgICAgICAgICAgIGlmICgoaXRlbS5lbGVtZW50ICE9IG51bGwgJiYgaXRlbS5lbGVtZW50LnNlbGVjdGVkKSB8fCBcbiAgICAgICAgICAgICAgICAgICAgKGl0ZW0uZWxlbWVudCA9PSBudWxsICYmICQuaW5BcnJheShpZCwgc2VsZWN0ZWRJZHMpID4gLTEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkb3B0aW9uLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRvcHRpb24uYXR0cignYXJpYS1zZWxlY3RlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIFxuICAgICAgICAgICAgdmFyICRncm91cHMgPSBzZWxmLiRyZXN1bHRzLmZpbmQoJy5zZWxlY3QyLXJlc3VsdHNfX2dyb3VwW2FyaWEtc2VsZWN0ZWRdJyk7XG4gICAgICAgIFxuICAgICAgICAgICAgJGdyb3Vwcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJG9wdGdyb3VwID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9ICQuZGF0YSh0aGlzLCAnZGF0YScpO1xuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gaXRlbS50ZXh0O1xuICAgICAgICAgICAgICAgIHZhciAkZWxlbWVudCA9ICQoaXRlbS5lbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIGlmICggJGVsZW1lbnQuaGFzQ2xhc3MoJ3NlbGVjdGVkLWN1c3RvbScpIHx8ICQuaW5BcnJheSh0ZXh0LCBvcHRncm91cExhYmVscykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAkb3B0Z3JvdXAuYXR0cignYXJpYS1zZWxlY3RlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJG9wdGdyb3VwLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBPcHRncm91cFJlc3VsdHM7XG59KTsiXX0=
