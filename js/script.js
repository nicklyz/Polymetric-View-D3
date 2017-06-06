var spec = {};
spec.dimensions = ['coord_x', 'coord_y', 'height', 'width', 'shading'];
spec.metrics = ['a', 'b', 'c', 'd'];	// replace with real metrics
spec.plotTypes = [		// add more plot types here
	{name: 'tree', title: 'Tree Plot', dimensions: ['height', 'width', 'shading']},
	{name: 'scatter', title: 'Scatter Plot', dimensions: ['coord_x', 'coord_y', 'height', 'width', 'shading']}
];

function parseFile() {
	var fileInput = document.getElementById('fileInput');
	var fileDisplayArea = document.getElementById('fileDisplayArea');

	var file = fileInput.files[0];

	if (file.name.split('.').pop().toLowerCase() === 'mse') {
		var reader = new FileReader();

		reader.onload = function(e) {
			//fileDisplayArea.innerText = reader.result;	// replace the following with interesting logic
			
			var result = MSE.parse(reader.result)
			var printData = JSON.stringify(result.slice(0,10), null, 2)


			fileDisplayArea.innerText = printData
		}

		reader.readAsText(file);	
	} else {
		fileDisplayArea.innerText = "Please upload an MSE file!";
	}
}

function makeForm() {
	var htmlForm = $('form');

	htmlForm.append($('<select>', { id: ('plotType')}));	// add some onclick logic here
	$(spec.plotTypes).each(function(li, l) {
		$('#plotType').append($('<option>', { value: l.name }).text(l.title));
	});

	$(spec.dimensions).each(function(di, d) {
		htmlForm.append($('<span>', { class: 'formlabel'}).text(d+":"));
		htmlForm.append($('<select>', { id: ('sel-'+d)}));		// add some onclick logic here
		$(spec.metrics).each(function(mi, m) {
			$('#sel-'+d).append($('<option>', { value: m }).text(m));
		});
	});
}