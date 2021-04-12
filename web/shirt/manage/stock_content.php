<?
    require '../lib/connect.php';
    require '../lib/processing.php';
    
    
    $pages = [];
    $tabs = $connection->query("SELECT `id`, `icon` FROM `supply.types`");
    
    for ($i = 0; $tab_data = $tabs->fetch_assoc(); $i++)
    {
        $pages[] = [];
        $rows = $connection->query("SELECT `id`, `name`, `num` FROM `supply.sizes`");
        
        for ($j = 0; $row_data = $rows->fetch_assoc(); $j++)
        {
            $pages[$i][] = [];
            
            $cells = $connection->query("
                SELECT IFNULL(`supply`.`quantity`, 0) as `quantity` FROM `supply.colors`
                LEFT JOIN `supply` ON `color`=`supply.colors`.`id` AND `size`='{$row_data["id"]}' AND `type`='{$tab_data["id"]}'
                ORDER BY `supply.colors`.`hex`
            ");
            
            while ($cell_data = $cells->fetch_assoc())
                $pages[$i][$j][] = $cell_data["quantity"];
        }
    }
?>

<?= json_encode($pages) ?>