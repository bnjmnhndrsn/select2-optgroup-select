var TestAdapter = require('./adapters/test');

$(function(){

    $('#target').select2({
        selectionAdapter: TestAdapter
    }); 

});