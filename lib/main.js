require('./adapters/clickable-optgroups');

$(function(){
    
    $.fn.select2.amd.require(["select2/dropdown", "clickableOptgroups"], function (Dropdown, clickableOptgroups) {

        $('#target').select2({
            selectionAdapter: clickableOptgroups,
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

