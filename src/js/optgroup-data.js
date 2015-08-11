$.fn.select2.amd.define('optgroup-data', ['select2/data/select', 'select2/utils'], function(SelectAdapter, Utils){
    function OptgroupData ($element, options) {
        OptgroupData.__super__.constructor.apply(this, arguments);
        this._checkOptgroups();
    }
    
    Utils.Extend(OptgroupData, SelectAdapter);
    
    OptgroupData.prototype.current = function (callback) {
        var data = [];
        var self = this;
        this._checkOptgroups();
        this.$element.find(':not(.selected-custom) :selected, .selected-custom').each(function () {
            var $option = $(this);
            var option = self.item($option);
            
            if (!option.hasOwnProperty('id')) {
                option.id = 'optgroup';
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

        this.$element.trigger('change');

        // Manually trigger dropdrop positioning handler
        $(window).trigger('scroll.select2');
    };
    
    OptgroupData.prototype.unselect = function (data) {
        if ($(data.element).is('optgroup')){
            this.optgroupUnselect(data);
            return;
        }
        
        // Change selected property on underlying option element 
        data.selected = false;
        data.element.selected = false;
        
        this.$element.trigger('change');
        
        // Manually trigger dropdrop positioning handler
        $(window).trigger('scroll.select2');
    };
    
    OptgroupData.prototype.optgroupSelect = function (data) {
        data.selected = true;
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
        
        // Manually trigger dropdrop positioning handler
        $(window).trigger('scroll.select2');
    };
    
    OptgroupData.prototype.optgroupUnselect = function (data) {
        data.selected = false;
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
        
        // Manually trigger dropdrop positioning handler
        $(window).trigger('scroll.select2');
    };
    
    // Check if all children of optgroup are selected. If so, select optgroup
    OptgroupData.prototype._checkOptgroups = function(){
        this.$element.find('optgroup').each(function(){
            var children = this.children;
            
            var allSelected = !!children.length;
            
            for (var i = 0; i < children.length; i++) {
                allSelected = children[i].selected;
                if (!allSelected) { break; }
            }
            
            $(this).toggleClass('selected-custom', allSelected);
        });

    };
    
    return OptgroupData;
});