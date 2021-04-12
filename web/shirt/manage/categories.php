<?
    require '../lib/connect.php';
    require '../lib/processing.php';
    
    
    requireTemplate("categories", [], "manage/templates/");
?>

<?    
    function printParent () {
        global $connection;
        
        
        $cats = $connection->query("SELECT * FROM `merch.categories` WHERE `cat_id`>0 AND `is_master` IS TRUE") or die($connection->error);
        
        for ($i = 0; $category = $cats->fetch_assoc(); $i++)
        {
            requireTemplate("categories/title-row", [
                    "id" => $category["cat_id"],
                    "loc_name" => $category["loc_name"],
                    "url" => $category["url"],
                    "assoc" => 0,
                    "rename-icon" => "img/cat__rename-button.svg",
                    "copy-icon" => "img/cat__copy-button.svg",
                    "del-icon" => "img/cat__del-button.svg",
                    "selected" => $i == 0
                ],
                "manage/templates/"
            );
        }
    }
    
    function printPage () {
        global $connection;
        
        
        $cats = $connection->query("SELECT * FROM `merch.categories` WHERE `cat_id`>0 AND `is_master` IS TRUE") or die($connection->error);
        
        for ($i = 0; $category = $cats->fetch_assoc(); $i++)
        {
            requireTemplate("categories/page", [
                    "assoc" => $category["cat_id"],
                    "cat_name" => $category["loc_name"],
                    "url" => $category["url"],
                    "selected" => $i == 0
                ],
                "manage/templates/"
            );
        }
    }
    
    function printRows ($assoc) {
        global $connection;
        
        
        $rows = $connection->query("SELECT * FROM `merch.categories` WHERE `cat_id`>$assoc AND `cat_id`<$assoc + 100") or die($connection->error);
        
        while ($row = $rows->fetch_assoc())
        {
            requireTemplate("categories/row", [
                'id' => $row["cat_id"],
                'loc_name' => $row["loc_name"],
                'url_prep' => explode("/", $row["url"])[0],
                'url' => explode("/", $row["url"])[1],
                'rename-icon' => "img/cat__rename-button.svg",
                'copy-icon' => "img/cat__copy-button.svg",
                'del-icon' => "img/cat__del-button.svg"
            ], "manage/templates/");
        }
    }
?>

