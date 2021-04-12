<? require '../lib/connect.php'; ?>
<? require '../lib/processing.php'; ?>
<?
    $cats = $connection->query("SELECT * FROM `merch.categories` WHERE `cat_id`>0 ORDER BY `cat_id`");
    
    $data = [];
    
    for ($i = -1; $category = $cats->fetch_assoc();)
    {
        if ($category["is_master"])
        {
            $data[++$i] = [
                'assoc' => $category["cat_id"],
                'loc_name' => $category["loc_name"],
                'url' => $category["url"],
                
                'rows' => []
            ];
        }
        else
        {
            $data[$i]["rows"][] = [
                'id' => $category["cat_id"],
                'loc_name' => $category["loc_name"],
                'url' => explode("/", $category["url"])[1]
            ];
        }
    }
    
?>

{
    "data": <?= json_encode($data) ?>
}