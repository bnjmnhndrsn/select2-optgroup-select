$.fn.select2.amd.define('optgroupResults', [
    'select2/results',
    'select2/utils'
], function (ResultsAdapter, Utils) {
    
    function OptgroupResults () {};
    
    OptgroupResults.prototype.option = function (decorated, data) {
        var option = decorated.call(this, data);
        
        if (data.children) {
            var $label = $(option).find('.select2-results__group');
            $label.attr({
                  'role': 'treeitem',
                  'aria-selected': 'false'
            });
            $.data($label, 'data', data);
        }
        return option;
    };
    
    OptgroupResults.prototype.bind = function(decorated, container, $container) {
        var self = this;
        decorated.call(this, container, $container);
        
        this.$results.on('mouseup', '.select2-results__group', function(evt) {
            var $this = $(this);
            
            var data = $this.data('data');
            console.log(data);
            //var trigger = ($this.attr('aria-selected') === 'true')  ? 'unselect' : 'select';
            
            // self.trigger(trigger, {
            //     originalEvent: evt,
            //     data: data
            // });
                
            return false;
        });
    };
    
    var Decorated = Utils.Decorate(ResultsAdapter, OptgroupResults);
    
    return Decorated;
});