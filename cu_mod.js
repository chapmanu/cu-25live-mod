
/********
* Beware, beware....
*
* The code within may cause un-intended side effects if the DOM structure of 25 live ever changes. 
*
* You have been forewarned; good luck... 
*********/

if (!window.jQuery) console.log("jQuery is not loaded and so the CU_mod cannot initialize!");

$(document).ready(function() {
	CU_mod.initialize();
});

var CU_mod = {

	// console.debug messages?
	debug_mode : false,

	// Where to send folks when they are done
	teleport_url     : 'http://events.chapman.edu/import/',
	dev_teleport_url : 'http://eventsdev.chapman.edu/import/',

	// Configurables
	seconds_to_watch : 30,
	watcher_id : false,
	dom_callbacks : [],
	click_callbacks : [],

	initialize : function() {

		// When the user clicks save, see if we are on the done page
		CU_mod.addClickIDCallback('wizard_footer_save', CU_mod.startDoneWatcher, true);

		// When the wizard initializes, remove the actions box
		CU_mod.addDOMNodeCallback('s2id_autogen1', CU_mod.removeWizardActions);

		// When a helpful hints popup appears, filter it's contents
		CU_mod.addDOMNodeCallback('select2-drop-mask', CU_mod.filterNotes);

		// When the user clicks next, filter the text on the page
		CU_mod.addClickIDCallback('wizard_footer_next', CU_mod.filterTextOnPage, true);

		//
		// LET THE MADNESS BEGIN
		CU_mod.runTheWatchers();

	},

	runTheWatchers : function() {

		// The DOM Watchers...
		document.addEventListener("DOMNodeInserted", function(event){
			if (event.target.getAttribute === undefined) return;
			var id = event.target.getAttribute('id');
			if (id === null) return;

			if (CU_mod.debug_mode) console.debug('DOM ID inserted: '+id);

			for (i = 0; i < CU_mod.dom_callbacks.length; i++) {
				var item = CU_mod.dom_callbacks[i];
				if (item.skip || id !== item.id) continue;

				item.callback();
				if (item.repeat === false) CU_mod.dom_callbacks[i].skip = true;
			}

		});

		// The Click Watchers...
		if (CU_mod.debug_mode) {
			$('body').on("click", function(event) {
				if (event.target.getAttribute === undefined) return;
				var id = event.target.getAttribute('id');
				if (id === null) return;

				if (CU_mod.debug_mode) console.debug('Click on ID: '+id);

			});
		}

	},

	// Setup a function to fire when an ID is clicked
	addClickIDCallback : function(node_id, callback, repeat) {

		if (repeat === true) {
			$('body').on("click", '#'+node_id, callback);
		} else {
			$('body').one("click", '#'+node_id, callback);
		}

	},

	// Setup a function to fire when a node is added to the DOM
	addDOMNodeCallback : function(node_id, callback, repeat) {
		CU_mod.dom_callbacks.push({
			'id' : node_id,
			'callback' : callback,
			'repeat' : repeat || false
		});
	},

	// Starts watching for the done page
	startDoneWatcher : function() {

		// Clear any previous watchers
		CU_mod.stopDoneWatcher();

		// Start nagging
		CU_mod.watcher_id = setInterval(CU_mod.areWeThereyet, 200);

		// Stop the nagging in a bit
		setTimeout(CU_mod.stopDoneWatcher, 1000 * CU_mod.seconds_to_watch);

	},

	// Stop the watcher
	stopDoneWatcher : function() {
		if (CU_mod.watcher_id === false) return;
		clearInterval(CU_mod.watcher_id);
		CU_mod.watcher_id = false;
	},

	areWeThereyet : function() {
		if (CU_mod.debug_mode) console.debug("Are we there yet?");

		var msg = $('.success-message');
		if (msg.length) CU_mod.addMagicButton();
	},

	// Adds a magic button to the done page
	addMagicButton : function() {

		$container = $('.summary-section-content:eq(2)');

		if ($container.length) {

			// Make sure we don't add it twice
			if ($('.btn-to-publicity').length) return;

			// Add the button
			$container.append(CU_mod.getButtonTemplate());
		}
	},

	// The HTML for the button
	getButtonTemplate : function() {
		return '<div class="button-container" onClick="CU_mod.teleportUser();" style="margin-bottom: 50px;"><button class="btn-email btn-to-publicity" name="calendar" style="background:#a82439 !important; color: #FFF; padding: 10px; font-size:16px;">Create public listing page</button> <div class="button-desc">Go and create a public web page for your event!</div></div>';
	},


	// Takes the user to the CU Event Network (Skynet)
	teleportUser : function() {
		var event_key = $('#wizard_details_reference').text().replace('ID: ', '');
		var event_num = /[0-9]+(?![^\[])/.exec(window.location.hash);

		console.debug('The ID is:'+event_key);
		console.debug('The hash is:'+event_num);

		var domain = (window.location.hostname == 'eventstest.chapman.edu') ? CU_mod.dev_teleport_url : CU_mod.teleport_url;

		var destination = domain+'?25_live_key='+event_key+'&25_live_num='+event_num;

		window.location.href = destination;
	},

	// Hide some wizard actions
	removeWizardActions : function() {
		var $thing = $('#wizard_actions');
		if (! $thing.length) return;

		$thing.html('<h2>Helpful Hints</h2>');
	
	},

	// Filter the notes boxes
	filterNotes : function() {

		// Event types notes
		var $event_type_notes = $('#info_type:contains(Changing the Event Type may update selections for the following)');
		if ($event_type_notes.length) {

			// Delete all nodes after the .separator
			$event_type_notes.find('.separator').nextAll().remove();

			// Delete the seperator
			$event_type_notes.find('.separator').remove();

			// Remove that pesky stray text
			$event_type_notes.html($event_type_notes.html().replace('Changing the Event Type may update selections for the following:', ''));
		}

	},

	// Filter the text on the page
	filterTextOnPage : function() {

		// The calendars heading
		$heading = $('.card-info-text:contains(Select which CALENDARS should publish this event.)');

		if ($heading.length) {
			$heading.html('Select which audiences this event is indented for');

			// Remove some of those pesky comment boxes
			$('.requirement-editor').remove();
		}

	}

};
