module('Optgroup-Data');

var Options = require('select2/options');
var OptgroupData = require('optgroup-data');
var selectOptions = new Options({});

//constructor
test('adds .selected-custom to optgroup if all children are selected', function(assert){
    var $select = $('#qunit-fixture .multiple');
    var $optgroup = $select.find('optgroup:first');
    $optgroup.find('option').prop('selected', true);
    assert.notOk(optgroupIsSelected($optgroup));
    var data = new OptgroupData($select, selectOptions);
    assert.ok(optgroupIsSelected($optgroup));
});

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

test('returns mixed group of option and optgroup', function(assert){
    var $select = $('#qunit-fixture .multiple');
    selectOptgroup($select.find('optgroup:first'));
    $select.find('optgroup:first option').prop('selected', true);
    $select.find('option:last').prop('selected', true);
    var data = new OptgroupData($select, selectOptions);
    data.current(function(current){
        assert.equal(current.length, 2);
        assert.ok($select.find('optgroup:first').is(current[0].element));
        assert.ok($select.find('option:last').is(current[1].element));
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


// optgroup select
test('selects all of the child options', function(assert){
    var $select = $('#qunit-fixture .multiple');
    var $optgroup = $select.find('optgroup:first');
    var optionCount = $optgroup.find('option').length;
    var data = new OptgroupData($select, selectOptions);
    var optgroupDatum = data.item($optgroup);
    assert.equal($optgroup.find('option:selected').length, 0);
    data.optgroupSelect(optgroupDatum);
    assert.equal($optgroup.find('option:selected').length, optionCount);
});

// optgroup unselect
test('unselects all of the child elements', function(assert){
    var $select = $('#qunit-fixture .multiple');
    var $optgroup = $select.find('optgroup:first');
    var optionCount = $optgroup.find('option').prop('selected', true).length;
    var data = new OptgroupData($select, selectOptions);
    var optgroupDatum = data.item($optgroup);
    selectOptgroup($optgroup);
    assert.equal($optgroup.find('option:selected').length, optionCount);
    data.optgroupUnselect(optgroupDatum);
    assert.equal($optgroup.find('option:selected').length, 0);
});
