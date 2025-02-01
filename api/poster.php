<?php
session_start();
require_once '../lib/db.php';
header('Content-Type: application/json');
$uploadDir = '../images/';
$action = $_GET['action'] ?? '';
switch($action){
    case 'getPoster':
         $sql = "SELECT poster_path FROM settings";
           $poster_data = fetchOne($conn, $sql);
          if($poster_data){
               echo json_encode(['poster_path' => $poster_data['poster_path']]);
            }else{
                 echo json_encode(['poster_path' => null]);
            }
         break;
    default:
      if (isset($_POST['uploadPoster'])) {
                $file_name = $_FILES['poster_file']['name'];
                 $file_tmp = $_FILES['poster_file']['tmp_name'];
                 $file_path = $uploadDir . $file_name;
                   if (move_uploaded_file($file_tmp, $file_path)) {
                       $sql_update = "UPDATE settings SET poster_path = ?";
                       $result = executeNonQuery($conn, $sql_update, [$file_path]);
                         if($result){
                             echo json_encode(['success' => true]);
                          }else{
                              echo json_encode(['success' => false, 'message' => 'Error updating poster.']);
                          }

                }
        }
       break;
}
?>