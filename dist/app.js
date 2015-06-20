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

            data.push(option);
        });
        debugger;
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
            
            for (var i = 0; i < currentData.length; i++) {
                var id = currentData[i].id;
                
                for (var j = 0; j < data.children.length; j++) {
                    if (data.children[j].id !== id && $.inArray(id, val) === -1) {
                        val.push(id);
                    }
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
    
    
    // Clickable.prototype.update = function (data) {
    //
    //     this.clear();
    //
    //     if (data.length === 0) {
    //         return;
    //     }
    //
    //     var grouped = this.getGroups(data);
    //     var $selections = [];
    //
    //     for (var d = 0; d < grouped.length; d++) {
    //         var selection = grouped[d];
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
    
    Clickable.prototype.update = function (data) {
      this.clear();

      if (data.length === 0) {
        return;
      }

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
        option.setAttribute('aria-selected', false);
        return option;
    };
    
    OptgroupResults.prototype.bind = function(decorated, container, $container) {
        var self = this;
        decorated.call(this, container, $container);
        
        this.$results.off('mouseup');
        this.$results.on('mouseup', '.select2-results__option[aria-selected]', function (evt) {
            var $this = $(this);

            var data = $this.data('data');
            
            var trigger = ($this.attr('aria-selected') === 'true')  ? 'unselect' : 'select';
  
            self.trigger(trigger, {
                originalEvent: evt,
                data: data
            });
                
            return false;
        });
    };
    
    var Decorated = Utils.Decorate(ResultsAdapter, OptgroupResults);
    
    return Decorated;
});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWFpbi5qcyIsImxpYi9hZGFwdGVycy9vcHRncm91cC1kYXRhLmpzIiwibGliL2FkYXB0ZXJzL29wdGdyb3VwLXNlbGVjdGlvbi5qcyIsImxpYi9kZWNvcmF0b3JzL29wdGdyb3VwLXJlc3VsdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuL2FkYXB0ZXJzL29wdGdyb3VwLXNlbGVjdGlvbicpO1xucmVxdWlyZSgnLi9hZGFwdGVycy9vcHRncm91cC1kYXRhJyk7XG5yZXF1aXJlKCcuL2RlY29yYXRvcnMvb3B0Z3JvdXAtcmVzdWx0cycpO1xuXG4kKGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgJC5mbi5zZWxlY3QyLmFtZC5yZXF1aXJlKFtcInNlbGVjdDIvZHJvcGRvd25cIiwgXCJvcHRncm91cERhdGFcIiwgXCJvcHRncm91cFNlbGVjdGlvblwiLCBcIm9wdGdyb3VwUmVzdWx0c1wiXSwgXG4gICAgICAgIGZ1bmN0aW9uIChEcm9wZG93biwgT3B0Z3JvdXBEYXRhLCBPcHRncm91cFNlbGVjdGlvbiwgT3B0Z3JvdXBSZXN1bHRzKSB7XG5cbiAgICAgICAgJCgnI3RhcmdldCcpLnNlbGVjdDIoe1xuICAgICAgICAgICAgZGF0YUFkYXB0ZXI6IE9wdGdyb3VwRGF0YSxcbiAgICAgICAgICAgIHJlc3VsdHNBZGFwdGVyOiBPcHRncm91cFJlc3VsdHMsXG4gICAgICAgICAgICBzZWxlY3Rpb25BZGFwdGVyOiBPcHRncm91cFNlbGVjdGlvbixcbiAgICAgICAgfSk7IFxuICAgIH0pO1xufSk7XG5cblxuLypcblxudmFyICRzcGFuID0gJCgnPHNwYW4+JykudGV4dChvcHQudGV4dCk7XG5pZiAob3B0LmNoaWxkcmVuKSB7XG4gICAgdmFyIGNoaWxkVmFscyA9IF8ucGx1Y2sob3B0LmNoaWxkcmVuLCAnaWQnKTtcbiAgICAkc3Bhbi5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKCcjdGFyZ2V0JykudmFsKGNoaWxkVmFscykudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfSk7XG59XG5cbnJldHVybiAkc3BhbjtcbiovXG4iLCIkLmZuLnNlbGVjdDIuYW1kLmRlZmluZSgnb3B0Z3JvdXBEYXRhJywgW1xuICAgICdzZWxlY3QyL2RhdGEvc2VsZWN0JyxcbiAgICAnc2VsZWN0Mi91dGlscydcbl0sIGZ1bmN0aW9uIChTZWxlY3RBZGFwdGVyLCBVdGlscykge1xuICAgIFxuICAgIGZ1bmN0aW9uIE9wdGdyb3VwRGF0YSAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgT3B0Z3JvdXBEYXRhLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBcbiAgICBVdGlscy5FeHRlbmQoT3B0Z3JvdXBEYXRhLCBTZWxlY3RBZGFwdGVyKTtcbiAgICBcbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLmN1cnJlbnQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGRhdGEgPSBbXTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnOnNlbGVjdGVkLCAuc2VsZWN0ZWQtY3VzdG9tJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJG9wdGlvbiA9ICQodGhpcyk7XG4gICAgICAgICAgICB2YXIgb3B0aW9uID0gc2VsZi5pdGVtKCRvcHRpb24pO1xuXG4gICAgICAgICAgICBkYXRhLnB1c2gob3B0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICBjYWxsYmFjayhkYXRhKTtcbiAgICB9O1xuICAgIFxuICAgIE9wdGdyb3VwRGF0YS5wcm90b3R5cGUuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGRhdGEuc2VsZWN0ZWQgPSB0cnVlO1xuXG4gICAgICAgIC8vIElmIGRhdGEuZWxlbWVudCBpcyBhIERPTSBub2RlLCB1c2UgaXQgaW5zdGVhZFxuICAgICAgICBpZiAoJChkYXRhLmVsZW1lbnQpLmlzKCdvcHRpb24nKSkge1xuICAgICAgICAgICAgZGF0YS5lbGVtZW50LnNlbGVjdGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAkKGRhdGEuZWxlbWVudCkuYWRkQ2xhc3MoJ3NlbGVjdGVkLWN1c3RvbScpO1xuXG4gICAgICAgIHRoaXMuY3VycmVudChmdW5jdGlvbiAoY3VycmVudERhdGEpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSBbXTtcblxuICAgICAgICAgICAgZGF0YSA9IGRhdGEuY2hpbGRyZW4uY29uY2F0KGN1cnJlbnREYXRhKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkYXRhLmxlbmd0aDsgZCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gZGF0YVtkXS5pZDtcblxuICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkoaWQsIHZhbCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbC5wdXNoKGlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuJGVsZW1lbnQudmFsKHZhbCk7XG4gICAgICAgICAgICBzZWxmLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBPcHRncm91cERhdGEucHJvdG90eXBlLnVuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGRhdGEuc2VsZWN0ZWQgPSBmYWxzZTtcblxuICAgICAgICBpZiAoJChkYXRhLmVsZW1lbnQpLmlzKCdvcHRpb24nKSkge1xuICAgICAgICAgICAgZGF0YS5lbGVtZW50LnNlbGVjdGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgJChkYXRhLmVsZW1lbnQpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZC1jdXN0b20nKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuY3VycmVudChmdW5jdGlvbiAoY3VycmVudERhdGEpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSBbXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50RGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IGN1cnJlbnREYXRhW2ldLmlkO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZGF0YS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5jaGlsZHJlbltqXS5pZCAhPT0gaWQgJiYgJC5pbkFycmF5KGlkLCB2YWwpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsLnB1c2goaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuJGVsZW1lbnQudmFsKHZhbCk7XG5cbiAgICAgICAgICAgIHNlbGYuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIE9wdGdyb3VwRGF0YTtcbn0pOyIsIiQuZm4uc2VsZWN0Mi5hbWQuZGVmaW5lKCdvcHRncm91cFNlbGVjdGlvbicsIFtcbiAgICAnc2VsZWN0Mi9zZWxlY3Rpb24vbXVsdGlwbGUnLFxuICAgICdzZWxlY3QyL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKE11bHRpcGxlU2VsZWN0aW9uLCBVdGlscykge1xuICAgIFxuICAgIGZ1bmN0aW9uIENsaWNrYWJsZSAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgQ2xpY2thYmxlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBcbiAgICBVdGlscy5FeHRlbmQoQ2xpY2thYmxlLCBNdWx0aXBsZVNlbGVjdGlvbik7XG4gICAgXG4gICAgLy8gQ2xpY2thYmxlLnByb3RvdHlwZS5nZXREYXRhID0gZnVuY3Rpb24oKXtcbiAgICAvLyAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgLy8gICAgIHZhciAkb3B0Z3JvdXBzID0gdGhpcy4kZWxlbWVudC5maW5kKCdvcHRncm91cCcpO1xuICAgIC8vXG4gICAgLy8gICAgIHRoaXMub3B0aW9uT3B0Z3JvdXBIYXNoID0ge307XG4gICAgLy8gICAgIHRoaXMub3B0Z3JvdXBDb3VudHMgPSB7fTtcbiAgICAvL1xuICAgIC8vXG4gICAgLy8gICAgICRvcHRncm91cHMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgLy8gICAgICAgdmFyICRvcHRncm91cCA9ICQodGhpcyk7XG4gICAgLy8gICAgICAgdmFyIG9wdGdyb3VwTmFtZSA9ICRvcHRncm91cC5hdHRyKCdsYWJlbCcpO1xuICAgIC8vICAgICAgIHZhciAkb3B0aW9ucyA9ICRvcHRncm91cC5maW5kKCdvcHRpb24nKTtcbiAgICAvLyAgICAgICBzZWxmLm9wdGdyb3VwQ291bnRzW29wdGdyb3VwTmFtZV0gPSAkb3B0aW9ucy5sZW5ndGg7XG4gICAgLy9cbiAgICAvLyAgICAgICAkb3B0aW9ucy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgICAgICAgIHNlbGYub3B0aW9uT3B0Z3JvdXBIYXNoWyQodGhpcykudmFsKCldID0gb3B0Z3JvdXBOYW1lO1xuICAgIC8vICAgICAgIH0pO1xuICAgIC8vXG4gICAgLy8gICAgIH0pO1xuICAgIC8vIH07XG4gICAgXG4gICAgLy8gQ2xpY2thYmxlLnByb3RvdHlwZS5nZXRHcm91cHMgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgLy8gICAgIHZhciBncm91cGVkID0gW107XG4gICAgLy9cbiAgICAvLyAgICAgdmFyIGdyb3VwcyA9IF8ubWFwT2JqZWN0KHRoaXMub3B0Z3JvdXBDb3VudHMsIGZ1bmN0aW9uKCl7IHJldHVybiBbXSB9KTtcbiAgICAvL1xuICAgIC8vICAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAvLyAgICAgICAgIHZhciBzZWxlY3Rpb24gPSBkYXRhW2RdO1xuICAgIC8vICAgICAgICAgdmFyIGdyb3VwID0gdGhpcy5vcHRpb25PcHRncm91cEhhc2hbc2VsZWN0aW9uLmlkXTtcbiAgICAvLyAgICAgICAgIGdyb3Vwc1tncm91cF0ucHVzaChzZWxlY3Rpb24pO1xuICAgIC8vICAgICB9XG4gICAgLy9cbiAgICAvLyAgICAgXy5lYWNoKHRoaXMub3B0Z3JvdXBDb3VudHMsIGZ1bmN0aW9uKHZhbCwga2V5KXtcbiAgICAvLyAgICAgICAgIGlmICh2YWwgPT0gZ3JvdXBzW2tleV0ubGVuZ3RoKSB7XG4gICAgLy8gICAgICAgICAgICAgZ3JvdXBlZC5wdXNoKHtcbiAgICAvLyAgICAgICAgICAgICAgICAgdGV4dDoga2V5XG4gICAgLy8gICAgICAgICAgICAgfSk7XG4gICAgLy8gICAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgICAgIGdyb3VwZWQgPSBncm91cGVkLmNvbmNhdChncm91cHNba2V5XSk7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH0pO1xuICAgIC8vXG4gICAgLy8gICAgIHJldHVybiBncm91cGVkO1xuICAgIC8vIH1cbiAgICBcbiAgICBcbiAgICAvLyBDbGlja2FibGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgLy9cbiAgICAvLyAgICAgdGhpcy5jbGVhcigpO1xuICAgIC8vXG4gICAgLy8gICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vICAgICAgICAgcmV0dXJuO1xuICAgIC8vICAgICB9XG4gICAgLy9cbiAgICAvLyAgICAgdmFyIGdyb3VwZWQgPSB0aGlzLmdldEdyb3VwcyhkYXRhKTtcbiAgICAvLyAgICAgdmFyICRzZWxlY3Rpb25zID0gW107XG4gICAgLy9cbiAgICAvLyAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBncm91cGVkLmxlbmd0aDsgZCsrKSB7XG4gICAgLy8gICAgICAgICB2YXIgc2VsZWN0aW9uID0gZ3JvdXBlZFtkXTtcbiAgICAvL1xuICAgIC8vICAgICAgICAgdmFyIGZvcm1hdHRlZCA9IHRoaXMuZGlzcGxheShzZWxlY3Rpb24pO1xuICAgIC8vICAgICAgICAgdmFyICRzZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbkNvbnRhaW5lcigpO1xuICAgIC8vXG4gICAgLy8gICAgICAgICAkc2VsZWN0aW9uLmFwcGVuZChmb3JtYXR0ZWQpO1xuICAgIC8vICAgICAgICAgJHNlbGVjdGlvbi5wcm9wKCd0aXRsZScsIHNlbGVjdGlvbi50aXRsZSB8fCBzZWxlY3Rpb24udGV4dCk7XG4gICAgLy9cbiAgICAvLyAgICAgICAgICRzZWxlY3Rpb24uZGF0YSgnZGF0YScsIHNlbGVjdGlvbik7XG4gICAgLy9cbiAgICAvLyAgICAgICAgICRzZWxlY3Rpb25zLnB1c2goJHNlbGVjdGlvbik7XG4gICAgLy8gICAgIH1cbiAgICAvL1xuICAgIC8vXG4gICAgLy8gICAgIHZhciAkcmVuZGVyZWQgPSB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpO1xuICAgIC8vXG4gICAgLy8gICAgIFV0aWxzLmFwcGVuZE1hbnkoJHJlbmRlcmVkLCAkc2VsZWN0aW9ucyk7XG4gICAgLy8gfTtcbiAgICBcbiAgICBDbGlja2FibGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciAkc2VsZWN0aW9ucyA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9IGRhdGFbZF07XG5cbiAgICAgICAgdmFyIGZvcm1hdHRlZCA9IHRoaXMuZGlzcGxheShzZWxlY3Rpb24pO1xuICAgICAgICB2YXIgJHNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uQ29udGFpbmVyKCk7XG5cbiAgICAgICAgJHNlbGVjdGlvbi5hcHBlbmQoZm9ybWF0dGVkKTtcbiAgICAgICAgJHNlbGVjdGlvbi5wcm9wKCd0aXRsZScsIHNlbGVjdGlvbi50aXRsZSB8fCBzZWxlY3Rpb24udGV4dCk7XG5cbiAgICAgICAgJHNlbGVjdGlvbi5kYXRhKCdkYXRhJywgc2VsZWN0aW9uKTtcblxuICAgICAgICAkc2VsZWN0aW9ucy5wdXNoKCRzZWxlY3Rpb24pO1xuICAgICAgfVxuXG4gICAgICB2YXIgJHJlbmRlcmVkID0gdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKTtcblxuICAgICAgVXRpbHMuYXBwZW5kTWFueSgkcmVuZGVyZWQsICRzZWxlY3Rpb25zKTtcbiAgICB9O1xuXG4gICAgICAgIFxuICAgIHJldHVybiBDbGlja2FibGU7XG59KTtcbiIsIiQuZm4uc2VsZWN0Mi5hbWQuZGVmaW5lKCdvcHRncm91cFJlc3VsdHMnLCBbXG4gICAgJ3NlbGVjdDIvcmVzdWx0cycsXG4gICAgJ3NlbGVjdDIvdXRpbHMnXG5dLCBmdW5jdGlvbiAoUmVzdWx0c0FkYXB0ZXIsIFV0aWxzKSB7XG4gICAgXG4gICAgZnVuY3Rpb24gT3B0Z3JvdXBSZXN1bHRzICgpIHt9O1xuICAgIFxuICAgIE9wdGdyb3VwUmVzdWx0cy5wcm90b3R5cGUub3B0aW9uID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgZGF0YSkge1xuICAgICAgICB2YXIgb3B0aW9uID0gZGVjb3JhdGVkLmNhbGwodGhpcywgZGF0YSk7XG4gICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSk7XG4gICAgICAgIHJldHVybiBvcHRpb247XG4gICAgfTtcbiAgICBcbiAgICBPcHRncm91cFJlc3VsdHMucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbihkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRyZXN1bHRzLm9mZignbW91c2V1cCcpO1xuICAgICAgICB0aGlzLiRyZXN1bHRzLm9uKCdtb3VzZXVwJywgJy5zZWxlY3QyLXJlc3VsdHNfX29wdGlvblthcmlhLXNlbGVjdGVkXScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YSgnZGF0YScpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdHJpZ2dlciA9ICgkdGhpcy5hdHRyKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJykgID8gJ3Vuc2VsZWN0JyA6ICdzZWxlY3QnO1xuICBcbiAgICAgICAgICAgIHNlbGYudHJpZ2dlcih0cmlnZ2VyLCB7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0LFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgIHZhciBEZWNvcmF0ZWQgPSBVdGlscy5EZWNvcmF0ZShSZXN1bHRzQWRhcHRlciwgT3B0Z3JvdXBSZXN1bHRzKTtcbiAgICBcbiAgICByZXR1cm4gRGVjb3JhdGVkO1xufSk7Il19
