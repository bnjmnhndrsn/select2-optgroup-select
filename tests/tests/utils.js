// add OptgroupData and OptgroupResults to the global scope;
var OptgroupData, OptgroupResults;

$.fn.select2.amd.require(["optgroup-data", "optgroup-results"], function (OptgroupData, OptgroupResults) {
    window.OptgroupData = OptgroupData;
    window.OptgroupResults = OptgroupResults;
});

var setUpSelect2 = function(selector, options){
    options = options || {};
    return (selector).select2($.extend({
        dataAdapter: OptgroupData,
        resultsAdapter: OptgroupResults
    }, options);
};

var optgroupIsSelected = function($optgroup){
    return $optgroup.hasClass('.selected-custom');
}
