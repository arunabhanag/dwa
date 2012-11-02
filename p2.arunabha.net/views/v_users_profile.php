<!-- user's name -->
<h3>Name: <?php echo $user->first_name." ".$user->last_name;?></h3>

<!-- show email-id, date created and delete-account link if it is a private view -->
<?php if($private_profile == true): ?>
	<h3>email: <?php echo $user->email; ?></h3>
	<h3>Created: <?php echo Time::display($user->created); ?></h3>
	<a href='/users/delete' >Delete Account</a> 
<? endif; ?>

<!-- show all the posts made by this user -->
<?php 
	$posts_view = View::instance('_v_post');
	$posts_view->heading = $user->first_name."'s posts";
	$posts_view->posts = $posts;
	echo $posts_view;
?>

