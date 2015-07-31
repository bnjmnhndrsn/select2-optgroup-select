(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./adapters/optgroup-data');
require('./decorators/optgroup-results');

$(function(){
    
    $.fn.select2.amd.require(["optgroupData", "optgroupResults"], 
        function (OptgroupData, OptgroupResults) {

        $('#target').select2({
            dataAdapter: OptgroupData,
            resultsAdapter: OptgroupResults
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
        
        container.listeners['results:select'] = [];
        debugger;
        container.on('results:select', function () {
          var $highlighted = self.getHighlightedResults();
          console.log('select');
          if ($highlighted.length === 0) {
            return;
          }

          var data = $highlighted.data('data');

          if (!$highlighted.attr('aria-selected') == 'true') {  
            self.trigger('select', {
              data: data
            });
          }
        });
        
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWFpbi5qcyIsImxpYi9hZGFwdGVycy9vcHRncm91cC1kYXRhLmpzIiwibGliL2RlY29yYXRvcnMvb3B0Z3JvdXAtcmVzdWx0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi9hZGFwdGVycy9vcHRncm91cC1kYXRhJyk7XG5yZXF1aXJlKCcuL2RlY29yYXRvcnMvb3B0Z3JvdXAtcmVzdWx0cycpO1xuXG4kKGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgJC5mbi5zZWxlY3QyLmFtZC5yZXF1aXJlKFtcIm9wdGdyb3VwRGF0YVwiLCBcIm9wdGdyb3VwUmVzdWx0c1wiXSwgXG4gICAgICAgIGZ1bmN0aW9uIChPcHRncm91cERhdGEsIE9wdGdyb3VwUmVzdWx0cykge1xuXG4gICAgICAgICQoJyN0YXJnZXQnKS5zZWxlY3QyKHtcbiAgICAgICAgICAgIGRhdGFBZGFwdGVyOiBPcHRncm91cERhdGEsXG4gICAgICAgICAgICByZXN1bHRzQWRhcHRlcjogT3B0Z3JvdXBSZXN1bHRzXG4gICAgICAgIH0pOyBcbiAgICAgICAgXG4gICAgICAgICQoJ3NlbGVjdCcpLmNoYW5nZShmdW5jdGlvbigpeyBjb25zb2xlLmxvZyggJCh0aGlzKS52YWwoKSApIH0pO1xuICAgIH0pO1xufSk7XG4iLCIkLmZuLnNlbGVjdDIuYW1kLmRlZmluZSgnb3B0Z3JvdXBEYXRhJywgW1xuICAgICdzZWxlY3QyL2RhdGEvc2VsZWN0JyxcbiAgICAnc2VsZWN0Mi91dGlscydcbl0sIGZ1bmN0aW9uIChTZWxlY3RBZGFwdGVyLCBVdGlscykge1xuICAgIFxuICAgIGZ1bmN0aW9uIE9wdGdyb3VwRGF0YSAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgT3B0Z3JvdXBEYXRhLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBcbiAgICBVdGlscy5FeHRlbmQoT3B0Z3JvdXBEYXRhLCBTZWxlY3RBZGFwdGVyKTtcbiAgICBcbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLmN1cnJlbnQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGRhdGEgPSBbXTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnOm5vdCguc2VsZWN0ZWQtY3VzdG9tKSA6c2VsZWN0ZWQsIC5zZWxlY3RlZC1jdXN0b20nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkb3B0aW9uID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBvcHRpb24gPSBzZWxmLml0ZW0oJG9wdGlvbik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghb3B0aW9uLmhhc093blByb3BlcnR5KCdpZCcpKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9uLmlkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGRhdGEucHVzaChvcHRpb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICBjYWxsYmFjayhkYXRhKTtcbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwRGF0YS5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICAgICAgT3B0Z3JvdXBEYXRhLl9fc3VwZXJfXy5iaW5kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7ICAgICAgICBcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG5cbiAgICAgICAgY29udGFpbmVyLm9uKCdvcHRncm91cDpzZWxlY3QnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICBzZWxmLm9wdGdyb3VwU2VsZWN0KHBhcmFtcy5kYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBjb250YWluZXIub24oJ29wdGdyb3VwOnVuc2VsZWN0JywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgc2VsZi5vcHRncm91cFVuc2VsZWN0KHBhcmFtcy5kYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmICgkKGRhdGEuZWxlbWVudCkuaXMoJ29wdGdyb3VwJykpe1xuICAgICAgICAgICAgdGhpcy5vcHRncm91cFNlbGVjdChkYXRhKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoYW5nZSBzZWxlY3RlZCBwcm9wZXJ0eSBvbiB1bmRlcmx5aW5nIG9wdGlvbiBlbGVtZW50IFxuICAgICAgICBkYXRhLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgZGF0YS5lbGVtZW50LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIHZhciBvcHRncm91cCA9IGRhdGEuZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBvcHRncm91cC5jaGlsZHJlbjtcbiAgICAgICAgXG4gICAgICAgIHZhciBhbGxTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhbGxTZWxlY3RlZCA9IGNoaWxkcmVuW2ldLnNlbGVjdGVkO1xuICAgICAgICAgICAgaWYgKCFhbGxTZWxlY3RlZCkgeyBicmVhazsgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoYWxsU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICQob3B0Z3JvdXApLmFkZENsYXNzKCdzZWxlY3RlZC1jdXN0b20nKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwRGF0YS5wcm90b3R5cGUudW5zZWxlY3QgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAoJChkYXRhLmVsZW1lbnQpLmlzKCdvcHRncm91cCcpKXtcbiAgICAgICAgICAgIHRoaXMub3B0Z3JvdXBVbnNlbGVjdChkYXRhKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gQ2hhbmdlIHNlbGVjdGVkIHByb3BlcnR5IG9uIHVuZGVybHlpbmcgb3B0aW9uIGVsZW1lbnQgXG4gICAgICAgIGRhdGEuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgZGF0YS5lbGVtZW50LnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICB2YXIgJG9wdGdyb3VwID0gJChkYXRhLmVsZW1lbnQucGFyZW50RWxlbWVudCk7XG4gICAgICAgICRvcHRncm91cC5yZW1vdmVDbGFzcygnc2VsZWN0ZWQtY3VzdG9tJyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH07XG4gICAgXG4gICAgT3B0Z3JvdXBEYXRhLnByb3RvdHlwZS5vcHRncm91cFNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGRhdGEuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAkKGRhdGEuZWxlbWVudCkuYWRkQ2xhc3MoJ3NlbGVjdGVkLWN1c3RvbScpO1xuICAgICAgICB2YXIgdmFscyA9IHRoaXMuJGVsZW1lbnQudmFsKCkgfHwgW107XG4gICAgICAgIHZhciBuZXdWYWxzID0gJC5tYXAoZGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpe1xuICAgICAgICAgICAgcmV0dXJuICcnICsgY2hpbGQuaWQ7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgbmV3VmFscy5mb3JFYWNoKGZ1bmN0aW9uKHZhbCl7XG4gICAgICAgICAgICBpZiAoJC5pbkFycmF5KHZhbCwgdmFscykgPT0gLTEpe1xuICAgICAgICAgICAgICAgIHZhbHMucHVzaCh2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsZW1lbnQudmFsKHZhbHMpO1xuICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH07XG4gICAgXG4gICAgT3B0Z3JvdXBEYXRhLnByb3RvdHlwZS5vcHRncm91cFVuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgZGF0YS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAkKGRhdGEuZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkLWN1c3RvbScpO1xuICAgICAgICB2YXIgdmFscyA9IHRoaXMuJGVsZW1lbnQudmFsKCkgfHwgW107XG4gICAgICAgIHZhciByZW1vdmVWYWxzID0gJC5tYXAoZGF0YS5jaGlsZHJlbiwgZnVuY3Rpb24oY2hpbGQpe1xuICAgICAgICAgICAgcmV0dXJuICcnICsgY2hpbGQuaWQ7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgbmV3VmFscyA9IFtdO1xuICAgICAgICBcbiAgICAgICAgdmFscy5mb3JFYWNoKGZ1bmN0aW9uKHZhbCl7XG4gICAgICAgICAgICBpZiAoJC5pbkFycmF5KHZhbCwgcmVtb3ZlVmFscykgPT0gLTEpe1xuICAgICAgICAgICAgICAgIG5ld1ZhbHMucHVzaCh2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy4kZWxlbWVudC52YWwobmV3VmFscyk7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gT3B0Z3JvdXBEYXRhO1xufSk7IiwiJC5mbi5zZWxlY3QyLmFtZC5kZWZpbmUoJ29wdGdyb3VwUmVzdWx0cycsIFtcbiAgICAnc2VsZWN0Mi9yZXN1bHRzJyxcbiAgICAnc2VsZWN0Mi91dGlscydcbl0sIGZ1bmN0aW9uIChSZXN1bHRzQWRhcHRlciwgVXRpbHMpIHtcbiAgICBcbiAgICBmdW5jdGlvbiBPcHRncm91cFJlc3VsdHMgKCkge1xuICAgICAgICBPcHRncm91cFJlc3VsdHMuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBcbiAgICBVdGlscy5FeHRlbmQoT3B0Z3JvdXBSZXN1bHRzLCBSZXN1bHRzQWRhcHRlcik7XG4gICAgXG4gICAgT3B0Z3JvdXBSZXN1bHRzLnByb3RvdHlwZS5vcHRpb24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICB2YXIgb3B0aW9uID0gT3B0Z3JvdXBSZXN1bHRzLl9fc3VwZXJfXy5vcHRpb24uY2FsbCh0aGlzLCBkYXRhKTtcblxuICAgICAgICBpZiAoZGF0YS5jaGlsZHJlbikge1xuICAgICAgICAgICAgdmFyICRsYWJlbCA9ICQob3B0aW9uKS5maW5kKCcuc2VsZWN0Mi1yZXN1bHRzX19ncm91cCcpO1xuICAgICAgICAgICAgJGxhYmVsLmF0dHIoe1xuICAgICAgICAgICAgICAgICAgJ3JvbGUnOiAndHJlZWl0ZW0nLFxuICAgICAgICAgICAgICAgICAgJ2FyaWEtc2VsZWN0ZWQnOiAnZmFsc2UnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRsYWJlbC5kYXRhKCdkYXRhJywgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBvcHRpb247XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cFJlc3VsdHMucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbihjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICAgICAgT3B0Z3JvdXBSZXN1bHRzLl9fc3VwZXJfXy5iaW5kLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIGNvbnRhaW5lci5saXN0ZW5lcnNbJ3Jlc3VsdHM6c2VsZWN0J10gPSBbXTtcbiAgICAgICAgZGVidWdnZXI7XG4gICAgICAgIGNvbnRhaW5lci5vbigncmVzdWx0czpzZWxlY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyICRoaWdobGlnaHRlZCA9IHNlbGYuZ2V0SGlnaGxpZ2h0ZWRSZXN1bHRzKCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3NlbGVjdCcpO1xuICAgICAgICAgIGlmICgkaGlnaGxpZ2h0ZWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGRhdGEgPSAkaGlnaGxpZ2h0ZWQuZGF0YSgnZGF0YScpO1xuXG4gICAgICAgICAgaWYgKCEkaGlnaGxpZ2h0ZWQuYXR0cignYXJpYS1zZWxlY3RlZCcpID09ICd0cnVlJykgeyAgXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoJ3NlbGVjdCcsIHtcbiAgICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJHJlc3VsdHMub24oJ21vdXNldXAnLCAnLnNlbGVjdDItcmVzdWx0c19fZ3JvdXAnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YSgnZGF0YScpO1xuXG4gICAgICAgICAgICB2YXIgdHJpZ2dlciA9ICgkdGhpcy5hdHRyKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJykgID8gJ29wdGdyb3VwOnVuc2VsZWN0JyA6ICdvcHRncm91cDpzZWxlY3QnO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIodHJpZ2dlciwge1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRyZXN1bHRzLm9uKCdtb3VzZWVudGVyJywgJy5zZWxlY3QyLXJlc3VsdHNfX2dyb3VwW2FyaWEtc2VsZWN0ZWRdJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9ICQodGhpcykuZGF0YSgnZGF0YScpO1xuXG4gICAgICAgICAgICBzZWxmLmdldEhpZ2hsaWdodGVkUmVzdWx0cygpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzZWxlY3QyLXJlc3VsdHNfX29wdGlvbi0taGlnaGxpZ2h0ZWQnKTtcblxuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOmZvY3VzJywge1xuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgZWxlbWVudDogJCh0aGlzKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgY29udGFpbmVyLm9uKCdvcHRncm91cDpzZWxlY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWNvbnRhaW5lci5pc09wZW4oKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5zZXRDbGFzc2VzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnRhaW5lci5vbignb3B0Z3JvdXA6dW5zZWxlY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWNvbnRhaW5lci5pc09wZW4oKSkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuc2V0Q2xhc3NlcygpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwUmVzdWx0cy5wcm90b3R5cGUuc2V0Q2xhc3NlcyA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5kYXRhLmN1cnJlbnQoZnVuY3Rpb24gKHNlbGVjdGVkKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRJZHMgPSBbXTtcbiAgICAgICAgICAgIHZhciBvcHRncm91cExhYmVscyA9IFtdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkLmVhY2goc2VsZWN0ZWQsIGZ1bmN0aW9uIChpLCBvYmopIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGdyb3VwTGFiZWxzLnB1c2gob2JqLnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2gob2JqLmNoaWxkcmVuLCBmdW5jdGlvbihqLCBjaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJZHMucHVzaChjaGlsZC5pZC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJZHMucHVzaChvYmouaWQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciAkb3B0aW9ucyA9IHNlbGYuJHJlc3VsdHMuZmluZCgnLnNlbGVjdDItcmVzdWx0c19fb3B0aW9uW2FyaWEtc2VsZWN0ZWRdJyk7XG5cbiAgICAgICAgICAgICRvcHRpb25zLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciAkb3B0aW9uID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gJC5kYXRhKHRoaXMsICdkYXRhJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBpZCBuZWVkcyB0byBiZSBjb252ZXJ0ZWQgdG8gYSBzdHJpbmcgd2hlbiBjb21wYXJpbmdcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSAnJyArIGl0ZW0uaWQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoKGl0ZW0uZWxlbWVudCAhPSBudWxsICYmIGl0ZW0uZWxlbWVudC5zZWxlY3RlZCkgfHwgXG4gICAgICAgICAgICAgICAgICAgIChpdGVtLmVsZW1lbnQgPT0gbnVsbCAmJiAkLmluQXJyYXkoaWQsIHNlbGVjdGVkSWRzKSA+IC0xKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJG9wdGlvbi5hdHRyKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkb3B0aW9uLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBcbiAgICAgICAgICAgIHZhciAkZ3JvdXBzID0gc2VsZi4kcmVzdWx0cy5maW5kKCcuc2VsZWN0Mi1yZXN1bHRzX19ncm91cFthcmlhLXNlbGVjdGVkXScpO1xuICAgICAgICBcbiAgICAgICAgICAgICRncm91cHMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyICRvcHRncm91cCA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSAkLmRhdGEodGhpcywgJ2RhdGEnKTtcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IGl0ZW0udGV4dDtcbiAgICAgICAgICAgICAgICB2YXIgJGVsZW1lbnQgPSAkKGl0ZW0uZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoICRlbGVtZW50Lmhhc0NsYXNzKCdzZWxlY3RlZC1jdXN0b20nKSB8fCAkLmluQXJyYXkodGV4dCwgb3B0Z3JvdXBMYWJlbHMpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgJG9wdGdyb3VwLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRvcHRncm91cC5hdHRyKCdhcmlhLXNlbGVjdGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gT3B0Z3JvdXBSZXN1bHRzO1xufSk7Il19
