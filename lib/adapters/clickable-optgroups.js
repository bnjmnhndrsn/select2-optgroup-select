$.fn.select2.amd.define('clickableOptgroups', [
    'select2/selection/multiple',
    'select2/utils'
], function (Dropdown, MultipleSelection, Utils) {
    
    function Clickable ($element, options) {
        Clickable.__super__.constructor.apply(this, arguments);
    }
    
    Utils.Extend(Clickable, MultipleSelection);
    
    return Clickable;
});
