<?php

class index_controller extends base_controller {

	public function __construct() {
		parent::__construct();
	} 
	
	/*-------------------------------------------------------------------------------------------------
	Access via http://yourapp.com/index/index/
	-------------------------------------------------------------------------------------------------*/
	public function index() {
		
		#User not logged in.
		if(!$this->user) 
		{
			Router::redirect("/users");
		}
		#User logged in.
		
		# Load CSS / JS
		$client_files = Array("/js/sketcher.js");
		$this->template->client_files = Utils::load_client_files($client_files);
		
		# Set up view
		$this->template->content = View::instance('v_index_index');

		# Render view
		echo $this->template;
		
	}
} // end class
