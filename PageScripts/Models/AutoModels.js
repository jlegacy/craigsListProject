(function () {

	var $AutoModels = function () {};
	var emptyObj = {};

	//Get Token for a User//
	$AutoModels.GetAllAutos = function (data) {
		
		var def = $.Deferred();

		$App.ShowBusy();

		$.ajax({
			url : $App.WebServiceRoot + "/GetAllAutos",
			type : "get",
			data : data,
			contentType : "application/x-www-form-urlencoded",
			success : function (result, status) {
				$App.HideBusy();
				def.resolve(result);
			},
			error : function (xhr, status) {
				$App.HideBusy();
				//	$App.CheckMessageStatus(result, 'Get Token', 'error');
				def.resolve(emptyObj);
			}
		});

		return def.promise();
	};

	window.$AutoModels = $AutoModels;
	return (this);
}
	());
