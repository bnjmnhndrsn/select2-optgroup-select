module('Integration');

// changing the val
test('Selecting an unselected optgroup selects all the child elements', function(assert){
    var $select = setUpSelect2($('#qunit-fixture .multiple'));
    $select.select2('open');
    $select.data('select2').$results.find('.select2-results__group:first').trigger('mouseup');
    assert.deepEqual(["one", "two"], $select.val());
});

test('Selecting a partially selected optgroup selects all the child elements', function(assert){
    var $select = setUpSelect2($('#qunit-fixture .multiple'));
    $select.val(["one"]);
    $select.select2('open');
    $select.data('select2').$results.find('.select2-results__group:first').trigger('mouseup');
    assert.deepEqual(["one", "two"], $select.val());
});

test('Clicking on a selected optgroup unselects all of the options', function(assert){
    var $select = setUpSelect2($('#qunit-fixture .multiple'));
    $select.select2('open');
    $select.data('select2').$results.find('.select2-results__group:first').trigger('mouseup');
    assert.deepEqual(["one", "two"], $select.val());
    $select.select2('open');
    $select.data('select2').$results.find('.select2-results__group:first').trigger('mouseup');
    assert.notOk($select.val());
});

// selection

test('Clicking on the optgroup causes the optgroup to display in the selection', function(assert){
    var $select = setUpSelect2($('#qunit-fixture .multiple'));
    $select.select2('open');
    $select.data('select2').$results.find('.select2-results__group:first').trigger('mouseup');
    var title = $select.data('select2').$container.find('.select2-selection__choice').attr('title');
    assert.equal(title, $('#qunit-fixture .multiple optgroup:first').attr('label'));
});

test('Selecting all of the child elements selects the optgroup', function(assert){
    var $select = setUpSelect2($('#qunit-fixture .multiple'));
    $select.select2('open');
    var $options = $select.data('select2').$results.find('.select2-results__option[aria-selected]');
    $options.eq(0).trigger('mouseup');
    $options.eq(1).trigger('mouseup');
    
    var title = $select.data('select2').$container.find('.select2-selection__choice').attr('title');
    assert.equal(title, $('#qunit-fixture .multiple optgroup:first').attr('label'));
});

test('Unselecting one of the child elements unselects the optgroup', function(assert){
    var $select = setUpSelect2($('#qunit-fixture .multiple'));
    $select.select2('open');
    $select.data('select2').$results.find('.select2-results__group:first').trigger('mouseup');
    
    $select.select2('open');
    var $options = $select.data('select2').$results.find('.select2-results__option[aria-selected]');
    $options.eq(0).trigger('mouseup');
    
    var title = $select.data('select2').$container.find('.select2-selection__choice').attr('title');
    assert.equal(title, $options.eq(1).text());
});

//setClasses
// test('it sets all aria-selected[false] options in data to true', function(assert){});
// test('it unsets all aria-selected[true] options not in the data', function(){});
// test('it does not change all aria-selected[true] in the data', function(){});
// test('it does not change all aria-selected[false] in the data', function(){});

//
// test('it sets all aria-selected[false] groups in data to true', function(){});
// test('it unsets all aria-selected[true] groups not in the data', function(){});
// test('it does not change all aria-selected[true] groups in the data', function(){});
// test('it does not change all aria-selected[false] groups the data', function(){});

//bind
// test('mouseup on selected optgroup triggers optgroup:unselect and calls setClasses', function(){});
// test('mouseup on unselected optgroup triggers optgroup:select and calls setClasses', function(){});
// test('mouseup on unselected optgroup closes container if closeOnSelect=true', function(){});
// test('mouseup on unselected optgroup keeps container open if closeOnSelect=false', function(){});

