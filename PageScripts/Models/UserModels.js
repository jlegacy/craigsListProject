(function () {

	var $UserModels = function () {};
	var emptyObj = {};

	//Get Token for a User//
	$UserModels.GetToken = function (data) {
		
		var def = $.Deferred();

		$App.ShowBusy();

		$.ajax({
			url : $App.WebServiceRoot + "/token",
			type : "post",
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

	window.$UserModels = $UserModels;
	return (this);
}
	());
