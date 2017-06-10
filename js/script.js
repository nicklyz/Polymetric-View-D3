var spec = {};
spec.dimensions = ['position-x', 'position-y', 'width', 'height', 'color', 'sort'];
spec.metrics = ['NOPA', 'NOM', 'WLOC', 'WMC', 'NOAM', 'BUR', 'AMW', 'NAS', 'BOvR'];
spec.layouts = [		// add more plot types here
	{name: 'scatter', title: 'Scatter Plot', dimensions: ['position-x', 'position-y', 'width', 'height', 'color']},
	{name: 'tree', title: 'Tree Plot', dimensions: ['width', 'height', 'color']},
	{name: 'treemap', title: 'Tree Map', dimensions: ['width', 'height', 'color', 'sort']},
	{name: 'checker', title: 'Checker Plot', dimensions: ['width', 'height', 'color', 'sort']},
];
var parsed_data = null;

function parseFile() {
	var fileInput = document.getElementById('fileInput');
	var fileDisplayArea = document.getElementById('fileDisplayArea');

	var file = fileInput.files[0];

	if (file.name.split('.').pop().toLowerCase() === 'mse') {
		var reader = new FileReader();

		reader.onload = function(e) {
			//fileDisplayArea.innerText = reader.result;	// replace the following with interesting logic

			var result = MSE.parse(reader.result)
			// var printData = JSON.stringify(result.slice(0,1000), null, 2)

			var printData = JSON.stringify(result,null,4)
			// fileDisplayArea.innerText = printData

			redraw(result);

			// fileDisplayArea.innerText = printData;
		}

		reader.readAsText(file);
	} else {
		fileDisplayArea.innerText = 'Please upload an MSE file!';
	}
}

function makeForm() {
	var htmlForm = $('form');

	htmlForm.append($('<span>').text('layout: '));
	htmlForm.append($('<select>', { id: ('layout'), onchange: 'adjustDimsAndRedraw()'}));	// add some onclick logic here
	$(spec.layouts).each(function(pi, p) {
		$('#layout').append($('<option>', { value: p.name }).text(p.title));
	});

	$(spec.dimensions).each(function(di, d) {
		htmlForm.append($('<span>').text(d + ": "));
		htmlForm.append($('<select>', { id: d, onchange: 'redraw()'}));		// add some onclick logic here
		$(spec.metrics).each(function(mi, m) {
			$('#' + d).append($('<option>', { value: m }).text(m));
		});
	});
	adjustDimsAndRedraw();
}

function adjustDimsAndRedraw() {
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
		console.log("hello");
		parsed_data = data;
	}
	if (parsed_data == undefined) {
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
			tree(parsed_data, metrics);
			break;
		case 'treemap':
			treemap(parsed_data, metrics);
			break;
		default:
	}
}
