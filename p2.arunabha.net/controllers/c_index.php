<?php

class index_controller extends base_controller {

	public function __construct() {
		parent::__construct();
	} 
	
	/*-------------------------------------------------------------------------------------------------
	Access via http://yourapp.com/index/index/
	-------------------------------------------------------------------------------------------------*/
	public function index() {
		
		# Setup view
		$this->template->content = null;
			
		# Render template
		echo $this->template;
	}
} // end class
