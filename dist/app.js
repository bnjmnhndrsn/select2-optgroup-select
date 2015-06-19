(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./adapters/clickable-optgroups');

$(function(){
    
    $.fn.select2.amd.require(["select2/dropdown", "clickableOptgroups"], function (Dropdown, clickableOptgroups) {

        $('#target').select2({
            selectionAdapter: clickableOptgroups,
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


},{"./adapters/clickable-optgroups":2}],2:[function(require,module,exports){
$.fn.select2.amd.define('clickableOptgroups', [
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvbWFpbi5qcyIsImxpYi9hZGFwdGVycy9jbGlja2FibGUtb3B0Z3JvdXBzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4vYWRhcHRlcnMvY2xpY2thYmxlLW9wdGdyb3VwcycpO1xuXG4kKGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgJC5mbi5zZWxlY3QyLmFtZC5yZXF1aXJlKFtcInNlbGVjdDIvZHJvcGRvd25cIiwgXCJjbGlja2FibGVPcHRncm91cHNcIl0sIGZ1bmN0aW9uIChEcm9wZG93biwgY2xpY2thYmxlT3B0Z3JvdXBzKSB7XG5cbiAgICAgICAgJCgnI3RhcmdldCcpLnNlbGVjdDIoe1xuICAgICAgICAgICAgc2VsZWN0aW9uQWRhcHRlcjogY2xpY2thYmxlT3B0Z3JvdXBzLFxuICAgICAgICAgICAgdGVtcGxhdGVSZXN1bHQ6IGZ1bmN0aW9uKG9wdCl7XG4gICAgICAgICAgICAgICAgdmFyICRzcGFuID0gJCgnPHNwYW4+JykudGV4dChvcHQudGV4dCk7XG4gICAgICAgICAgICAgICAgaWYgKG9wdC5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGRWYWxzID0gXy5wbHVjayhvcHQuY2hpbGRyZW4sICdpZCcpO1xuICAgICAgICAgICAgICAgICAgICAkc3Bhbi5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3RhcmdldCcpLnZhbChjaGlsZFZhbHMpLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuICRzcGFuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTsgXG4gICAgfSk7XG59KTtcblxuIiwiJC5mbi5zZWxlY3QyLmFtZC5kZWZpbmUoJ2NsaWNrYWJsZU9wdGdyb3VwcycsIFtcbiAgICAnc2VsZWN0Mi9zZWxlY3Rpb24vbXVsdGlwbGUnLFxuICAgICdzZWxlY3QyL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKE11bHRpcGxlU2VsZWN0aW9uLCBVdGlscykge1xuICAgIFxuICAgIGZ1bmN0aW9uIENsaWNrYWJsZSAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgQ2xpY2thYmxlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBcbiAgICBVdGlscy5FeHRlbmQoQ2xpY2thYmxlLCBNdWx0aXBsZVNlbGVjdGlvbik7XG4gICAgXG4gICAgQ2xpY2thYmxlLnByb3RvdHlwZS5nZXREYXRhID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAgIHZhciAkb3B0Z3JvdXBzID0gdGhpcy4kZWxlbWVudC5maW5kKCdvcHRncm91cCcpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5vcHRpb25PcHRncm91cEhhc2ggPSB7fTtcbiAgICAgICAgdGhpcy5vcHRncm91cENvdW50cyA9IHt9O1xuICAgIFxuXG4gICAgICAgICRvcHRncm91cHMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyICRvcHRncm91cCA9ICQodGhpcyk7XG4gICAgICAgICAgdmFyIG9wdGdyb3VwTmFtZSA9ICRvcHRncm91cC5hdHRyKCdsYWJlbCcpO1xuICAgICAgICAgIHZhciAkb3B0aW9ucyA9ICRvcHRncm91cC5maW5kKCdvcHRpb24nKTtcbiAgICAgICAgICBzZWxmLm9wdGdyb3VwQ291bnRzW29wdGdyb3VwTmFtZV0gPSAkb3B0aW9ucy5sZW5ndGg7XG4gICAgICAgICAgXG4gICAgICAgICAgJG9wdGlvbnMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICBzZWxmLm9wdGlvbk9wdGdyb3VwSGFzaFskKHRoaXMpLnZhbCgpXSA9IG9wdGdyb3VwTmFtZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBcbiAgICBDbGlja2FibGUucHJvdG90eXBlLmdldEdyb3VwcyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdmFyIGdyb3VwZWQgPSBbXTtcbiAgICAgICAgXG4gICAgICAgIHZhciBncm91cHMgPSBfLm1hcE9iamVjdCh0aGlzLm9wdGdyb3VwQ291bnRzLCBmdW5jdGlvbigpeyByZXR1cm4gW10gfSk7XG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3Rpb24gPSBkYXRhW2RdO1xuICAgICAgICAgICAgdmFyIGdyb3VwID0gdGhpcy5vcHRpb25PcHRncm91cEhhc2hbc2VsZWN0aW9uLmlkXTtcbiAgICAgICAgICAgIGdyb3Vwc1tncm91cF0ucHVzaChzZWxlY3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBfLmVhY2godGhpcy5vcHRncm91cENvdW50cywgZnVuY3Rpb24odmFsLCBrZXkpe1xuICAgICAgICAgICAgaWYgKHZhbCA9PSBncm91cHNba2V5XS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBncm91cGVkLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBrZXlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZ3JvdXBlZCA9IGdyb3VwZWQuY29uY2F0KGdyb3Vwc1trZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZ3JvdXBlZDtcbiAgICB9XG4gICAgXG4gICAgXG4gICAgQ2xpY2thYmxlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcblxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5nZXREYXRhKCk7XG4gICAgICAgIHZhciBncm91cGVkID0gdGhpcy5nZXRHcm91cHMoZGF0YSk7XG4gICAgICAgIHZhciAkc2VsZWN0aW9ucyA9IFtdO1xuICAgICAgICBcbiAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBncm91cGVkLmxlbmd0aDsgZCsrKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0aW9uID0gZ3JvdXBlZFtkXTtcblxuICAgICAgICAgICAgdmFyIGZvcm1hdHRlZCA9IHRoaXMuZGlzcGxheShzZWxlY3Rpb24pO1xuICAgICAgICAgICAgdmFyICRzZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbkNvbnRhaW5lcigpO1xuXG4gICAgICAgICAgICAkc2VsZWN0aW9uLmFwcGVuZChmb3JtYXR0ZWQpO1xuICAgICAgICAgICAgJHNlbGVjdGlvbi5wcm9wKCd0aXRsZScsIHNlbGVjdGlvbi50aXRsZSB8fCBzZWxlY3Rpb24udGV4dCk7XG5cbiAgICAgICAgICAgICRzZWxlY3Rpb24uZGF0YSgnZGF0YScsIHNlbGVjdGlvbik7XG5cbiAgICAgICAgICAgICRzZWxlY3Rpb25zLnB1c2goJHNlbGVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgXG5cbiAgICAgICAgdmFyICRyZW5kZXJlZCA9IHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJyk7XG5cbiAgICAgICAgVXRpbHMuYXBwZW5kTWFueSgkcmVuZGVyZWQsICRzZWxlY3Rpb25zKTtcbiAgICB9O1xuICAgICAgICBcbiAgICByZXR1cm4gQ2xpY2thYmxlO1xufSk7XG4iXX0=
