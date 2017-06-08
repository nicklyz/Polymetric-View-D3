var spec = {};
spec.dimensions = ['position-x', 'position-y', 'width', 'height', 'color', 'sort'];
spec.metrics = ['N/A', 'NOPA', 'NOM', 'WLOC', 'WMC', 'NOAM', 'BUR', 'AMW', 'NAS', 'BOvR'];
spec.layouts = [		// add more plot types here
	{name: 'scatter', title: 'Scatter Plot', dimensions: ['position-x', 'position-y', 'width', 'height', 'color']},
	{name: 'tree', title: 'Tree Plot', dimensions: ['width', 'height', 'color']},
	{name: 'treemap', title: 'Tree Map', dimensions: ['width', 'height', 'color', 'sort']},
	{name: 'checker', title: 'Checker Plot', dimensions: ['width', 'height', 'color', 'sort']},
];
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

	htmlForm.append($('<span>').text('view: '));
	htmlForm.append($('<select>', { id: ('view'), onchange: 'adjustDimsAndRedraw()'}));
	$(spec.views).each(function(vi, v) {
		$('#view').append($('<option>', { value: v.name }).text(v.title));
	});

	htmlForm.append($('<span>').text('  layout: '));
	htmlForm.append($('<select>', { id: ('layout'), onchange: 'adjustDimsAndRedraw()'}));
	$(spec.layouts).each(function(li, l) {
		$('#layout').append($('<option>', { value: l.name }).text(l.title));
	});

	$(spec.dimensions).each(function(di, d) {
		htmlForm.append($('<span>').text("  " + d + ": "));
		htmlForm.append($('<select>', { id: d, onchange: 'redraw()'}));		// add some onclick logic here
		$(spec.metrics).each(function(mi, m) {
			$('#' + d).append($('<option>', { value: m }).text(m));
		});
	});
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

function redraw() {
	// add plotting mechanisms here
}