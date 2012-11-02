<!-- textarea for making a new post -->
<form method='POST' action='/posts/p_add'>
	<strong>New Post:</strong><br>
	<textarea name='content'></textarea>
	<br><br>
	<input type='submit'>
</form>

<!-- Show all posts from the followed users -->
<?php 
	$posts  = View::instance('_v_post');
	$posts->heading = "Posts from followed users";
	$posts->posts = $followed_posts;
	echo $posts;
?>










