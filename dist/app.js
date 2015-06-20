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
            templateResult: function(opt){
                var $span = $('<span>').text(opt.text);
                if (opt.children) {
                    var childVals = _.pluck(opt.children, 'id');
                    $span.click(function(){
                        $('#target').val(childVals).trigger('change');
                    });
                }
                
                return $span;
            }
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
    
    SelectAdapter.prototype.current = function (callback) {
      var data = [];
      var self = this;

      this.$element.find(':selected, .selected-custom').each(function () {
        var $option = $(this);

        var option = self.item($option);

        data.push(option);
      });

      callback(data);
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
    
    Clickable.prototype.getData = function(){
        var self = this
        var $optgroups = this.$element.find('optgroup');
        
        this.optionOptgroupHash = {};
        this.optgroupCounts = {};
    

        $optgroups.each(function () {
          var $optgroup = $(this);
          var optgroupName = $optgroup.attr('label');
          var $options = $optgroup.find('option');
          self.optgroupCounts[optgroupName] = $options.length;
          
          $options.each(function(){
              self.optionOptgroupHash[$(this).val()] = optgroupName;
          });
          
        });
    };
    
    Clickable.prototype.getGroups = function(data) {
        var grouped = [];
        
        var groups = _.mapObject(this.optgroupCounts, function(){ return [] });
        
        for (var d = 0; d < data.length; d++) {
            var selection = data[d];
            var group = this.optionOptgroupHash[selection.id];
            groups[group].push(selection);
        }
        
        _.each(this.optgroupCounts, function(val, key){
            if (val == groups[key].length) {
                grouped.push({
                    text: key
                });
            } else {
                grouped = grouped.concat(groups[key]);
            }
        });
        
        return grouped;
    }
    
    
    Clickable.prototype.update = function (data) {

        this.clear();

        if (data.length === 0) {
            return;
        }
        
        this.getData();
        var grouped = this.getGroups(data);
        var $selections = [];
        
        for (var d = 0; d < grouped.length; d++) {
            var selection = grouped[d];

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
    
    var Decorated = Utils.Decorate(ResultsAdapter, OptgroupResults);
    
    return Decorated;
});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWFpbi5qcyIsImxpYi9hZGFwdGVycy9vcHRncm91cC1kYXRhLmpzIiwibGliL2FkYXB0ZXJzL29wdGdyb3VwLXNlbGVjdGlvbi5qcyIsImxpYi9kZWNvcmF0b3JzL29wdGdyb3VwLXJlc3VsdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4vYWRhcHRlcnMvb3B0Z3JvdXAtc2VsZWN0aW9uJyk7XG5yZXF1aXJlKCcuL2FkYXB0ZXJzL29wdGdyb3VwLWRhdGEnKTtcbnJlcXVpcmUoJy4vZGVjb3JhdG9ycy9vcHRncm91cC1yZXN1bHRzJyk7XG5cbiQoZnVuY3Rpb24oKXtcbiAgICBcbiAgICAkLmZuLnNlbGVjdDIuYW1kLnJlcXVpcmUoW1wic2VsZWN0Mi9kcm9wZG93blwiLCBcIm9wdGdyb3VwRGF0YVwiLCBcIm9wdGdyb3VwU2VsZWN0aW9uXCIsIFwib3B0Z3JvdXBSZXN1bHRzXCJdLCBcbiAgICAgICAgZnVuY3Rpb24gKERyb3Bkb3duLCBPcHRncm91cERhdGEsIE9wdGdyb3VwU2VsZWN0aW9uLCBPcHRncm91cFJlc3VsdHMpIHtcblxuICAgICAgICAkKCcjdGFyZ2V0Jykuc2VsZWN0Mih7XG4gICAgICAgICAgICBkYXRhQWRhcHRlcjogT3B0Z3JvdXBEYXRhLFxuICAgICAgICAgICAgcmVzdWx0c0FkYXB0ZXI6IE9wdGdyb3VwUmVzdWx0cyxcbiAgICAgICAgICAgIHNlbGVjdGlvbkFkYXB0ZXI6IE9wdGdyb3VwU2VsZWN0aW9uLFxuICAgICAgICAgICAgdGVtcGxhdGVSZXN1bHQ6IGZ1bmN0aW9uKG9wdCl7XG4gICAgICAgICAgICAgICAgdmFyICRzcGFuID0gJCgnPHNwYW4+JykudGV4dChvcHQudGV4dCk7XG4gICAgICAgICAgICAgICAgaWYgKG9wdC5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGRWYWxzID0gXy5wbHVjayhvcHQuY2hpbGRyZW4sICdpZCcpO1xuICAgICAgICAgICAgICAgICAgICAkc3Bhbi5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3RhcmdldCcpLnZhbChjaGlsZFZhbHMpLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuICRzcGFuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTsgXG4gICAgfSk7XG59KTtcblxuIiwiJC5mbi5zZWxlY3QyLmFtZC5kZWZpbmUoJ29wdGdyb3VwRGF0YScsIFtcbiAgICAnc2VsZWN0Mi9kYXRhL3NlbGVjdCcsXG4gICAgJ3NlbGVjdDIvdXRpbHMnXG5dLCBmdW5jdGlvbiAoU2VsZWN0QWRhcHRlciwgVXRpbHMpIHtcbiAgICBcbiAgICBmdW5jdGlvbiBPcHRncm91cERhdGEgKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgIE9wdGdyb3VwRGF0YS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgXG4gICAgVXRpbHMuRXh0ZW5kKE9wdGdyb3VwRGF0YSwgU2VsZWN0QWRhcHRlcik7XG4gICAgXG4gICAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUuY3VycmVudCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgdmFyIGRhdGEgPSBbXTtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCc6c2VsZWN0ZWQsIC5zZWxlY3RlZC1jdXN0b20nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICRvcHRpb24gPSAkKHRoaXMpO1xuXG4gICAgICAgIHZhciBvcHRpb24gPSBzZWxmLml0ZW0oJG9wdGlvbik7XG5cbiAgICAgICAgZGF0YS5wdXNoKG9wdGlvbik7XG4gICAgICB9KTtcblxuICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gT3B0Z3JvdXBEYXRhO1xufSk7IiwiJC5mbi5zZWxlY3QyLmFtZC5kZWZpbmUoJ29wdGdyb3VwU2VsZWN0aW9uJywgW1xuICAgICdzZWxlY3QyL3NlbGVjdGlvbi9tdWx0aXBsZScsXG4gICAgJ3NlbGVjdDIvdXRpbHMnXG5dLCBmdW5jdGlvbiAoTXVsdGlwbGVTZWxlY3Rpb24sIFV0aWxzKSB7XG4gICAgXG4gICAgZnVuY3Rpb24gQ2xpY2thYmxlICgkZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICBDbGlja2FibGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIFxuICAgIFV0aWxzLkV4dGVuZChDbGlja2FibGUsIE11bHRpcGxlU2VsZWN0aW9uKTtcbiAgICBcbiAgICBDbGlja2FibGUucHJvdG90eXBlLmdldERhdGEgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICAgdmFyICRvcHRncm91cHMgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ29wdGdyb3VwJyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLm9wdGlvbk9wdGdyb3VwSGFzaCA9IHt9O1xuICAgICAgICB0aGlzLm9wdGdyb3VwQ291bnRzID0ge307XG4gICAgXG5cbiAgICAgICAgJG9wdGdyb3Vwcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgJG9wdGdyb3VwID0gJCh0aGlzKTtcbiAgICAgICAgICB2YXIgb3B0Z3JvdXBOYW1lID0gJG9wdGdyb3VwLmF0dHIoJ2xhYmVsJyk7XG4gICAgICAgICAgdmFyICRvcHRpb25zID0gJG9wdGdyb3VwLmZpbmQoJ29wdGlvbicpO1xuICAgICAgICAgIHNlbGYub3B0Z3JvdXBDb3VudHNbb3B0Z3JvdXBOYW1lXSA9ICRvcHRpb25zLmxlbmd0aDtcbiAgICAgICAgICBcbiAgICAgICAgICAkb3B0aW9ucy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIHNlbGYub3B0aW9uT3B0Z3JvdXBIYXNoWyQodGhpcykudmFsKCldID0gb3B0Z3JvdXBOYW1lO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgIENsaWNrYWJsZS5wcm90b3R5cGUuZ2V0R3JvdXBzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB2YXIgZ3JvdXBlZCA9IFtdO1xuICAgICAgICBcbiAgICAgICAgdmFyIGdyb3VwcyA9IF8ubWFwT2JqZWN0KHRoaXMub3B0Z3JvdXBDb3VudHMsIGZ1bmN0aW9uKCl7IHJldHVybiBbXSB9KTtcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGF0YS5sZW5ndGg7IGQrKykge1xuICAgICAgICAgICAgdmFyIHNlbGVjdGlvbiA9IGRhdGFbZF07XG4gICAgICAgICAgICB2YXIgZ3JvdXAgPSB0aGlzLm9wdGlvbk9wdGdyb3VwSGFzaFtzZWxlY3Rpb24uaWRdO1xuICAgICAgICAgICAgZ3JvdXBzW2dyb3VwXS5wdXNoKHNlbGVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIF8uZWFjaCh0aGlzLm9wdGdyb3VwQ291bnRzLCBmdW5jdGlvbih2YWwsIGtleSl7XG4gICAgICAgICAgICBpZiAodmFsID09IGdyb3Vwc1trZXldLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGdyb3VwZWQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGtleVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBncm91cGVkID0gZ3JvdXBlZC5jb25jYXQoZ3JvdXBzW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBncm91cGVkO1xuICAgIH1cbiAgICBcbiAgICBcbiAgICBDbGlja2FibGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgdGhpcy5jbGVhcigpO1xuXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmdldERhdGEoKTtcbiAgICAgICAgdmFyIGdyb3VwZWQgPSB0aGlzLmdldEdyb3VwcyhkYXRhKTtcbiAgICAgICAgdmFyICRzZWxlY3Rpb25zID0gW107XG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBkID0gMDsgZCA8IGdyb3VwZWQubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3Rpb24gPSBncm91cGVkW2RdO1xuXG4gICAgICAgICAgICB2YXIgZm9ybWF0dGVkID0gdGhpcy5kaXNwbGF5KHNlbGVjdGlvbik7XG4gICAgICAgICAgICB2YXIgJHNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uQ29udGFpbmVyKCk7XG5cbiAgICAgICAgICAgICRzZWxlY3Rpb24uYXBwZW5kKGZvcm1hdHRlZCk7XG4gICAgICAgICAgICAkc2VsZWN0aW9uLnByb3AoJ3RpdGxlJywgc2VsZWN0aW9uLnRpdGxlIHx8IHNlbGVjdGlvbi50ZXh0KTtcblxuICAgICAgICAgICAgJHNlbGVjdGlvbi5kYXRhKCdkYXRhJywgc2VsZWN0aW9uKTtcblxuICAgICAgICAgICAgJHNlbGVjdGlvbnMucHVzaCgkc2VsZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBcblxuICAgICAgICB2YXIgJHJlbmRlcmVkID0gdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKTtcblxuICAgICAgICBVdGlscy5hcHBlbmRNYW55KCRyZW5kZXJlZCwgJHNlbGVjdGlvbnMpO1xuICAgIH07XG5cbiAgICAgICAgXG4gICAgcmV0dXJuIENsaWNrYWJsZTtcbn0pO1xuIiwiJC5mbi5zZWxlY3QyLmFtZC5kZWZpbmUoJ29wdGdyb3VwUmVzdWx0cycsIFtcbiAgICAnc2VsZWN0Mi9yZXN1bHRzJyxcbiAgICAnc2VsZWN0Mi91dGlscydcbl0sIGZ1bmN0aW9uIChSZXN1bHRzQWRhcHRlciwgVXRpbHMpIHtcbiAgICBcbiAgICBmdW5jdGlvbiBPcHRncm91cFJlc3VsdHMgKCkge307XG4gICAgXG4gICAgdmFyIERlY29yYXRlZCA9IFV0aWxzLkRlY29yYXRlKFJlc3VsdHNBZGFwdGVyLCBPcHRncm91cFJlc3VsdHMpO1xuICAgIFxuICAgIHJldHVybiBEZWNvcmF0ZWQ7XG59KTsiXX0=
