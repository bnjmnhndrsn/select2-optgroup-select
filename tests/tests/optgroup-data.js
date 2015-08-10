module('Optgroup-Data');

var Options = require('select2/options');
var OptgroupData = require('optgroup-data');
var selectOptions = new Options({});

// current
test('returns option if they have :selected', function(assert){
    var $select = $('#qunit-fixture .multiple');
    $select.find('option:first, option:last').prop('selected', true);
    var data = new OptgroupData($select, selectOptions);
    data.current(function(current){
        assert.equal(current.length, 2);
        assert.ok($select.find('option:first').is(current[0].element));
        assert.ok($select.find('option:last').is(current[1].element));
    });
});

test('returns optgroup if they have .selected-custom', function(assert){
    var $select = $('#qunit-fixture .multiple');
    selectOptgroup($select.find('optgroup'));
    var data = new OptgroupData($select, selectOptions);
    data.current(function(current){
        assert.equal(current.length, 2);
        assert.ok($select.find('optgroup:first').is(current[0].element));
        assert.ok($select.find('optgroup:last').is(current[1].element));
    });
});

test('returns mixed group of option and optgroup', function(assert){
    var $select = $('#qunit-fixture .multiple');
    selectOptgroup($select.find('optgroup:first'));
    $select.find('option:last').prop('selected', true);
    var data = new OptgroupData($select, selectOptions);
    data.current(function(current){
        assert.equal(current.length, 2);
        assert.ok($select.find('optgroup:first').is(current[0].element));
        assert.ok($select.find('option:last').is(current[1].element));
    });
});

test('does not return option if it returns the optgroup', function(assert){
    var $select = $('#qunit-fixture .multiple');
    selectOptgroup($select.find('optgroup:first'));
    $select.find('optgroup:first option').prop('selected', true);
    var data = new OptgroupData($select, selectOptions);
    data.current(function(current){
        assert.equal(current.length, 1);
        assert.ok($select.find('optgroup:first').is(current[0].element));
    });
});

// select
test('selects the option', function(assert){
    var $select = $('#qunit-fixture .multiple');
    var $option = $select.find('option:first');
    var data = new OptgroupData($select, selectOptions);
    var optionDatum = data.item($option);
    assert.equal(optionDatum.element.selected, false);
    data.select(optionDatum);
    assert.ok($option.is(':selected'));
});

test('if all sibling elements in optgroup are selected, selects the optgroup', function(assert){
    var $select = $('#qunit-fixture .multiple');
    var $optgroup = $select.find('optgroup:first');
    $optgroup.find('option').prop('selected', true);
    var $firstOption = $optgroup.find('option:first').prop('selected', false);

    var data = new OptgroupData($select, selectOptions);
    assert.equal(optgroupIsSelected($optgroup), false);
    data.select(  data.item($firstOption) );
    assert.ok(optgroupIsSelected($optgroup));
});


// unselect
test('unselects the option', function(assert){
    var $select = $('#qunit-fixture .multiple');
    var $option = $select.find('option:first').prop('selected', true);
    var data = new OptgroupData($select, selectOptions);
    var optionDatum = data.item($option);
    assert.ok(optionDatum.element.selected);
    data.unselect(optionDatum);
    assert.equal($option.is(':selected'), false);
});

test('unselects the parent optgroup', function(assert){
    var $select = $('#qunit-fixture .multiple');
    var $optgroup = $select.find('optgroup:first');
    selectOptgroup($optgroup);
    $optgroup.find('option').prop('selected', true);
    var $firstOption = $optgroup.find('option:first');

    var data = new OptgroupData($select, selectOptions);
    assert.equal(optgroupIsSelected($optgroup), true);
    data.unselect(  data.item($firstOption) );
    assert.equal(optgroupIsSelected($optgroup), false);
});

//
// // optgroup select
// test('selects the optgroup', function(){});
// test('selects all of the child selects', function(){});
//
// // optgroup unselect
// test('unselects the optgroup', function(){});
// test('unselects all of the child elements', function(){});
