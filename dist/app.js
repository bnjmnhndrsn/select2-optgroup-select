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
            
            if (self.options.options.closeOnSelect) {
                self.trigger('close');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWFpbi5qcyIsImxpYi9hZGFwdGVycy9vcHRncm91cC1kYXRhLmpzIiwibGliL2RlY29yYXRvcnMvb3B0Z3JvdXAtcmVzdWx0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuL2FkYXB0ZXJzL29wdGdyb3VwLWRhdGEnKTtcbnJlcXVpcmUoJy4vZGVjb3JhdG9ycy9vcHRncm91cC1yZXN1bHRzJyk7XG5cbiQoZnVuY3Rpb24oKXtcbiAgICBcbiAgICAkLmZuLnNlbGVjdDIuYW1kLnJlcXVpcmUoW1wib3B0Z3JvdXBEYXRhXCIsIFwib3B0Z3JvdXBSZXN1bHRzXCJdLCBcbiAgICAgICAgZnVuY3Rpb24gKE9wdGdyb3VwRGF0YSwgT3B0Z3JvdXBSZXN1bHRzKSB7XG5cbiAgICAgICAgJCgnI3RhcmdldCcpLnNlbGVjdDIoe1xuICAgICAgICAgICAgZGF0YUFkYXB0ZXI6IE9wdGdyb3VwRGF0YSxcbiAgICAgICAgICAgIHJlc3VsdHNBZGFwdGVyOiBPcHRncm91cFJlc3VsdHMsXG4gICAgICAgICAgICBjbG9zZU9uU2VsZWN0OiBmYWxzZVxuICAgICAgICB9KTsgXG4gICAgICAgIFxuICAgICAgICAkKCdzZWxlY3QnKS5jaGFuZ2UoZnVuY3Rpb24oKXsgY29uc29sZS5sb2coICQodGhpcykudmFsKCkgKSB9KTtcbiAgICB9KTtcbn0pO1xuIiwiJC5mbi5zZWxlY3QyLmFtZC5kZWZpbmUoJ29wdGdyb3VwRGF0YScsIFtcbiAgICAnc2VsZWN0Mi9kYXRhL3NlbGVjdCcsXG4gICAgJ3NlbGVjdDIvdXRpbHMnXG5dLCBmdW5jdGlvbiAoU2VsZWN0QWRhcHRlciwgVXRpbHMpIHtcbiAgICBcbiAgICBmdW5jdGlvbiBPcHRncm91cERhdGEgKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgIE9wdGdyb3VwRGF0YS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgXG4gICAgVXRpbHMuRXh0ZW5kKE9wdGdyb3VwRGF0YSwgU2VsZWN0QWRhcHRlcik7XG4gICAgXG4gICAgT3B0Z3JvdXBEYXRhLnByb3RvdHlwZS5jdXJyZW50ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBkYXRhID0gW107XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICB0aGlzLiRlbGVtZW50LmZpbmQoJzpub3QoLnNlbGVjdGVkLWN1c3RvbSkgOnNlbGVjdGVkLCAuc2VsZWN0ZWQtY3VzdG9tJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJG9wdGlvbiA9ICQodGhpcyk7XG4gICAgICAgICAgICB2YXIgb3B0aW9uID0gc2VsZi5pdGVtKCRvcHRpb24pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIW9wdGlvbi5oYXNPd25Qcm9wZXJ0eSgnaWQnKSkge1xuICAgICAgICAgICAgICAgIG9wdGlvbi5pZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBkYXRhLnB1c2gob3B0aW9uKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgICAgIE9wdGdyb3VwRGF0YS5fX3N1cGVyX18uYmluZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyAgICAgICAgXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuXG4gICAgICAgIGNvbnRhaW5lci5vbignb3B0Z3JvdXA6c2VsZWN0JywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgc2VsZi5vcHRncm91cFNlbGVjdChwYXJhbXMuZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgY29udGFpbmVyLm9uKCdvcHRncm91cDp1bnNlbGVjdCcsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgIHNlbGYub3B0Z3JvdXBVbnNlbGVjdChwYXJhbXMuZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgXG4gICAgT3B0Z3JvdXBEYXRhLnByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAoJChkYXRhLmVsZW1lbnQpLmlzKCdvcHRncm91cCcpKXtcbiAgICAgICAgICAgIHRoaXMub3B0Z3JvdXBTZWxlY3QoZGF0YSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGFuZ2Ugc2VsZWN0ZWQgcHJvcGVydHkgb24gdW5kZXJseWluZyBvcHRpb24gZWxlbWVudCBcbiAgICAgICAgZGF0YS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIGRhdGEuZWxlbWVudC5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICB2YXIgb3B0Z3JvdXAgPSBkYXRhLmVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gb3B0Z3JvdXAuY2hpbGRyZW47XG4gICAgICAgIFxuICAgICAgICB2YXIgYWxsU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICBcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYWxsU2VsZWN0ZWQgPSBjaGlsZHJlbltpXS5zZWxlY3RlZDtcbiAgICAgICAgICAgIGlmICghYWxsU2VsZWN0ZWQpIHsgYnJlYWs7IH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGFsbFNlbGVjdGVkKSB7XG4gICAgICAgICAgICAkKG9wdGdyb3VwKS5hZGRDbGFzcygnc2VsZWN0ZWQtY3VzdG9tJyk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLnVuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgaWYgKCQoZGF0YS5lbGVtZW50KS5pcygnb3B0Z3JvdXAnKSl7XG4gICAgICAgICAgICB0aGlzLm9wdGdyb3VwVW5zZWxlY3QoZGF0YSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIENoYW5nZSBzZWxlY3RlZCBwcm9wZXJ0eSBvbiB1bmRlcmx5aW5nIG9wdGlvbiBlbGVtZW50IFxuICAgICAgICBkYXRhLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIGRhdGEuZWxlbWVudC5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgdmFyICRvcHRncm91cCA9ICQoZGF0YS5lbGVtZW50LnBhcmVudEVsZW1lbnQpO1xuICAgICAgICAkb3B0Z3JvdXAucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkLWN1c3RvbScpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwRGF0YS5wcm90b3R5cGUub3B0Z3JvdXBTZWxlY3QgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBkYXRhLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgJChkYXRhLmVsZW1lbnQpLmFkZENsYXNzKCdzZWxlY3RlZC1jdXN0b20nKTtcbiAgICAgICAgdmFyIHZhbHMgPSB0aGlzLiRlbGVtZW50LnZhbCgpIHx8IFtdO1xuICAgICAgICB2YXIgbmV3VmFscyA9ICQubWFwKGRhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkKXtcbiAgICAgICAgICAgIHJldHVybiAnJyArIGNoaWxkLmlkO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIG5ld1ZhbHMuZm9yRWFjaChmdW5jdGlvbih2YWwpe1xuICAgICAgICAgICAgaWYgKCQuaW5BcnJheSh2YWwsIHZhbHMpID09IC0xKXtcbiAgICAgICAgICAgICAgICB2YWxzLnB1c2godmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbGVtZW50LnZhbCh2YWxzKTtcbiAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwRGF0YS5wcm90b3R5cGUub3B0Z3JvdXBVbnNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGRhdGEuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgJChkYXRhLmVsZW1lbnQpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZC1jdXN0b20nKTtcbiAgICAgICAgdmFyIHZhbHMgPSB0aGlzLiRlbGVtZW50LnZhbCgpIHx8IFtdO1xuICAgICAgICB2YXIgcmVtb3ZlVmFscyA9ICQubWFwKGRhdGEuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkKXtcbiAgICAgICAgICAgIHJldHVybiAnJyArIGNoaWxkLmlkO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIG5ld1ZhbHMgPSBbXTtcbiAgICAgICAgXG4gICAgICAgIHZhbHMuZm9yRWFjaChmdW5jdGlvbih2YWwpe1xuICAgICAgICAgICAgaWYgKCQuaW5BcnJheSh2YWwsIHJlbW92ZVZhbHMpID09IC0xKXtcbiAgICAgICAgICAgICAgICBuZXdWYWxzLnB1c2godmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQudmFsKG5ld1ZhbHMpO1xuICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIE9wdGdyb3VwRGF0YTtcbn0pOyIsIiQuZm4uc2VsZWN0Mi5hbWQuZGVmaW5lKCdvcHRncm91cFJlc3VsdHMnLCBbXG4gICAgJ3NlbGVjdDIvcmVzdWx0cycsXG4gICAgJ3NlbGVjdDIvdXRpbHMnXG5dLCBmdW5jdGlvbiAoUmVzdWx0c0FkYXB0ZXIsIFV0aWxzKSB7XG4gICAgXG4gICAgZnVuY3Rpb24gT3B0Z3JvdXBSZXN1bHRzICgpIHtcbiAgICAgICAgT3B0Z3JvdXBSZXN1bHRzLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gICAgXG4gICAgVXRpbHMuRXh0ZW5kKE9wdGdyb3VwUmVzdWx0cywgUmVzdWx0c0FkYXB0ZXIpO1xuICAgIFxuICAgIE9wdGdyb3VwUmVzdWx0cy5wcm90b3R5cGUub3B0aW9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdmFyIG9wdGlvbiA9IE9wdGdyb3VwUmVzdWx0cy5fX3N1cGVyX18ub3B0aW9uLmNhbGwodGhpcywgZGF0YSk7XG5cbiAgICAgICAgaWYgKGRhdGEuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIHZhciAkbGFiZWwgPSAkKG9wdGlvbikuZmluZCgnLnNlbGVjdDItcmVzdWx0c19fZ3JvdXAnKTtcbiAgICAgICAgICAgICRsYWJlbC5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICdyb2xlJzogJ3RyZWVpdGVtJyxcbiAgICAgICAgICAgICAgICAgICdhcmlhLXNlbGVjdGVkJzogJ2ZhbHNlJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkbGFiZWwuZGF0YSgnZGF0YScsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gb3B0aW9uO1xuICAgIH07XG4gICAgXG4gICAgT3B0Z3JvdXBSZXN1bHRzLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24oY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgICAgIE9wdGdyb3VwUmVzdWx0cy5fX3N1cGVyX18uYmluZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJHJlc3VsdHMub24oJ21vdXNldXAnLCAnLnNlbGVjdDItcmVzdWx0c19fZ3JvdXAnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YSgnZGF0YScpO1xuXG4gICAgICAgICAgICB2YXIgdHJpZ2dlciA9ICgkdGhpcy5hdHRyKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJykgID8gJ29wdGdyb3VwOnVuc2VsZWN0JyA6ICdvcHRncm91cDpzZWxlY3QnO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIodHJpZ2dlciwge1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRyZXN1bHRzLm9uKCdtb3VzZWVudGVyJywgJy5zZWxlY3QyLXJlc3VsdHNfX2dyb3VwW2FyaWEtc2VsZWN0ZWRdJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9ICQodGhpcykuZGF0YSgnZGF0YScpO1xuXG4gICAgICAgICAgICBzZWxmLmdldEhpZ2hsaWdodGVkUmVzdWx0cygpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzZWxlY3QyLXJlc3VsdHNfX29wdGlvbi0taGlnaGxpZ2h0ZWQnKTtcblxuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOmZvY3VzJywge1xuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgZWxlbWVudDogJCh0aGlzKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgY29udGFpbmVyLm9uKCdvcHRncm91cDpzZWxlY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWNvbnRhaW5lci5pc09wZW4oKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5vcHRpb25zLmNsb3NlT25TZWxlY3QpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnRyaWdnZXIoJ2Nsb3NlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuc2V0Q2xhc3NlcygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb250YWluZXIub24oJ29wdGdyb3VwOnVuc2VsZWN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFjb250YWluZXIuaXNPcGVuKCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLnNldENsYXNzZXMoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cFJlc3VsdHMucHJvdG90eXBlLnNldENsYXNzZXMgPSBmdW5jdGlvbihjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuZGF0YS5jdXJyZW50KGZ1bmN0aW9uIChzZWxlY3RlZCkge1xuICAgICAgICAgICAgdmFyIHNlbGVjdGVkSWRzID0gW107XG4gICAgICAgICAgICB2YXIgb3B0Z3JvdXBMYWJlbHMgPSBbXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJC5lYWNoKHNlbGVjdGVkLCBmdW5jdGlvbiAoaSwgb2JqKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iai5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICBvcHRncm91cExhYmVscy5wdXNoKG9iai50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKG9iai5jaGlsZHJlbiwgZnVuY3Rpb24oaiwgY2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSWRzLnB1c2goY2hpbGQuaWQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSWRzLnB1c2gob2JqLmlkLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgJG9wdGlvbnMgPSBzZWxmLiRyZXN1bHRzLmZpbmQoJy5zZWxlY3QyLXJlc3VsdHNfX29wdGlvblthcmlhLXNlbGVjdGVkXScpO1xuXG4gICAgICAgICAgICAkb3B0aW9ucy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJG9wdGlvbiA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9ICQuZGF0YSh0aGlzLCAnZGF0YScpO1xuXG4gICAgICAgICAgICAgICAgLy8gaWQgbmVlZHMgdG8gYmUgY29udmVydGVkIHRvIGEgc3RyaW5nIHdoZW4gY29tcGFyaW5nXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gJycgKyBpdGVtLmlkO1xuXG4gICAgICAgICAgICAgICAgaWYgKChpdGVtLmVsZW1lbnQgIT0gbnVsbCAmJiBpdGVtLmVsZW1lbnQuc2VsZWN0ZWQpIHx8IFxuICAgICAgICAgICAgICAgICAgICAoaXRlbS5lbGVtZW50ID09IG51bGwgJiYgJC5pbkFycmF5KGlkLCBzZWxlY3RlZElkcykgPiAtMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRvcHRpb24uYXR0cignYXJpYS1zZWxlY3RlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJG9wdGlvbi5hdHRyKCdhcmlhLXNlbGVjdGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgXG4gICAgICAgICAgICB2YXIgJGdyb3VwcyA9IHNlbGYuJHJlc3VsdHMuZmluZCgnLnNlbGVjdDItcmVzdWx0c19fZ3JvdXBbYXJpYS1zZWxlY3RlZF0nKTtcbiAgICAgICAgXG4gICAgICAgICAgICAkZ3JvdXBzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciAkb3B0Z3JvdXAgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gJC5kYXRhKHRoaXMsICdkYXRhJyk7XG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSBpdGVtLnRleHQ7XG4gICAgICAgICAgICAgICAgdmFyICRlbGVtZW50ID0gJChpdGVtLmVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAkZWxlbWVudC5oYXNDbGFzcygnc2VsZWN0ZWQtY3VzdG9tJykgfHwgJC5pbkFycmF5KHRleHQsIG9wdGdyb3VwTGFiZWxzKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICRvcHRncm91cC5hdHRyKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkb3B0Z3JvdXAuYXR0cignYXJpYS1zZWxlY3RlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIE9wdGdyb3VwUmVzdWx0cztcbn0pOyJdfQ==
