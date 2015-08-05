(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./adapters/optgroup-data');
require('./decorators/optgroup-results');

$(function(){
    
    $.fn.select2.amd.require(["optgroupData", "optgroupResults"], 
        function (OptgroupData, OptgroupResults) {

        $('#target').select2({
            dataAdapter: OptgroupData,
            resultsAdapter: OptgroupResults,
            closeOnSelect: false
        }); 
        
        $('select').change(function(){ console.log( $(this).val() ) });
    });
});

},{"./adapters/optgroup-data":2,"./decorators/optgroup-results":3}],2:[function(require,module,exports){
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

        // Change selected property on underlying option element 
        data.selected = true;
        data.element.selected = true;
        
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
        
        this.$element.trigger('change');
    };
    
    OptgroupData.prototype.unselect = function (data) {
        if ($(data.element).is('optgroup')){
            this.optgroupUnselect(data);
            return;
        }
        
        // Change selected property on underlying option element 
        data.selected = false;
        data.element.selected = false;
        
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
        this.$element.val(newVals);
        this.$element.trigger('change');
    };
    
    return OptgroupData;
});
},{}],3:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWFpbi5qcyIsImxpYi9hZGFwdGVycy9vcHRncm91cC1kYXRhLmpzIiwibGliL2RlY29yYXRvcnMvb3B0Z3JvdXAtcmVzdWx0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi9hZGFwdGVycy9vcHRncm91cC1kYXRhJyk7XG5yZXF1aXJlKCcuL2RlY29yYXRvcnMvb3B0Z3JvdXAtcmVzdWx0cycpO1xuXG4kKGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgJC5mbi5zZWxlY3QyLmFtZC5yZXF1aXJlKFtcIm9wdGdyb3VwRGF0YVwiLCBcIm9wdGdyb3VwUmVzdWx0c1wiXSwgXG4gICAgICAgIGZ1bmN0aW9uIChPcHRncm91cERhdGEsIE9wdGdyb3VwUmVzdWx0cykge1xuXG4gICAgICAgICQoJyN0YXJnZXQnKS5zZWxlY3QyKHtcbiAgICAgICAgICAgIGRhdGFBZGFwdGVyOiBPcHRncm91cERhdGEsXG4gICAgICAgICAgICByZXN1bHRzQWRhcHRlcjogT3B0Z3JvdXBSZXN1bHRzLFxuICAgICAgICAgICAgY2xvc2VPblNlbGVjdDogZmFsc2VcbiAgICAgICAgfSk7IFxuICAgICAgICBcbiAgICAgICAgJCgnc2VsZWN0JykuY2hhbmdlKGZ1bmN0aW9uKCl7IGNvbnNvbGUubG9nKCAkKHRoaXMpLnZhbCgpICkgfSk7XG4gICAgfSk7XG59KTtcbiIsIiQuZm4uc2VsZWN0Mi5hbWQuZGVmaW5lKCdvcHRncm91cERhdGEnLCBbXG4gICAgJ3NlbGVjdDIvZGF0YS9zZWxlY3QnLFxuICAgICdzZWxlY3QyL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKFNlbGVjdEFkYXB0ZXIsIFV0aWxzKSB7XG4gICAgXG4gICAgZnVuY3Rpb24gT3B0Z3JvdXBEYXRhICgkZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICBPcHRncm91cERhdGEuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIFxuICAgIFV0aWxzLkV4dGVuZChPcHRncm91cERhdGEsIFNlbGVjdEFkYXB0ZXIpO1xuICAgIFxuICAgIE9wdGdyb3VwRGF0YS5wcm90b3R5cGUuY3VycmVudCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICB2YXIgZGF0YSA9IFtdO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCc6bm90KC5zZWxlY3RlZC1jdXN0b20pIDpzZWxlY3RlZCwgLnNlbGVjdGVkLWN1c3RvbScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRvcHRpb24gPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIG9wdGlvbiA9IHNlbGYuaXRlbSgkb3B0aW9uKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFvcHRpb24uaGFzT3duUHJvcGVydHkoJ2lkJykpIHtcbiAgICAgICAgICAgICAgICBvcHRpb24uaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZGF0YS5wdXNoKG9wdGlvbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNhbGxiYWNrKGRhdGEpO1xuICAgIH07XG4gICAgXG4gICAgT3B0Z3JvdXBEYXRhLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgICAgICBPcHRncm91cERhdGEuX19zdXBlcl9fLmJpbmQuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgICAgICAgIFxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cblxuICAgICAgICBjb250YWluZXIub24oJ29wdGdyb3VwOnNlbGVjdCcsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgIHNlbGYub3B0Z3JvdXBTZWxlY3QocGFyYW1zLmRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGNvbnRhaW5lci5vbignb3B0Z3JvdXA6dW5zZWxlY3QnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICBzZWxmLm9wdGdyb3VwVW5zZWxlY3QocGFyYW1zLmRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwRGF0YS5wcm90b3R5cGUuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgaWYgKCQoZGF0YS5lbGVtZW50KS5pcygnb3B0Z3JvdXAnKSl7XG4gICAgICAgICAgICB0aGlzLm9wdGdyb3VwU2VsZWN0KGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hhbmdlIHNlbGVjdGVkIHByb3BlcnR5IG9uIHVuZGVybHlpbmcgb3B0aW9uIGVsZW1lbnQgXG4gICAgICAgIGRhdGEuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICBkYXRhLmVsZW1lbnQuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICBcbiAgICAgICAgdmFyIG9wdGdyb3VwID0gZGF0YS5lbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IG9wdGdyb3VwLmNoaWxkcmVuO1xuICAgICAgICBcbiAgICAgICAgdmFyIGFsbFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFsbFNlbGVjdGVkID0gY2hpbGRyZW5baV0uc2VsZWN0ZWQ7XG4gICAgICAgICAgICBpZiAoIWFsbFNlbGVjdGVkKSB7IGJyZWFrOyB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChhbGxTZWxlY3RlZCkge1xuICAgICAgICAgICAgJChvcHRncm91cCkuYWRkQ2xhc3MoJ3NlbGVjdGVkLWN1c3RvbScpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH07XG4gICAgXG4gICAgT3B0Z3JvdXBEYXRhLnByb3RvdHlwZS51bnNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmICgkKGRhdGEuZWxlbWVudCkuaXMoJ29wdGdyb3VwJykpe1xuICAgICAgICAgICAgdGhpcy5vcHRncm91cFVuc2VsZWN0KGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBDaGFuZ2Ugc2VsZWN0ZWQgcHJvcGVydHkgb24gdW5kZXJseWluZyBvcHRpb24gZWxlbWVudCBcbiAgICAgICAgZGF0YS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICBkYXRhLmVsZW1lbnQuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIHZhciAkb3B0Z3JvdXAgPSAkKGRhdGEuZWxlbWVudC5wYXJlbnRFbGVtZW50KTtcbiAgICAgICAgJG9wdGdyb3VwLnJlbW92ZUNsYXNzKCdzZWxlY3RlZC1jdXN0b20nKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLm9wdGdyb3VwU2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgZGF0YS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICQoZGF0YS5lbGVtZW50KS5hZGRDbGFzcygnc2VsZWN0ZWQtY3VzdG9tJyk7XG4gICAgICAgIHZhciB2YWxzID0gdGhpcy4kZWxlbWVudC52YWwoKSB8fCBbXTtcbiAgICAgICAgdmFyIG5ld1ZhbHMgPSAkLm1hcChkYXRhLmNoaWxkcmVuLCBmdW5jdGlvbihjaGlsZCl7XG4gICAgICAgICAgICByZXR1cm4gJycgKyBjaGlsZC5pZDtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBuZXdWYWxzLmZvckVhY2goZnVuY3Rpb24odmFsKXtcbiAgICAgICAgICAgIGlmICgkLmluQXJyYXkodmFsLCB2YWxzKSA9PSAtMSl7XG4gICAgICAgICAgICAgICAgdmFscy5wdXNoKHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWxlbWVudC52YWwodmFscyk7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLm9wdGdyb3VwVW5zZWxlY3QgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBkYXRhLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICQoZGF0YS5lbGVtZW50KS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQtY3VzdG9tJyk7XG4gICAgICAgIHZhciB2YWxzID0gdGhpcy4kZWxlbWVudC52YWwoKSB8fCBbXTtcbiAgICAgICAgdmFyIHJlbW92ZVZhbHMgPSAkLm1hcChkYXRhLmNoaWxkcmVuLCBmdW5jdGlvbihjaGlsZCl7XG4gICAgICAgICAgICByZXR1cm4gJycgKyBjaGlsZC5pZDtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBuZXdWYWxzID0gW107XG4gICAgICAgIFxuICAgICAgICB2YWxzLmZvckVhY2goZnVuY3Rpb24odmFsKXtcbiAgICAgICAgICAgIGlmICgkLmluQXJyYXkodmFsLCByZW1vdmVWYWxzKSA9PSAtMSl7XG4gICAgICAgICAgICAgICAgbmV3VmFscy5wdXNoKHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLiRlbGVtZW50LnZhbChuZXdWYWxzKTtcbiAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBPcHRncm91cERhdGE7XG59KTsiLCIkLmZuLnNlbGVjdDIuYW1kLmRlZmluZSgnb3B0Z3JvdXBSZXN1bHRzJywgW1xuICAgICdzZWxlY3QyL3Jlc3VsdHMnLFxuICAgICdzZWxlY3QyL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKFJlc3VsdHNBZGFwdGVyLCBVdGlscykge1xuICAgIFxuICAgIGZ1bmN0aW9uIE9wdGdyb3VwUmVzdWx0cyAoKSB7XG4gICAgICAgIE9wdGdyb3VwUmVzdWx0cy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIFxuICAgIFV0aWxzLkV4dGVuZChPcHRncm91cFJlc3VsdHMsIFJlc3VsdHNBZGFwdGVyKTtcbiAgICBcbiAgICBPcHRncm91cFJlc3VsdHMucHJvdG90eXBlLm9wdGlvbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHZhciBvcHRpb24gPSBPcHRncm91cFJlc3VsdHMuX19zdXBlcl9fLm9wdGlvbi5jYWxsKHRoaXMsIGRhdGEpO1xuXG4gICAgICAgIGlmIChkYXRhLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICB2YXIgJGxhYmVsID0gJChvcHRpb24pLmZpbmQoJy5zZWxlY3QyLXJlc3VsdHNfX2dyb3VwJyk7XG4gICAgICAgICAgICAkbGFiZWwuYXR0cih7XG4gICAgICAgICAgICAgICAgICAncm9sZSc6ICd0cmVlaXRlbScsXG4gICAgICAgICAgICAgICAgICAnYXJpYS1zZWxlY3RlZCc6ICdmYWxzZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJGxhYmVsLmRhdGEoJ2RhdGEnLCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIG9wdGlvbjtcbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwUmVzdWx0cy5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgICAgICBPcHRncm91cFJlc3VsdHMuX19zdXBlcl9fLmJpbmQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRyZXN1bHRzLm9uKCdtb3VzZXVwJywgJy5zZWxlY3QyLXJlc3VsdHNfX2dyb3VwJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgZGF0YSA9ICR0aGlzLmRhdGEoJ2RhdGEnKTtcblxuICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSAoJHRoaXMuYXR0cignYXJpYS1zZWxlY3RlZCcpID09PSAndHJ1ZScpICA/ICdvcHRncm91cDp1bnNlbGVjdCcgOiAnb3B0Z3JvdXA6c2VsZWN0JztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKHRyaWdnZXIsIHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnQsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kcmVzdWx0cy5vbignbW91c2VlbnRlcicsICcuc2VsZWN0Mi1yZXN1bHRzX19ncm91cFthcmlhLXNlbGVjdGVkXScsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSAkKHRoaXMpLmRhdGEoJ2RhdGEnKTtcblxuICAgICAgICAgICAgc2VsZi5nZXRIaWdobGlnaHRlZFJlc3VsdHMoKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2VsZWN0Mi1yZXN1bHRzX19vcHRpb24tLWhpZ2hsaWdodGVkJyk7XG5cbiAgICAgICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czpmb2N1cycsIHtcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICQodGhpcylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGNvbnRhaW5lci5vbignb3B0Z3JvdXA6c2VsZWN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFjb250YWluZXIuaXNPcGVuKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuc2V0Q2xhc3NlcygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb250YWluZXIub24oJ29wdGdyb3VwOnVuc2VsZWN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFjb250YWluZXIuaXNPcGVuKCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLnNldENsYXNzZXMoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cFJlc3VsdHMucHJvdG90eXBlLnNldENsYXNzZXMgPSBmdW5jdGlvbihjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuZGF0YS5jdXJyZW50KGZ1bmN0aW9uIChzZWxlY3RlZCkge1xuICAgICAgICAgICAgdmFyIHNlbGVjdGVkSWRzID0gW107XG4gICAgICAgICAgICB2YXIgb3B0Z3JvdXBMYWJlbHMgPSBbXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJC5lYWNoKHNlbGVjdGVkLCBmdW5jdGlvbiAoaSwgb2JqKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iai5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICBvcHRncm91cExhYmVscy5wdXNoKG9iai50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKG9iai5jaGlsZHJlbiwgZnVuY3Rpb24oaiwgY2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSWRzLnB1c2goY2hpbGQuaWQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSWRzLnB1c2gob2JqLmlkLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgJG9wdGlvbnMgPSBzZWxmLiRyZXN1bHRzLmZpbmQoJy5zZWxlY3QyLXJlc3VsdHNfX29wdGlvblthcmlhLXNlbGVjdGVkXScpO1xuXG4gICAgICAgICAgICAkb3B0aW9ucy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJG9wdGlvbiA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9ICQuZGF0YSh0aGlzLCAnZGF0YScpO1xuXG4gICAgICAgICAgICAgICAgLy8gaWQgbmVlZHMgdG8gYmUgY29udmVydGVkIHRvIGEgc3RyaW5nIHdoZW4gY29tcGFyaW5nXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gJycgKyBpdGVtLmlkO1xuXG4gICAgICAgICAgICAgICAgaWYgKChpdGVtLmVsZW1lbnQgIT0gbnVsbCAmJiBpdGVtLmVsZW1lbnQuc2VsZWN0ZWQpIHx8IFxuICAgICAgICAgICAgICAgICAgICAoaXRlbS5lbGVtZW50ID09IG51bGwgJiYgJC5pbkFycmF5KGlkLCBzZWxlY3RlZElkcykgPiAtMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRvcHRpb24uYXR0cignYXJpYS1zZWxlY3RlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJG9wdGlvbi5hdHRyKCdhcmlhLXNlbGVjdGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgXG4gICAgICAgICAgICB2YXIgJGdyb3VwcyA9IHNlbGYuJHJlc3VsdHMuZmluZCgnLnNlbGVjdDItcmVzdWx0c19fZ3JvdXBbYXJpYS1zZWxlY3RlZF0nKTtcbiAgICAgICAgXG4gICAgICAgICAgICAkZ3JvdXBzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciAkb3B0Z3JvdXAgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gJC5kYXRhKHRoaXMsICdkYXRhJyk7XG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSBpdGVtLnRleHQ7XG4gICAgICAgICAgICAgICAgdmFyICRlbGVtZW50ID0gJChpdGVtLmVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0ZWQtY3VzdG9tJykgfHwgJC5pbkFycmF5KHRleHQsIG9wdGdyb3VwTGFiZWxzKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICRvcHRncm91cC5hdHRyKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkb3B0Z3JvdXAuYXR0cignYXJpYS1zZWxlY3RlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIE9wdGdyb3VwUmVzdWx0cztcbn0pOyJdfQ==
