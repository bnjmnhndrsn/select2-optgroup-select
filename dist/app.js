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
    
    OptgroupResults.prototype.option = function (decorated, data) {
        var option = decorated.call(this, data);
        option.setAttribute('aria-selected', false);
        return option;
    };
    
    var Decorated = Utils.Decorate(ResultsAdapter, OptgroupResults);
    
    return Decorated;
});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWFpbi5qcyIsImxpYi9hZGFwdGVycy9vcHRncm91cC1kYXRhLmpzIiwibGliL2FkYXB0ZXJzL29wdGdyb3VwLXNlbGVjdGlvbi5qcyIsImxpYi9kZWNvcmF0b3JzL29wdGdyb3VwLXJlc3VsdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuL2FkYXB0ZXJzL29wdGdyb3VwLXNlbGVjdGlvbicpO1xucmVxdWlyZSgnLi9hZGFwdGVycy9vcHRncm91cC1kYXRhJyk7XG5yZXF1aXJlKCcuL2RlY29yYXRvcnMvb3B0Z3JvdXAtcmVzdWx0cycpO1xuXG4kKGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgJC5mbi5zZWxlY3QyLmFtZC5yZXF1aXJlKFtcInNlbGVjdDIvZHJvcGRvd25cIiwgXCJvcHRncm91cERhdGFcIiwgXCJvcHRncm91cFNlbGVjdGlvblwiLCBcIm9wdGdyb3VwUmVzdWx0c1wiXSwgXG4gICAgICAgIGZ1bmN0aW9uIChEcm9wZG93biwgT3B0Z3JvdXBEYXRhLCBPcHRncm91cFNlbGVjdGlvbiwgT3B0Z3JvdXBSZXN1bHRzKSB7XG5cbiAgICAgICAgJCgnI3RhcmdldCcpLnNlbGVjdDIoe1xuICAgICAgICAgICAgZGF0YUFkYXB0ZXI6IE9wdGdyb3VwRGF0YSxcbiAgICAgICAgICAgIHJlc3VsdHNBZGFwdGVyOiBPcHRncm91cFJlc3VsdHMsXG4gICAgICAgICAgICBzZWxlY3Rpb25BZGFwdGVyOiBPcHRncm91cFNlbGVjdGlvbixcbiAgICAgICAgfSk7IFxuICAgIH0pO1xufSk7XG5cblxuLypcblxudmFyICRzcGFuID0gJCgnPHNwYW4+JykudGV4dChvcHQudGV4dCk7XG5pZiAob3B0LmNoaWxkcmVuKSB7XG4gICAgdmFyIGNoaWxkVmFscyA9IF8ucGx1Y2sob3B0LmNoaWxkcmVuLCAnaWQnKTtcbiAgICAkc3Bhbi5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKCcjdGFyZ2V0JykudmFsKGNoaWxkVmFscykudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfSk7XG59XG5cbnJldHVybiAkc3BhbjtcbiovXG4iLCIkLmZuLnNlbGVjdDIuYW1kLmRlZmluZSgnb3B0Z3JvdXBEYXRhJywgW1xuICAgICdzZWxlY3QyL2RhdGEvc2VsZWN0JyxcbiAgICAnc2VsZWN0Mi91dGlscydcbl0sIGZ1bmN0aW9uIChTZWxlY3RBZGFwdGVyLCBVdGlscykge1xuICAgIFxuICAgIGZ1bmN0aW9uIE9wdGdyb3VwRGF0YSAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgT3B0Z3JvdXBEYXRhLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBcbiAgICBVdGlscy5FeHRlbmQoT3B0Z3JvdXBEYXRhLCBTZWxlY3RBZGFwdGVyKTtcbiAgICBcbiAgICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5jdXJyZW50ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgZGF0YSA9IFtdO1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICB0aGlzLiRlbGVtZW50LmZpbmQoJzpzZWxlY3RlZCwgLnNlbGVjdGVkLWN1c3RvbScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgJG9wdGlvbiA9ICQodGhpcyk7XG5cbiAgICAgICAgdmFyIG9wdGlvbiA9IHNlbGYuaXRlbSgkb3B0aW9uKTtcblxuICAgICAgICBkYXRhLnB1c2gob3B0aW9uKTtcbiAgICAgIH0pO1xuXG4gICAgICBjYWxsYmFjayhkYXRhKTtcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBPcHRncm91cERhdGE7XG59KTsiLCIkLmZuLnNlbGVjdDIuYW1kLmRlZmluZSgnb3B0Z3JvdXBTZWxlY3Rpb24nLCBbXG4gICAgJ3NlbGVjdDIvc2VsZWN0aW9uL211bHRpcGxlJyxcbiAgICAnc2VsZWN0Mi91dGlscydcbl0sIGZ1bmN0aW9uIChNdWx0aXBsZVNlbGVjdGlvbiwgVXRpbHMpIHtcbiAgICBcbiAgICBmdW5jdGlvbiBDbGlja2FibGUgKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgIENsaWNrYWJsZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgXG4gICAgVXRpbHMuRXh0ZW5kKENsaWNrYWJsZSwgTXVsdGlwbGVTZWxlY3Rpb24pO1xuICAgIFxuICAgIENsaWNrYWJsZS5wcm90b3R5cGUuZ2V0RGF0YSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgICB2YXIgJG9wdGdyb3VwcyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnb3B0Z3JvdXAnKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMub3B0aW9uT3B0Z3JvdXBIYXNoID0ge307XG4gICAgICAgIHRoaXMub3B0Z3JvdXBDb3VudHMgPSB7fTtcbiAgICBcblxuICAgICAgICAkb3B0Z3JvdXBzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciAkb3B0Z3JvdXAgPSAkKHRoaXMpO1xuICAgICAgICAgIHZhciBvcHRncm91cE5hbWUgPSAkb3B0Z3JvdXAuYXR0cignbGFiZWwnKTtcbiAgICAgICAgICB2YXIgJG9wdGlvbnMgPSAkb3B0Z3JvdXAuZmluZCgnb3B0aW9uJyk7XG4gICAgICAgICAgc2VsZi5vcHRncm91cENvdW50c1tvcHRncm91cE5hbWVdID0gJG9wdGlvbnMubGVuZ3RoO1xuICAgICAgICAgIFxuICAgICAgICAgICRvcHRpb25zLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgc2VsZi5vcHRpb25PcHRncm91cEhhc2hbJCh0aGlzKS52YWwoKV0gPSBvcHRncm91cE5hbWU7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgXG4gICAgQ2xpY2thYmxlLnByb3RvdHlwZS5nZXRHcm91cHMgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHZhciBncm91cGVkID0gW107XG4gICAgICAgIFxuICAgICAgICB2YXIgZ3JvdXBzID0gXy5tYXBPYmplY3QodGhpcy5vcHRncm91cENvdW50cywgZnVuY3Rpb24oKXsgcmV0dXJuIFtdIH0pO1xuICAgICAgICBcbiAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkYXRhLmxlbmd0aDsgZCsrKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0aW9uID0gZGF0YVtkXTtcbiAgICAgICAgICAgIHZhciBncm91cCA9IHRoaXMub3B0aW9uT3B0Z3JvdXBIYXNoW3NlbGVjdGlvbi5pZF07XG4gICAgICAgICAgICBncm91cHNbZ3JvdXBdLnB1c2goc2VsZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgXy5lYWNoKHRoaXMub3B0Z3JvdXBDb3VudHMsIGZ1bmN0aW9uKHZhbCwga2V5KXtcbiAgICAgICAgICAgIGlmICh2YWwgPT0gZ3JvdXBzW2tleV0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZ3JvdXBlZC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDoga2V5XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGdyb3VwZWQgPSBncm91cGVkLmNvbmNhdChncm91cHNba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGdyb3VwZWQ7XG4gICAgfVxuICAgIFxuICAgIFxuICAgIENsaWNrYWJsZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuZ2V0RGF0YSgpO1xuICAgICAgICB2YXIgZ3JvdXBlZCA9IHRoaXMuZ2V0R3JvdXBzKGRhdGEpO1xuICAgICAgICB2YXIgJHNlbGVjdGlvbnMgPSBbXTtcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZ3JvdXBlZC5sZW5ndGg7IGQrKykge1xuICAgICAgICAgICAgdmFyIHNlbGVjdGlvbiA9IGdyb3VwZWRbZF07XG5cbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZWQgPSB0aGlzLmRpc3BsYXkoc2VsZWN0aW9uKTtcbiAgICAgICAgICAgIHZhciAkc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb25Db250YWluZXIoKTtcblxuICAgICAgICAgICAgJHNlbGVjdGlvbi5hcHBlbmQoZm9ybWF0dGVkKTtcbiAgICAgICAgICAgICRzZWxlY3Rpb24ucHJvcCgndGl0bGUnLCBzZWxlY3Rpb24udGl0bGUgfHwgc2VsZWN0aW9uLnRleHQpO1xuXG4gICAgICAgICAgICAkc2VsZWN0aW9uLmRhdGEoJ2RhdGEnLCBzZWxlY3Rpb24pO1xuXG4gICAgICAgICAgICAkc2VsZWN0aW9ucy5wdXNoKCRzZWxlY3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIFxuXG4gICAgICAgIHZhciAkcmVuZGVyZWQgPSB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpO1xuXG4gICAgICAgIFV0aWxzLmFwcGVuZE1hbnkoJHJlbmRlcmVkLCAkc2VsZWN0aW9ucyk7XG4gICAgfTtcblxuICAgICAgICBcbiAgICByZXR1cm4gQ2xpY2thYmxlO1xufSk7XG4iLCIkLmZuLnNlbGVjdDIuYW1kLmRlZmluZSgnb3B0Z3JvdXBSZXN1bHRzJywgW1xuICAgICdzZWxlY3QyL3Jlc3VsdHMnLFxuICAgICdzZWxlY3QyL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKFJlc3VsdHNBZGFwdGVyLCBVdGlscykge1xuICAgIFxuICAgIGZ1bmN0aW9uIE9wdGdyb3VwUmVzdWx0cyAoKSB7fTtcbiAgICBcbiAgICBPcHRncm91cFJlc3VsdHMucHJvdG90eXBlLm9wdGlvbiA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGRhdGEpIHtcbiAgICAgICAgdmFyIG9wdGlvbiA9IGRlY29yYXRlZC5jYWxsKHRoaXMsIGRhdGEpO1xuICAgICAgICBvcHRpb24uc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpO1xuICAgICAgICByZXR1cm4gb3B0aW9uO1xuICAgIH07XG4gICAgXG4gICAgdmFyIERlY29yYXRlZCA9IFV0aWxzLkRlY29yYXRlKFJlc3VsdHNBZGFwdGVyLCBPcHRncm91cFJlc3VsdHMpO1xuICAgIFxuICAgIHJldHVybiBEZWNvcmF0ZWQ7XG59KTsiXX0=
