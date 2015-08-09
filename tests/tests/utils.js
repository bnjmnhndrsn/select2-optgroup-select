var setUpSelect2 = function(selector, options){
    options = options || {};
    return (selector).select2($.extend({
        dataAdapter: $.fn.select2.amd.require("optgroup-data"),
        resultsAdapter: $.fn.select2.amd.require("optgroup-results")
    }, options);
};

var optgroupIsSelected = function($optgroup){
    return $optgroup.hasClass('.selected-custom');
}
