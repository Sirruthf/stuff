<?
    require '../lib/connect.php';
    require '../lib/processing.php';
    

    requireTemplate("stock", [], "manage/templates/");
    
    
    
    function printTabs ()
    {
        global $connection;
        
        $tabs = $connection->query("SELECT `id`, `icon` FROM `supply.types`");
        
        $i = 0; while ($tab_data = $tabs->fetch_assoc())
        {
            requireTemplate("stock/stock__tab", [
                    'assoc' => $tab_data["id"],
                    'tab_icon' => "../{$tab_data["icon"]}",
                    'is_selected' => $i++ == 0,
                ], "manage/templates/"
            );
        }
    }
    
    function printPages ()
    {
        global $connection;
        
        $tabs = $connection->query("SELECT `id` FROM `supply.types`");
        
        $i = 0; while ($tab_data = $tabs->fetch_assoc())
        {
            requireTemplate("stock/stock__page", [
                    'id' => $tab_data["id"],
                    'assoc' => $tab_data["id"],
                    'is_selected' => $i++ == 0,
                ], "manage/templates/"
            );
        }
    }
    
    function printRows ($tab_id)
    {
        global $connection;
        
        $rows = $connection->query("SELECT `id`, `name`, `num` FROM `supply.sizes`");
        
        while ($row_data = $rows->fetch_assoc())
        {
            requireTemplate("stock/stock__row", [
                    'id' => $row_data["id"],
                    'size_num' => $row_data["num"],
                    'size_name' => $row_data["name"],
                    'tab_id' => $tab_id
                ], "manage/templates/"    
            );
        }
    }
    
    function printCells ($row_id, $tab_id)
    {
        global $connection;
        
        $cells = $connection->query("
            SELECT IFNULL(`supply`.`id`, '') as `id`, IFNULL(`quantity`, 0) as `quantity`, `hex`, `supply.colors`.`id` as `color_id`, `is_light` FROM `supply.colors`
                LEFT JOIN `supply` ON `supply.colors`.`id`=`color`
            AND `size`='$row_id' AND `type`='$tab_id' ORDER BY `hex`
        ") or die($connection->error);
        
        while ($cell_data = $cells->fetch_assoc()) {
            requireTemplate("stock/stock__cell", [
                    'id' => $cell_data["id"],
                    'color_id' => $cell_data["color_id"],
                    'quantity' => $cell_data["quantity"],
                    'color' => $cell_data["hex"],
                    'too_bright' => $cell_data["is_light"]
                ], "manage/templates/"
            );
        }
    }
?>