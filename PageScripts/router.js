$(document).ready(function () {
	routie({
		'' : function () {
			$Main.Init();
		},
/*Users*/		
		'Logon' : function () {
			$User.Login();
		},
/*Users*/		
		'Logout' : function () {
			$User.Logout();
		},
/*ChartViews*/
		'ShowAutos' : function () {
			$Auto.ShowAll();
		},
/*Custom Error Pages*/
		'Error400' : function () {
			$CustomErrors.Display(400);
		},
		'Error401' : function () {
			$CustomErrors.Display(401);
		},
		'Error402' : function () {
			$CustomErrors.Display(402);
		}
	});
});
