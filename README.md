# Select2.optgroupSelect
A plugin for [Select2](https://select2.github.io/) which adds the ability to click on the optgroup to select/unselect all of child options. The plugin defines two additional Select2 adapters - OptgroupData and OptgroupResults -  which are passed in to the Select2 constructor.

### Example
[Working Demo](https://bnjmnhndrsn.github.io/select2-optgroup-select/)

### Usage
First get a select element with optgroups:
````html
<select id='target'>
    <optgroup label="All Manhattan">
        <option value='3'>Flatiron</option>
        <option value='4'>Upper West Side</option>
    </optgroup>
    <optgroup label="All Queens">
        <option value='5'>Long Island City</option>
        <option value='6'>Astoria</option>
    </optgroup>
</select>
````

Now call the Select2 constructor on the Select2, passing in the custom adapters. Retrieve them using Select2's built-in module system. 

````javascript

// Retrieve the adapters!
$.fn.select2.amd.require(["optgroup-data", "optgroup-results"], function (OptgroupData, OptgroupResults) {

// Construct!
    $('#target').select2({
        dataAdapter: OptgroupData,
        resultsAdapter: OptgroupResults,
    }); 
    
});
````

Remember: both adapters must be used together!

### Installation
The select2.optgroupSelect.js file defines the two adapters using the global $.fn.select2 variable. Declare Select2 as a dependency in your package management system - or place it first if you're inlining styles - and you're good.

There is a also a limited select2.optgroupSelect.css file which adds the default Select2 option styles to optgroups.

### Development
First install the dev dependencies: 
`npm install`

To compile the distribution javascript:
`grunt compile`

To run the test suite:
`grunt test`
