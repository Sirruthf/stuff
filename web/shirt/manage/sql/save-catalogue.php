<?
    require '../../lib/connect.php';
    
    
    $data = json_decode($_POST["data"]);
    
    var_dump($data);
    
    for ($i = 0; $i < count($data); $i++) {
        switch ($data[$i]->type) {
            case "to_add":
                queryInsert($data[$i]->catId, $data[$i], $connection);
                break;
            
            case "to_update":
                queryUpdate($data[$i]->id, $data[$i], $connection);
                break;
            
            case "to_del":
                queryRemove($data[$i]->id, $connection);
                break;
            
            case "img_to_del":
                queryRemoveImg($data[$i]->tid, $data[$i]->imgid, $connection);
                break;
        }
    }
    
    
    function queryInsert ($cat, $data_slice, $connection) {
        $connection->query("
            INSERT INTO `merch`(`tid`, `cat_id`) VALUES (
                (SELECT LPAD(MAX(`tid`) + 1, 5, 0) FROM `merch` as `prev`),
                (SELECT `cat_id` FROM `merch.categories` WHERE `url`='$cat' LIMIT 1)
            )
        ") or die($connection->error);
        
        
        $tid = $connection->query("SELECT `tid` FROM `merch` WHERE `id`=LAST_INSERT_ID()");
        $tid = $tid->fetch_assoc()["tid"];
        
        if (!is_dir("../../img/product/$tid"))
            mkdir("../../img/product/$tid");
        
        
        queryUpdate($tid, $data_slice, $connection);
    }
    
    function queryUpdate ($tid, $data_slice, $connection) {
        $current = $connection->query("SELECT `pic` FROM `merch` WHERE `tid`='$tid'")->fetch_assoc()["pic"];
        $current = $current != "" ? json_decode($current) : [];
        
        $files = storeFiles($tid, $current, $data_slice->img_ref);
        
        $cat = $data_slice->catId;
        $name = $data_slice->name;
        $price = $data_slice->price;
        $discount = $data_slice->discount;
        $comment = $data_slice->comment;
        
        $preview = $files[$data_slice->preview] ? $files[$data_slice->preview] : $data_slice->preview;
        $piclist = json_encode(array_merge($current, array_values($files)));
        
        $connection->query("UPDATE `merch` SET 
            `name`='$name', `price`=$price, `discount`=$discount, `shirt_desc`='$comment', 
            `preview`='$preview', `pic`='$piclist', `cat_id`=(SELECT `cat_id`
        FROM `merch.categories` WHERE `url`='$cat' LIMIT 1) WHERE `tid`='$tid'") or die($connection->error);
    }
    
    function queryRemove ($id, $connection) {
        $pics = $connection->query("SELECT `pics` FROM `merch` WHERE `tid`='$id'");
        
        if ($pics)
        {
            $pics = json_decode($pics->fetch_assoc()["pics"]);
            foreach ($pics as $pic) unlink("../../img/product/$id/$pic");
            rmdir("../../img/product/$id/");
        }
        
        $connection->query("DELETE FROM `merch` WHERE `tid`='$id'") or die($connection->error);
    }
    
    function queryRemoveImg ($tid, $name, $connection) {
        $current = $connection->query("SELECT `pic` FROM `merch` WHERE `tid`='$tid' LIMIT 1");
        $current = json_decode($current->fetch_assoc()['pic']);
        
        for ($j = 0; $j < count($current); $j++)
        {
            if ($current[$j] == $name)
            {
                unset($current[$j]);
                @unlink("../../img/product/$tid/$name");
            }
        }
        
        $current = array_values($current);
        $current = json_encode($current);
        $connection->query("UPDATE `merch` SET `pic`='$current' WHERE `tid`='$tid' LIMIT 1");
    }
    
    function storeFiles ($tid, $current, $img_ref) {
        $result = [];
        
        for ($i = 0; $i < count($img_ref); $i++)
        {
            $files = $_FILES[$img_ref[$i]]["tmp_name"];
            var_dump($_FILES);
            echo "\n\n";
            
            $j = 1;
            $filename = makeFilename($j);
            
            for ($u = 0; $u < count($current); $u++) {
                if ($filename == $current[$u]) {
                    $filename = makeFilename(++$j);
                    $u = 0;
                }
            }
            
            move_uploaded_file($files, "../../img/product/$tid/$filename");
            
            $result[$img_ref[$i]] = $filename;
            $current[] = $filename;
        }
        
        return $result;
    }
    
    function makeFileList ($n) {
        $result = [];
        
        for ($i = 0; $i < $n; $i++)
            $result[] = makeFilename($i + 1);
        
        return json_encode($result);
    }
    
    function makeFilename ($n) {
        return str_pad($n, 2, 0, STR_PAD_LEFT).".png";
    }
?>