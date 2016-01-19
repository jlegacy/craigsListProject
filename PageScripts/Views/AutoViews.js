(function () {

	var $Auto = function () {};

	$Auto.variables = {};

	$Auto.ShowAll = function () {
		
		var template, html;
		template = $App.LoadTemplate('templates/auto_template.html');

		$('#container').html(template());

	//	$('#getAllAutos').on('click', function (e) {
	//		e.preventDefault();
	
			$.when($AutoModels.GetAllAutos()).done(function (data1) {
				console.log(data1);
				if (data1) {
					processData(data1);
				} else {
					$App.DAlert('Error Retrieving Autos', 'Create Error', 'error');
				}

			});
	//	});
	}
	
	
	var processData = function (data){
		//capture all craigslist data rows
		var container = $('#returnData');
		var rows;
		
		container.append($.parseHTML(data));
		
		rows = container.find($('p[data-pid]'));

		console.log(rows);
	
	};

	window.$Auto = $Auto;
	return (this);
}
	());
