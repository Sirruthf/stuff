<?
    require '../../lib/connect.php';
    
    
    $data = json_decode($_POST["data"]);
    $parent_converter = [];
    
    var_dump($data);
    
    for ($i = 0; $i < count($data); $i++) 
    {
        if ($data[$i]->type == "to_add")
        {
            $parent = $data[$i]->parent;
            
            if ($parent_converter[$parent])
                $data[$i]->parent = $parent_converter[$parent];
            
            if ($data[$i]->parent > 0)
                addSubCat($data[$i], $connection);
            else
                $parent_converter[$data[$i]->id] = addCat($data[$i], $connection);
        }
        
        if ($data[$i]->type == "to_update")
        {
            $id = $data[$i]->id;
            $name = $data[$i]->name;
            $url = $data[$i]->url;
            
            $connection->query("UPDATE `merch.categories` SET `loc_name`='$name', `url`='$url' WHERE `cat_id`='$id'") or die($connection->error);
        }
        
        if ($data[$i]->type == "to_delete")
            $connection->query("DELETE FROM `merch.categories` WHERE `cat_id`>=".($data[$i]->id)." AND `cat_id` < ".($data[$i]->id + 100)) or die($connection->error);
            
    }
    
    
    function addSubCat ($data, $connection) {
        $parent = $data->parent;
        $rbound = $parent + 100;
        $name = $data->name;
        $url = $data->url;
        
        $connection->query("
            INSERT INTO `merch.categories`(`loc_name`, `url`, `cat_id`) VALUES('$name', '$url', (
                SELECT `cat_id` + 1 as `gap`
                    FROM
                        `merch.categories` as `mi`
                    WHERE 
                        `cat_id` >= $parent AND `cat_id` < $rbound AND
                        NOT EXISTS (
                            SELECT NULL
                            FROM   `merch.categories` as `mo`
                            WHERE  `mo`.`cat_id` = `mi`.`cat_id` + 1
                        )
                    ORDER BY
                        `cat_id`
                    LIMIT 1
                )
            )
        ") or die($connection->error);
    }
    
    /** @returns inserted $id */
    function addCat ($data, $connection) {
        $id = $connection->query("
            SELECT `cat_id` + 100 as `gap`
                FROM   `merch.categories` as `mi`
                WHERE 
                   `cat_id` > 0 AND `cat_id` % 100 = 0 AND
                NOT EXISTS (
                    SELECT NULL
                    FROM   `merch.categories` as `mo`
            WHERE  `mo`.`cat_id` = `mi`.`cat_id` + 100
        )")->fetch_assoc()["gap"];
        
        $name = $data->name;
        $url = $data->url;
        
        $connection->query("INSERT INTO `merch.categories`(`loc_name`, `url`, `cat_id`, `is_master`) VALUES('$name', '$url', $id, TRUE)") or die ($connection->error);
        
        return $id;
    }
?>