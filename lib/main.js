require('./adapters/optgroup-data');
require('./decorators/optgroup-results');

$(function(){
    
    $.fn.select2.amd.require(["optgroupData", "optgroupResults"], 
        function (OptgroupData, OptgroupResults) {

        $('#target').select2({
            dataAdapter: OptgroupData,
            resultsAdapter: OptgroupResults
        }); 
        
        $('select').change(function(){ console.log( $(this).val() ) });
    });
});
