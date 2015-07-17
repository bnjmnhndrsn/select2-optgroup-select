$.fn.select2.amd.define('optgroupSelection', [
    'select2/selection/multiple',
    'select2/utils'
], function (MultipleSelection, Utils) {
    
    function Clickable ($element, options) {
        Clickable.__super__.constructor.apply(this, arguments);
    }
    
    Utils.Extend(Clickable, MultipleSelection);
    // 
    // Clickable.prototype.processData = function(data){
    //     var result = [];
    //     var queue = [];
    //     var currentOptgroup = null;
    //     
    //     var resetQueue = function(){
    //         if (currentOptgroup && currentOptgroup.children.length === queue.length) {
    //             result.push(currentOptgroup);
    //         } else {
    //             result.push.apply(result, queue);
    //         }
    //         queue = [];
    //     }
    //     
    //     while (data.length) {
    //         var item = data.shift();
    //         
    //         if (item.children) {
    //             resetQueue();
    //             currentOptgroup = item;
    //         } else {
    //             if (currentOptgroup && _.contains(currentOptgroup.children, item)) {
    //                 queue.push(item);
    //             } else {
    //                 resetQueue();
    //                 currentOptgroup = null;
    //                 result.push(item);
    //             }
    //         }
    //     }
    //     
    //     resetQueue();
    //     
    //     return result;
    // };
    // 
    // Clickable.prototype.update = function(data){
    // 
    //     this.clear();
    // 
    //     if (data.length === 0) {
    //         return;
    //     }
    //     
    //     data = this.processData(data);
    //     
    //     var $selections = [];
    // 
    //     for (var d = 0; d < data.length; d++) {
    //         var selection = data[d];
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
