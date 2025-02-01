<?php
session_start();
require_once '../lib/db.php';
header('Content-Type: application/json');
$uploadDir = '../data/';

$action = $_GET['action'] ?? '';
switch ($action) {
    case 'getReports':
       $sql = "SELECT * FROM reports";
       $reports = fetchAll($conn, $sql);
         echo json_encode(['reports' => $reports]);
       break;
    case 'deleteReport':
         $reportId = $_GET['id'] ?? null;
        if ($reportId) {
             $sql_select = "SELECT file_path FROM reports WHERE id = ?";
             $file_data = fetchOne($conn, $sql_select, [$reportId]);
            $file_path = $file_data['file_path'];
                if(file_exists($file_path)){
                     unlink($file_path);
                }
               $sql_delete = "DELETE FROM reports WHERE id = ?";
             $result = executeNonQuery($conn, $sql_delete, [$reportId]);
              if($result){
                echo json_encode(['success' => true]);
               }else{
                 echo json_encode(['success' => false, 'message' => 'Error deleting report.']);
              }
         }else{
               echo json_encode(['success' => false, 'message' => 'Report id is required.']);
         }
       break;
    default:
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
           $name = $_POST['name'];
         $file_name = $_FILES['report_file']['name'];
           $file_tmp = $_FILES['report_file']['tmp_name'];
           if($file_name != ''){
             $file_path = $uploadDir . $file_name;
             if (move_uploaded_file($file_tmp, $file_path)) {
                  $editId = $_POST['editReportId'] ?? null;
                   if($editId){
                      $sql_update = "UPDATE reports SET name = ?, file_path = ? WHERE id = ?";
                      $result = executeNonQuery($conn, $sql_update, [$name, $file_path, $editId]);
                          if($result){
                            echo json_encode(['success' => true]);
                          }else{
                           echo json_encode(['success' => false, 'message' => 'Error updating report.']);
                          }
                  }else{
                     $sql_insert = "INSERT INTO reports (name, file_path) VALUES (?, ?)";
                       $result = executeNonQuery($conn, $sql_insert, [$name, $file_path]);
                       if($result){
                           echo json_encode(['success' => true]);
                        }else{
                          echo json_encode(['success' => false, 'message' => 'Error inserting report.']);
                      }
                 }
              }else{
                 echo json_encode(['success' => false, 'message' => 'Error uploading file.']);
               }
             }else{
                 $editId = $_POST['editReportId'] ?? null;
                    if($editId){
                       $sql_update = "UPDATE reports SET name = ? WHERE id = ?";
                       $result = executeNonQuery($conn, $sql_update, [$name, $editId]);
                         if($result){
                            echo json_encode(['success' => true]);
                          }else{
                              echo json_encode(['success' => false, 'message' => 'Error updating report.']);
                          }
                    }else{
                       echo json_encode(['success' => false, 'message' => 'File is required.']);
                    }
             }
        }
       break;
}
?>