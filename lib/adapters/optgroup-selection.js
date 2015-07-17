$.fn.select2.amd.define('optgroupSelection', [
    'select2/selection/multiple',
    'select2/selection/search',
    'select2/utils'
], function (MultipleSelection, SelectionSearch, Utils) {
    
    function OptgroupSelection ($element, options) {
        OptgroupSelection.__super__.constructor.apply(this, arguments);
    }
    
    Utils.Extend(OptgroupSelection, MultipleSelection);
    
    var Decorated = Utils.Decorate(OptgroupSelection, SelectionSearch);
        
    return Decorated;
});
