require('./adapters/optgroup-selection');
require('./adapters/optgroup-data');

$(function(){
    
    $.fn.select2.amd.require(["select2/dropdown", "optgroupData", "optgroupSelection"], 
        function (Dropdown, OptgroupData, OptgroupSelection) {

        $('#target').select2({
            dataAdapter: OptgroupData,
            selectionAdapter: OptgroupSelection,
            templateResult: function(opt){
                var $span = $('<span>').text(opt.text);
                if (opt.children) {
                    var childVals = _.pluck(opt.children, 'id');
                    $span.click(function(){
                        $('#target').val(childVals).trigger('change');
                    });
                }
                
                return $span;
            }
        }); 
    });
});

