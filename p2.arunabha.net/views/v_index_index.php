<!-- textarea for making a new post -->
<form method='POST' action='/posts/p_add'>
	<strong>New Post:</strong><br>
	<textarea name='content'></textarea>
	<br><br>
	<input type='submit' value="Post">
</form>

<!-- Show own posts -->
<?php 
	$posts  = View::instance('_v_post');
	$posts->heading = "Your last post";
	$posts->posts = $own_posts;
	echo $posts;
?>

<!-- Show all posts from the followed users -->
<?php 
	$posts  = View::instance('_v_post');
	$posts->heading = "Posts from users you are following";
	$posts->posts = $followed_posts;
	echo $posts;
?>










