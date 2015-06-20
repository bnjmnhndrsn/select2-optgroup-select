require('./adapters/optgroup-selection');
require('./adapters/optgroup-data');
require('./decorators/optgroup-results');

$(function(){
    
    $.fn.select2.amd.require(["select2/dropdown", "optgroupData", "optgroupSelection", "optgroupResults"], 
        function (Dropdown, OptgroupData, OptgroupSelection, OptgroupResults) {

        $('#target').select2({
            dataAdapter: OptgroupData,
            resultsAdapter: OptgroupResults,
            selectionAdapter: OptgroupSelection,
        }); 
    });
});


/*

var $span = $('<span>').text(opt.text);
if (opt.children) {
    var childVals = _.pluck(opt.children, 'id');
    $span.click(function(){
        $('#target').val(childVals).trigger('change');
    });
}

return $span;
*/
