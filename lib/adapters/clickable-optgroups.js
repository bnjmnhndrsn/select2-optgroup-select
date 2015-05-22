$.fn.select2.amd.define('clickableOptgroups', [
    'select2/dropdown',
    'select2/dropdown/attachBody',
    'select2/utils'
], function (Dropdown, AttachBody, Utils) {
    
    function Clickable (decorated, $element, options) {
        this.$dropdownParent = options.get('dropdownParent') || document.body;
        decorated.call(this, $element, options);
    }
    
    $.extend(Clickable.prototype, AttachBody.prototype);
    
    var Class = Utils.Decorate(Dropdown, Clickable);
    
    return Class;
});
