<?php
	if (count($posts) == 0)
	{
		echo "No post from your followers!!";
	}
?>

<?php foreach($posts as $post): ?>
	
	<h2><?=$post['first_name']?> <?=$post['last_name']?> posted:</h2>
	<?=$post['content']?>
	
	<br><br>
	
<? endforeach; ?>