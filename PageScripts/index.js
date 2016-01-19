(function () {

	var $Index = function () {};

	
	var loadDetails = function (data) {
		var template;
		template = $App.LoadTemplate('templates/_template_entry2.js');
		
		$.ajax({
			url: "http://private-f376e-secureprintusers2.apiary-mock.com/users", 
			type: "GET",
			contentType: 'application/json',
			success : function (result) {
				var users = result;
				console.log(users);
				$('#details').html(template(users));
			},
			error : function (result) {
				console.log(result);
			}
			});
	};
	
		$Index.Init = function () {
			var template;
			template = $App.LoadTemplate('templates/_template_entry.js');
			var jsonData = {};
			jsonData.title = 'Page1';
			jsonData.body = 'Testing in the body';
			$('#container').html(template(jsonData));
		//	loadDetails();

			$('#submitMe').on('click', function () {
			    var obj = $('#testForm1').serializeToJSON();
			    console.log(obj);
			});
		},

		$Index.UpdateView = function (data) {
			test(data);
		},

		window.$Index = $Index
		return (this);

	}());
