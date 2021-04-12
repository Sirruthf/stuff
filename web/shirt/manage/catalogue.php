<?
    require '../lib/connect.php';
    require '../lib/processing.php';
    require 'lib/fetch_category.php';
    
    
    $current_url = $_SERVER['QUERY_STRING'];
    
    requireTemplate("catalogue", [
        "current_url" => $current_url
    ], "manage/templates/");
?>

<?
    function printGroups () {
        global $connection;
        
        
        $rows = $connection->query("SELECT * FROM `merch.categories` WHERE `id`>0 AND `is_master`=TRUE ORDER BY `cat_id` ASC") or die($connection->error);
        
        while ($row = $rows->fetch_assoc()) {
            requireTemplate("catalogue/cat-row-group", [
                "name" => $row["loc_name"],
                "url" => $row["url"],
                "id" => $row["cat_id"],
                "selected" => false
            ], "manage/templates/");
        }
    }
    
    function printRows ($parent) {
        global $connection;
        
        
        $rbound = $parent + 100;
        $rows = $connection->query("SELECT * FROM `merch.categories` WHERE `cat_id`>$parent AND `cat_id`<$rbound") or die($connection->error);
        
        while ($row = $rows->fetch_assoc()) {
            requireTemplate("catalogue/cat-row", [
                "name" => $row["loc_name"],
                "url" => $row["url"],
                "id" => $row["cat_id"],
                "selected" => false
            ], "manage/templates/");
        }
    }
    
    function printItems () {
        global $connection;
        
        
        $items = $connection->query("SELECT * FROM `merch` ORDER BY `date_updated` DESC") or die($connection->error);
        
        while ($item = $items->fetch_assoc()) {
            requireTemplate("catalogue/row", [
                "tid" => $item["tid"],
                "cat_id" => $item["cat_id"],
                "preview" => $item["preview"],
                "shirt_name" => $item["name"],
                "shirt_price" => $item["price"],
                "shirt_discount" => $item["discount"],
                "shirt_comment" => $item["shirt_desc"],
            ], "manage/templates/");
        }
    }
    
    function printFotos ($tid) {
        global $connection;
        
        
        $item = $connection->query("SELECT * FROM `merch` WHERE `tid`='$tid'")->fetch_assoc();
        $pics = json_decode($item["pic"]);
        
        if ($pics) {
            $i = 0; foreach ($pics as $pic) {
                requireTemplate("catalogue/row-image", [
                    "is_preview" => $pic == $item["preview"],
                    "name" => $pic,
                    "tid" => $item["tid"],
                ], "manage/templates/");
            }
        }
    }
    
    function printDropdown () {
        requireTemplate("ui_dropdown-menu/dropdown", [
              'default' => "Все",
              'select_class' => "control-cat-select",
              'dropdown_class' => "control-cat-dropdown",
              'text_class' => "control-cat-select__text",
            ],
            "manage/templates/"
        );
    }
    
    function printDDRows () {
        global $connection;
        
        
        $cats = $connection->query("SELECT * FROM `merch.categories`") or die($connection->error);
        
        while ($cat = $cats->fetch_assoc()) {
            requireTemplate("ui_dropdown-menu/dropdown__title-row", [
                "name" => $cat["loc_name"],
                "parent_class" => $cat["url"],
            ], "manage/templates/");
        }
    }
    
?>



