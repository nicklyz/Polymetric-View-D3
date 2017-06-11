var spec = {};
spec.dimensions = ['position-x', 'position-y', 'width', 'height', 'color', 'sort'];
spec.metrics = ['N/A', 'NOPA', 'NOM', 'WLOC', 'WMC', 'NOAM', 'BUR', 'AMW', 'NAS', 'BOvR'];
spec.layouts = [		// add more plot types here
	{name: 'scatter', title: 'Scatter Plot', dimensions: ['position-x', 'position-y', 'width', 'height', 'color']},
	{name: 'tree', title: 'Tree Plot', dimensions: ['width', 'height', 'color']},
	{name: 'treemap', title: 'Tree Map', dimensions: ['color', 'sort']},
	{name: 'checker', title: 'Checker Plot', dimensions: ['width', 'height', 'color', 'sort']},
	{name: 'treeflower', title: 'Tree Flower', dimensions: ['width', 'color']},
];
var parsed_data = null;
var treeified_data = null;

spec.views = [
	{name: 'custom', title: 'Custom View'},
	{name: 'hotspots', title: 'System Hotspots View', layout: 'checker', defaults: ['NOPA', 'NOM', 'WLOC', 'NOPA']},
	{name: 'complexity', title: 'System Complexity View', layout: 'tree', defaults: ['NOPA', 'NOM', 'WLOC']}
];

function parseFile() {
	var fileInput = document.getElementById('fileInput');
	var fileDisplayArea = document.getElementById('fileDisplayArea');

	var file = fileInput.files[0];

	if (file.name.split('.').pop().toLowerCase() === 'mse') {
		var reader = new FileReader();

		reader.onload = function(e) {

			$('#loading').show();
			setTimeout(function() {
		        var result = MSE.parse(reader.result)

				var printData = JSON.stringify(result,null,4)

				redraw(result);
		        $("#loading").hide();
		    },1); // give it a moment to redraw
		}

		reader.readAsText(file);
	} else {
		fileDisplayArea.innerText = 'Please upload an MSE file!';
	}
}

function makeForm() {
	var htmlForm = $('form');

	htmlForm.append($('<span>').text('view: '));
	htmlForm.append($('<select>', { id: ('view'), onchange: 'adjustDimsAndRedraw()'}));

	for (var i = 0; i < spec.views.length; i++) {
		$('#view').append($('<option>', { value: spec.views[i].name }).text(spec.views[i].title));
	}

	htmlForm.append($('<span>').text('  layout: '));
	htmlForm.append($('<select>', { id: ('layout'), onchange: 'adjustDimsAndRedraw()'}));

	for (var i = 0; i < spec.layouts.length; i++) {
		$('#layout').append($('<option>', { value: spec.layouts[i].name }).text(spec.layouts[i].title));
	}

	for (var i = 0; i < spec.dimensions.length; i++) {
		htmlForm.append($('<span>').text("  " + spec.dimensions[i] + ": "));
		htmlForm.append($('<select>', { id: spec.dimensions[i], onchange: 'redraw()'}));
		for (var j = 0; j < spec.metrics.length; j++) {
			$('#' + spec.dimensions[i]).append($('<option>', { value: spec.metrics[j] }).text(spec.metrics[j]));
		}
	}
	adjustDimsAndRedraw();
}

