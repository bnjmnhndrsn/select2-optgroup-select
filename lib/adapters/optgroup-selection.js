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

        
    return Clickable;
});
