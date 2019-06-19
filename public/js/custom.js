$( document ).ready(function() {
	
	$('#deleteFinalUser').on('show.bs.modal', function (event) {
	  	var button = $(event.relatedTarget)
	  	var recipient = button.data('whatever')
	  	var modal = $(this)
	  	modal.find('.modal-title').text('Do you really want to delete developer: ' + recipient)
		modal.find('.modal-footer #deleteUser').val(recipient)
	})

	$( "#deleteUser" ).click(function() {
		var obj = $(this)
		var username = obj.attr("value").toLowerCase();
		var unm = obj.attr("value");
		deleteDeveloper(username, function(error, response) {                         
				if (response.error == false) { 
					var usr = $('tr[username="' + unm + '"]');
					usr.remove();
					$('#deleteFinalUser').modal('toggle');
					snackbar(`User ${username} deleted successfully`);
				} else {
					var usr = $('tr[username="' + unm + '"]');
					usr.remove();
					$('#deleteFinalUser').modal('toggle');
					snackbar(`User ${username} not deleted`);
				}
		})
	});

	function deleteDeveloper(username, done) {
		let userDetails;
		userDetails = { 'developername': username }
		$.ajax({
				method:"POST",
				url: '/deleteDeveloper/',
				data: userDetails
		}).done(function (msg) { done(null, msg);
		}).fail(function( jqXHR, textStatus, errorThrown ) { done(errorThrown); });
	}

	$( "#selected_languages" ).change(function() {
		var saperator = ""
		$("#inputLanguagesDiv").text() ? saperator = ', ' : saperator;
		if($(this).val().trim() != "Select Languages")
		if (confirm(`Do you want to add ${$(this).val().trim()} language?`)) {
			if($("#inputLanguagesDiv").text().toString().includes($(this).val().trim())){
				snackbar(`Language ${$(this).val().trim()} already added into the list`);
			}else{
				$("#inputLanguagesDiv").append(saperator + " " + $(this).val().trim()); $("#inputLanguages").val();
				$("#inputLanguages").val($("#inputLanguagesDiv").text());
				$('select#selected_languages>option:eq(0)').prop('selected', true);
			}
		} else { }
	});

	$( "#filter_language" ).change(function() {
		window.location.href = "http://" + window.location.host.toString() + "/overview/" + $(this).val().toLowerCase();
	});

	$( "#edit_user" ).change(function() {
		getDeveloper($(this).val().trim(), function(error, response) {
			if (response.error == false) { 
				$('#einputDeveloperName').val(response.body.username);
				$('#einputCompany').val(response.body.company);
				$('#einputLanguages').val(response.body.language);
			} else {
				$('#deleteFinalUser').modal('toggle');
				snackbar(`Something went wrong`);
			}
		});
	});

	function getDeveloper(username, done){
		let userDetails;
		userDetails = { 'username': username }
		$.ajax({
				method:"POST",
				url: '/getDeveloper/',
				data: userDetails
		}).done(function (msg) { done(null, msg);
		}).fail(function( jqXHR, textStatus, errorThrown ) { done(errorThrown); });
	}

	$( "#clear_update" ).click(function() { clear(); });

	$( "#clear_add" ).click(function() { clearAdd(); });

	$( "#update_user" ).click(function() {
	  	var username = $('#edit_user').val();
		var newUserName = $('#einputDeveloperName').val();  
		var company = $('#einputCompany').val();
	  	var language = $('#einputLanguages').val();
		if(company == ""){ snackbar(`Please enter company`); }
		else if(newUserName == ""){ snackbar(`Please enter developer name`); }
		else if(language == ""){ snackbar(`Please enter language`);}
		else{
			updateDeveloper(username, newUserName, company, language, function(error, response) {
				if (response.error == false) { 
					$('#editUser').modal('toggle');
					snackbar(`Developer updated successfully`);
					clear();
					//if(location.toString().includes("/overview") || location.toString().includes("/deleteUser")){
					window.setTimeout(function(){
				        window.location.href = location;
				    }, 2000);
					//}
				} else {
					$('#editUser').modal('toggle');
					snackbar(`User not updated`);
				}
			});
		}
	});

	function clearAdd(){
		$('#inputDeveloperName').val("");
		$('#inputLanguagesDiv').text("");
		$('select#inputCompany>option:eq()').prop('selected', true);
		$('select#selected_languages>option:eq()').prop('selected', true);
	}

	function clear(){
		$('#inputCompany').val("");
		$('#inputLanguages').val("");
		$('select#edit_user>option:eq()').prop('selected', true);
	}

	function updateDeveloper(username, updatedUsername, company, language, done){
		let userDetails;
		userDetails = { 'username': username, 'updatedUsername':updatedUsername, 'company': company, 'language': language }
		$.ajax({
				method:"POST",
				url: '/editDeveloper/',
				data: userDetails
		}).done(function (msg) { done(null, msg);
		}).fail(function( jqXHR, textStatus, errorThrown ) { done(errorThrown); });
	}

	$( "#add_developer" ).click(function() {
	  	var developername = $('#inputDeveloperName').val();
	  	var company = $('#inputCompany').val();
	  	var language = $('#inputLanguages').val();
		if(developername == ""){ snackbar(`Please enter developername`); }
		else if(company == "Select Company"){ snackbar(`Please select company`);}
		else if(language == ""){ snackbar(`Please select at leaset one language`);}
		else{
			addDevelopers(developername, company, language, function(error, response) {
				if (response.error == false) { 
					$('#createUser').modal('toggle');
					snackbar(`Developer added successfully`);
					clearCreateUserForm();
					//if(location.toString().includes("/overview") || location.toString().includes("/deleteUser")){
						window.setTimeout(function(){
					        window.location.href = location;
					    }, 2000);
					//}
				} else {
					$('#createUser').modal('toggle');
					snackbar(`User not created`);
				}
			});
		}
	});

	function addDevelopers(developername, company, language, done){
		let userDetails;
		userDetails = { 'developername': developername, 'company': company, 'language': language }
		$.ajax({
				method:"POST",
				url: '/addDeveloper/',
				data: userDetails
		}).done(function (msg) { done(null, msg);
		}).fail(function( jqXHR, textStatus, errorThrown ) { done(errorThrown); });
	}

	function clearCreateUserForm(){
		$('#inputDeveloperName').val("");
		$('#inputCompany').val("");
		$('#inputLanguages').val("");
	}
	
	function reload(){ 
		location.reload()
	}

	function snackbar(text) {
	  var x = document.getElementById("snackbar");
	  $( "#snackbar" ).text(text)
	  x.className = "show";
	  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
	}

});