function adjustDimsAndRedraw() {
	var view = $('#view').find(':selected').attr('value');

	if (view === 'custom') {
		$('#layout').removeAttr('disabled');
		var layout = $('#layout').find(':selected').attr('value');
		var dimensions;
		for (var i = spec.layouts.length - 1; i >= 0; i--) {
			if (spec.layouts[i].name === layout) {
				dimensions = spec.layouts[i].dimensions;
			}
		}
		for (var i = spec.dimensions.length - 1; i >= 0; i--) {
			if (dimensions.includes(spec.dimensions[i])) {
				$('#' + spec.dimensions[i]).removeAttr('disabled');
			}
			else {
				$('#' + spec.dimensions[i]).attr('disabled', true);
			}
		}
	}
	else {
		var layout;
		var dimensions;
		var defaults;
		for (var i = spec.views.length - 1; i >= 0; i--) {
			if (spec.views[i].name === view) {
				layout = spec.views[i].layout;
				defaults = spec.views[i].defaults;
			}
		}
		for (var i = spec.layouts.length - 1; i >= 0; i--) {
			if (spec.layouts[i].name === layout) {
				dimensions = spec.layouts[i].dimensions;
			}
		}
		$('#layout').attr('disabled', true);
		$('#layout option[value="' + layout + '"]').prop("selected", true);
		for (var i = spec.dimensions.length - 1; i >= 0; i--) {
			$('#' + spec.dimensions[i]).attr('disabled', true);
			$('#' + spec.dimensions[i] + ' option[value="N/A"]').prop("selected", true);
		}
		for (var i = dimensions.length - 1; i >= 0; i--) {
			$('#' + dimensions[i] + ' option[value="' + defaults[i] + '"]').prop("selected", true);
		}
	}
	redraw();
}

function redraw(data) {
	// add plotting mechanisms here
	var example = [
	  {"id": "1", "parent": "", "name": "Object",
	    "metrics": {
	      "NOPA": 1,
	      "NOM": 1,
	      "WLOC": 3,
	      "NOPA": 11,
	      "CC": 1,
	    }
	  },
	  {"id": "2", "parent": "1", "name": "String",
	    "metrics": {
	      "NOPA": 2,
	      "NOM": 3,
	      "WLOC": 5,
	      "NOPA": 9,
	      "CC": 5,
	    }
	  },
	  {"id": "3", "parent": "1", "name": "List",
	    "metrics": {
	      "NOPA": 5,
	      "NOM": 7,
	      "WLOC": 8,
	      "NOPA": 3,
	      "CC": 10,

	    }
	  },
	  {"id": "4", "parent": "3", "name": "LinkedList",
	    "metrics": {
	      "NOPA": 7,
	      "NOM": 9,
	      "WLOC": 10,
	      "NOPA": 4,
	      "CC": 15,
	    }
	  },
	  {"id": "5", "parent": "3", "name": "ArrayList",
	    "metrics": {
	      "NOPA": 9,
	      "NOM": 13,
	      "WLOC": 12,
	      "NOPA": 4,
	      "CC": 20,
	    }
	  },
	  {"id": "6", "parent": "", "name": "NULL",
	    "metrics": {
	      "NOPA": 12,
	      "NOM": 17,
	      "WLOC": 19,
	      "NOPA": 4,
	      "CC": 25,
	    }
	  }
	];
	if (data != undefined) {
		console.log("new data");
		parsed_data = data;
		treeified_data = PMV.treeify(data);
	}
	if (parsed_data == undefined || treeified_data == undefined) {
		return;
	}

	var layout = $('#layout').find(':selected').attr('value');

	var metrics = {};

	metrics.x = $('#position-x').find(':selected').attr('value'),
	metrics.y = $('#position-y').find(':selected').attr('value'),
	metrics.width = $('#width').find(':selected').attr('value'),
	metrics.height = $('#height').find(':selected').attr('value'),
	metrics.color = $('#color').find(':selected').attr('value'),
	metrics.sort = $('#sort').find(':selected').attr('value');

	switch(layout) {
		case 'scatter':
			scatter(parsed_data, metrics);
			break;
		case 'tree':
			tree(parsed_data, treeified_data, metrics);
			break;
		case 'treemap':
			treemap(parsed_data, treeified_data, metrics);
			break;
		case 'checker':
			checker(parsed_data, metrics);
			break;
		case 'treeflower':
			treeflower(parsed_data, treeified_data, metrics);
			break;
		default:
	}
	drawcolorbar();
}
