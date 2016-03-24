var require = $.fn.select2.amd.require;

var setUpSelect2 = function(selector, options){
    options = options || {};
    $('.select2-container').remove();
    return (selector).select2($.extend({
        dataAdapter: require("optgroup-data"),
        resultsAdapter: require("optgroup-results")
    }, options));
};

var selectedOptgroupClass = 'selected-custom';

var selectOptgroup = function($optgroup){
    $optgroup.addClass(selectedOptgroupClass)
};

var unselectOptgroup = function($optgroup){
    $optgroup.removeClass(selectedOptgroupClass);
}

var optgroupIsSelected = function($optgroup){
    return $optgroup.hasClass(selectedOptgroupClass);
};
