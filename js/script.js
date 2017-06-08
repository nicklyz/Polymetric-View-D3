var spec = {};
spec.dimensions = ['x', 'y', 'height', 'width', 'shading', 'order'];
spec.metrics = ['a', 'b', 'c', 'd'];	// replace with real metrics
spec.layouts = [		// add more plot types here
	{name: 'scatter', title: 'Scatter Plot', dimensions: ['x', 'y', 'height', 'width', 'shading']},
	{name: 'tree', title: 'Tree Plot', dimensions: ['height', 'width', 'shading']},
	{name: 'treemap', title: 'Tree Map', dimensions: ['height', 'width', 'shading', 'order']}
];

function parseFile() {
	var fileInput = document.getElementById('fileInput');
	var fileDisplayArea = document.getElementById('fileDisplayArea');

	var file = fileInput.files[0];

	if (file.name.split('.').pop().toLowerCase() === 'mse') {
		var reader = new FileReader();

		reader.onload = function(e) {
			//fileDisplayArea.innerText = reader.result;	// replace the following with interesting logic
			
			var result = MSE.parse(reader.result);
			var printData = JSON.stringify(result.slice(0,10), null, 2);
			redraw();

			fileDisplayArea.innerText = printData;
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

function redraw() {
	// add plotting mechanisms here
}