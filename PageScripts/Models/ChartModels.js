(function () {

	var $ChartModels = function () {};

	//Get Pods for Project//
	$ChartModels.GetPodsByProject = function (data) {
		
		var def = $.Deferred();
		
		$.ajax({
			url : $App.WebServiceRoot + '/GetPodsByProject',
			type : "POST",
			data: data,
			contentType : "application/x-www-form-urlencoded",
			cache : false,
			success : function (result, status, request) {
				$App.HideBusy();
				def.resolve(result);
			},
			error : function () {
				def.resolve({});
			}
		});
		
		return def.promise();

	};
	
	$ChartModels.GetProjects = function (data) {
		
		var def = $.Deferred();
		
		$.ajax({
			url : $App.WebServiceRoot + '/GetProjects',
			type : "POST",
			data: data,
			contentType : "application/x-www-form-urlencoded",
			cache : false,
			success : function (result, status, request) {
				$App.HideBusy();
				def.resolve(result);
			},
			error : function () {
				def.resolve({});
			}
		});
		
		return def.promise();

	};

	

	window.$ChartModels = $ChartModels;
	return (this);
}
	());
