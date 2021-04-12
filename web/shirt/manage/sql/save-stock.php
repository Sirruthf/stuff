<?
    require '../../lib/connect.php';
    
    
    $data = json_decode($_POST['data']);
    
    for ($i = 0; $i < count($data); $i++)
    {
        switch ($data[$i]->type)
        {
            case "to_add":
                $connection->query("INSERT INTO `supply`(`type`, `size`, `color`, `quantity`) VALUES('".$data[$i]->page_type."', '".$data[$i]->size."', '".$data[$i]->color."', '".$data[$i]->quantity."')") or die($connection->error);
            break;
            case "to_update":
                var_dump("UPDATE `supply` SET `quantity`='".$data[$i]->quantity."' WHERE `id`=".$data[$i]->id);
                $connection->query("UPDATE `supply` SET `quantity`='".$data[$i]->quantity."' WHERE `id`=".$data[$i]->id) or die($connection->error);
            break;
            case "to_delete":
                $connection->query("DELETE FROM `supply` WHERE `id`='".$data[$i]->id."'") or die($connection->error);
            break;
        }
    }
?>