require('./adapters/clickable-optgroups');

$(function(){
    
    $.fn.select2.amd.require(["select2/dropdown", "clickableOptgroups"], function (Dropdown, clickableOptgroups) {

        $('#target').select2({
            dropdownAdapter: clickableOptgroups
        }); 
    });
});

