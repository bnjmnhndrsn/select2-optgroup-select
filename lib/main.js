require('./adapters/optgroup-selection');
require('./adapters/optgroup-data');
require('./decorators/optgroup-results');

$(function(){
    
    $.fn.select2.amd.require(["optgroupData", "optgroupSelection", "optgroupResults"], 
        function (OptgroupData, OptgroupSelection, OptgroupResults) {

        $('#target').select2({
            dataAdapter: OptgroupData,
            resultsAdapter: OptgroupResults
        }); 
        
        $('select').change(function(){ console.log( $(this).val() ) });
    });
});
