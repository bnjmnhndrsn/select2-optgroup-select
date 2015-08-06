/*!
 * Select2 0.0.0
 * https://select2.github.io
 *
 * Released under the MIT license
 * https://github.com/select2/select2/blob/master/LICENSE.md
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function (jQuery) {
  // This is needed so we can catch the AMD loader configuration and use it
  // The inner file should be wrapped (by `banner.start.js`) in a function that
  // returns the AMD loader references.
  var S2 =
(function () {
  // Restore the Select2 AMD loader so it can be used
  // Needed mostly in the language files, where the loader is not inserted
  if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) {
    var S2 = jQuery.fn.select2.amd;
  }
S2.define('./optgroup-data', [], function(){
    return S2.require([
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
});
S2.define("optgroup-data", function(){});

S2.define('./optgroup-results', [], function(){
    return S2.require(['select2/results', 'select2/utils'], function (ResultsAdapter, Utils) {
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
});
S2.define("optgroup-results", function(){});

S2.require(['./optgroup-data', './optgroup-results'], function (OptgroupSelect, OptgroupResults) {
    return {};
});

S2.define("jquery.select2.optgroupSelect", function(){});

  // Return the AMD loader configuration so it can be used outside of this file
  return {
    define: S2.define,
    require: S2.require
  };
}());

  // Autoload the jQuery bindings
  // We know that all of the modules exist above this, so we're safe
  var select2 = S2.require('jquery.select2');

  // Hold the AMD module references on the jQuery function that was just loaded
  // This allows Select2 to use the internal loader outside of this file, such
  // as in the language files.
  jQuery.fn.select2.amd = S2;

  // Return the Select2 instance for anyone who is importing it.
  return select2;
}));
