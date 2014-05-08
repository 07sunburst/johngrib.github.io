var client = new Dropbox.Client({
	key : 'dbbt2f75xhg81ek'
});

var taskTable;

$(function() {
	// Insert a new task record into the table.
	function insertTask(text) {
		taskTable.insert({
			taskname : text,
			created : new Date(),
			completed : false
		});
	}

	// updateList will be called every time the table changes.
	function updateList() {
		$('#tasks').empty();

		var records = taskTable.query();

		// Sort by creation time.
		records.sort(function(taskA, taskB) {
			if (taskA.get('created') < taskB.get('created'))
				return -1;
			if (taskA.get('created') > taskB.get('created'))
				return 1;
			return 0;
		});

		// Add an item to the list for each task.
		for ( var i = 0; i < records.length; i++) {
			var record = records[i];
			$('#tasks').append(
					renderTask(record.getId(), record.get('completed'), record
							.get('taskname')));
		}

		addListeners();
		$('#newTask').focus();
	}

	// The login button will start the authentication process.
	$('#loginButton').click(function(e) {
		e.preventDefault();
		// This will redirect the browser to OAuth login.
		client.authenticate();
	});

	// Try to finish OAuth authorization.
	client.authenticate({
		interactive : false
	}, function(error) {
		if (error) {
			alert('Authentication error: ' + error);
		}
	});

	if (client.isAuthenticated()) {
		// Client is authenticated. Display UI.
		$('#loginButton').hide();
		$('#main').show();

		client.getDatastoreManager().openDefaultDatastore(
				function(error, datastore) {
					if (error) {
						alert('Error opening default datastore: ' + error);
					}

					taskTable = datastore.getTable('tasks');

					// Populate the initial task list.
					updateList();

					// Ensure that future changes update the list.
					datastore.recordsChanged.addListener(updateList);
				});
	}

	// Set the completed status of a task with the given ID.
	function setCompleted(id, completed) {
		taskTable.get(id).set('completed', completed);
	}

	// Delete the record with a given ID.
	function deleteRecord(id) {
		taskTable.get(id).deleteRecord();
	}

	// Render the HTML for a single task.
	function renderTask(id, completed, text) {
		return $('<li>').attr('id', id).append(
				$('<button>').addClass('delete').html('&times;')).append(
				$('<span>').append(
						$('<button>').addClass('checkbox').html('&#x2713;'))
						.append($('<span>').addClass('text').text(text)))
				.addClass(completed ? 'completed' : '');
	}

	// Register event listeners to handle completing and deleting.
	function addListeners() {
		$('span').click(function(e) {
			e.preventDefault();
			var li = $(this).parents('li');
			var id = li.attr('id');
			setCompleted(id, !li.hasClass('completed'));
		});

		$('button.delete').click(function(e) {
			e.preventDefault();
			var id = $(this).parents('li').attr('id');
			deleteRecord(id);
		});
	}

	// Hook form submit and add the new task.
	$('#addForm').submit(function(e) {
		e.preventDefault();
		if ($('#newTask').val().length > 0) {
			insertTask($('#newTask').val());
			$('#newTask').val('');
		}
		return false;
	});

	$('#newTask').focus();
});

(function(){
	var ip = /.*(iphone|ipad).*/i;
	var userAgent = navigator.userAgent.toLowerCase();
	if(ip.test(userAgent)){
		alert('iiiipppphone!');	
	} else if(userAgent.match('iphone')) {
		alert('::'+userAgent+'::');
		document.write('<link rel="apple-touch-icon" href="todo.png" />') 
	} else if(userAgent.match('ipad')) {
		document.write('<link rel="apple-touch-icon" sizes="72*72" href="todo.png" />')
	} else if(userAgent.match('ipod')) {
		document.write('<link rel="apple-touch-icon" href="todo.png" />') 
	} else if(userAgent.match('android')) {
		document.write('<link rel="shortcut icon" href="favicon.ico" />') 
	} else {
		document.write('<link rel="shortcut icon" href="favicon.ico" />') 
	}
})();
