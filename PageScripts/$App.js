(function () {
	var $App = function () {};

	var parseErrorMessage = function (errors) {
		var errObj = {};
		var jQueryDomElementMessage = "";

		errObj = JSON.parse(errors);

		_.each(errObj, function (value, key) {
			jQueryDomElementMessage += value;
		});

		return jQueryDomElementMessage;
	}

	$App.State = {};

	$App.LoadTemplate = function (path) {
		var data;
		var template = {};
		$.ajax({
			url : path,
			async : false,
			dataType : "text",
			success : function (data) {
				template = Handlebars.compile(data);
			},
			error : function (data) {
				console.log(data);
			}
		});

		return template;
	},
	
	$App.CheckMessageStatus = function (result, title, type) {
		//reset fields//
		var messages = "";
		$('.error').removeClass("error");
		$('#errorPanel').empty();

		switch (result.status) {
		case 400:
			if (parseErrorMessage(result.responseText) === 'License Expired' || parseErrorMessage(result.responseText) === 'Invalid License') {
				$App.DAlert(parseErrorMessage(result.responseText), title, type);
				routie('Error400/');
			} else {
				$App.DAlert('Fix Errors in Fields', title, type);
				SetFieldErrors(result.responseText);
			}
			break;
		case 500:
			$App.DAlert('Unexpected Server Error - Status 500', title, type);
			break;
		case 401:
			$App.ClearSession();
			routie('Error401/');
			break;
		case 402:
			$App.ClearSession();
			routie('Error402/');
			break;
		case 404:
			$App.ClearSession();
			routie('Error404/');
			break;
		case 409:
			$App.DAlert('Conflict - Name already Exists', 'Create Error', 'error');
			break;
		case 200:
			$App.DAlert(result.responseText, title, type);
			break;
		case 0:
			$App.DAlert('Unexpected Server Error - Status 0', title, type);
			break;
		default:
			$App.DAlert(parseErrorMessage(result.responseText), title, type);
			routie('Main/');
		}
	},

	$App.DAlert = function (message, title, type) {

		if (type === "warning") {

			$.growl.notice({
				message : message
			});
		};

		if (type === "error") {

			$.growl.error({
				message : message
			});

		};

		if (type === "success") {

			$.growl.notice({
				message : message
			});

		};
	},

	$App.CheckSecurity = function () {
		if (!$.cookie('sessionToken')) {
			routie('Logon/');
		}
		else
		{
			routie('ShowChart/');
		}
	},

	$App.ShowBusy = function () {
		$('#busy').show();
	},

	$App.HideBusy = function () {
		$('#busy').hide();
	},

	$App.GetSecurity = function () {
		return $.cookie('');
	},

	$App.SetUserSession = function (token) {
		$.cookie('sessionToken', token, {
			expires : 1
		});
	},
	
	$App.GetUserSession = function () {
		return $.cookie('sessionToken');
	},

	$App.ClearSession = function () {
		$.cookie('sessionToken', null);
		$.removeCookie('sessionToken', {
			path : '/'
		});
	},

	$App.WebServiceRoot = "http://localhost:3000";
	$App.OpenShiftAPIRoot = "https://cpg-oshift2-master1.cisco.com:8443/";
	
	window.$App = $App
		return (this);
}
	());
