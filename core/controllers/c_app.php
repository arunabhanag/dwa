<?php

class app_controller {

	public function __construct() {	
	}


	/*-------------------------------------------------------------------------------------------------
		
	-------------------------------------------------------------------------------------------------*/
	public function index() {
					    
	    # Cookies
		    echo Debug::dump($_COOKIE,"Cookies");

	}
	
	
	/*-------------------------------------------------------------------------------------------------
	
	-------------------------------------------------------------------------------------------------*/
	public function clear_cookies() {
	
		foreach ( $_COOKIE as $key => $value ) {
			setcookie( $key, $value, time() - 3600, '/' );
		}
	
		echo "Cleared Cookies";
	}

} // eoc