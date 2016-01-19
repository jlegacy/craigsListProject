(function () {

	var $User = function () {};

	$User.variables = {};

	$User.Login = function () {
		
		var template;
		template = $App.LoadTemplate('templates/login_template.html');

		$('#container').html(template());
		$('#navArea').hide();

		$('#submitSecurity').on('click', function (e) {
			e.preventDefault();
			var obj = $('#securityForm').serializeToJSON();

			$.when($UserModels.GetToken(obj)).done(function (data1) {

				if (data1.token) {
					$App.SetUserSession(data1.token);
					routie('ShowChart/');
				} else {
					$App.DAlert('Authority Invalid', 'Create Error', 'error');
					routie('Logon/');
				}

			});
		});
	},

	
	$User.Logout = function (id) {
	    $App.ClearSession();
		$('svg').remove();
		routie('Logon/');
	}

	window.$User = $User;
	return (this);
}
	());
