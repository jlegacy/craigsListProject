(function () {

	var $ChartView = function () {};

	$ChartView.variables = {};

	$ChartView.Create = function () {
		
		$App.CheckSecurity();

		var template = $App.LoadTemplate('templates/chart_template.html');
		var selectOptionsTemplate = $App.LoadTemplate('templates/addSelectOptions_template.html');
		var selectObject = [];
		var JSONObject,tempObj;
		var data = {};
		var container = $('#container');
		
		$('#container').html(template());
		
		$("#orientDrop").change(function () {
				$('svg').remove();
				$createVisualTreeJSON.render($('#orientDrop').val(), $('#projectDrop').val());
			});

			$("#projectDrop").change(function () {
				$('svg').remove();
				$createVisualTreeJSON.render($('#orientDrop').val(), $('#projectDrop').val());
			});
		
		//populate project Drop Down//
		data.token = $App.GetUserSession();
		$.when($ChartModels.GetProjects(data)).done(function (returnData) {
			JSONObject = JSON.parse(returnData);
			var tempObj = {};
			_.each(JSONObject.items, function (value) {
				tempObj.value = value.metadata.name;
				tempObj.text = value.metadata.name;
				selectObject.push(tempObj);
			});
			container.find('select[id=projectDrop]').append(selectOptionsTemplate(selectObject));

			$( "#orientDrop" ).val('Vert');
			$createVisualTreeJSON.render($('#orientDrop').val(), $('#projectDrop').val());
			
		});
		
	};

	window.$ChartView = $ChartView;
	return (this);
}
	());
