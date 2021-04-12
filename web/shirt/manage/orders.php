<?
    require '../lib/connect.php';
    require '../lib/processing.php';
    
    
    requireTemplate("orders", [], "manage/templates/");
?>

<?
    function mb_ucfirst($str) {
        $fc = mb_strtoupper(mb_substr($str, 0, 1));
        return $fc.mb_substr($str, 1);
    }
    
    function printOrders ()
    {
        global $connection;
        
        
        $orders = $connection->query("SELECT * FROM `orders` ORDER BY `date`, `order_id` DESC");
        
        while ($order = $orders->fetch_assoc())
        {
            requireTemplate("orders/block", [
                "date" => $order["date"],
                "name" => $order["name"],
                "phone" => $order["phone"],
                "email" => $order["email"],
                "uid" => $order["order_id"]
            ], "manage/templates/");
        }
    }
    
    function printRows ($uid)
    {
        global $connection;
        
        
        $orders = $connection->query("SELECT * FROM `orders.tmp` WHERE `uid`='$uid'")->fetch_assoc();
        
        requireTemplate("orders/row", [], "manage/templates/");
    }
    
    function printDropdown ()
    {
        
    }
    
    
        // $orders = $connection->query("SELECT * FROM `orders` ORDER BY `date`, `order_id` DESC");
        // $order_id = -1;
        // $order_args = [];
        // $subrows = "";
        
        // for ($i = -1; $order = $orders->fetch_assoc();)
        // {
        //     $item_info = $connection->query("
        //         SELECT
        //             `supply.colors`.`name` AS `color`, `supply.types`.`name` AS `name`, `supply.sizes`.`name` AS `size`
        //         FROM `supply`
        //             LEFT JOIN `supply.colors` ON `supply`.`id`='{$order["cid"]}' AND `supply`.`color` = `supply.colors`.`id`
        //             LEFT JOIN `supply.types` ON `supply`.`id`='{$order["cid"]}' AND `supply`.`type` = `supply.types`.`id`
        //             LEFT JOIN `supply.sizes` ON `supply`.`id`='{$order["cid"]}' AND `supply`.`size` = `supply.sizes`.`id`
        //     ")->fetch_assoc();
            
        //     if ($order_id != $order["order_id"])
        //     {
        //         $order_id = $order["order_id"];
                
        //         $order_args[++$i] = [
        //             'arglist' => [
        //                 'date' => $order["date"],
        //                 'name' => $order["name"],
        //                 'phone' => $order["phone"],
        //                 'email' => $order["email"],
        //                 'dropdown' => requireTemplate("ui_dropdown-menu/dropdown", [
        //                     'arglist' => [
        //                         'default' => "Ожидает ответа",
        //                         'select-class' => "status-select",
        //                         'dropdown-class' => "status-dropdown",
        //                         'rows' => requireTemplate("ui_dropdown-menu/dropdown__row", [
        //                             'arglist' => [
        //                                 'name' => "Не ответил"
        //                             ],
        //                             'prefix' => "manage/templates/"
        //                         ])
        //                     ],
        //                     'prefix' => "manage/templates/"
        //                 ]),
        //                 'rows' => "",
        //             ],
        //             'prefix' => "manage/templates/"
        //         ];
        //     }
            
        //     $order_args[$i]["arglist"]["rows"] .= requireTemplate("orders/orders__row", [
        //         'arglist' => [
        //             'tid' => $order["tid"],
        //             'name' => mb_ucfirst($item_info["color"])." ".$item_info["name"],
        //             'size' => $item_info["size"],
        //             'quantity' => $order["quantity"]
        //         ],
        //         'prefix' => "manage/templates/"
        //     ]);
        // }
?>