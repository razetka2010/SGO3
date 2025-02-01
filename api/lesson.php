<?php
session_start();
require_once '../lib/db.php';
header('Content-Type: application/json');
$action = $_GET['action'] ?? '';
switch($action){
      case 'getSubjects':
           $sql_subjects = "SELECT DISTINCT subject FROM lessons";
          $subjects = fetchAll($conn, $sql_subjects);
         $subjectsArray = array_map(function($row) { return $row['subject']; }, $subjects);
          echo json_encode(['subjects' => $subjectsArray]);
      break;
   case 'getLessonsData':
        $selected_subject = $_GET['subject'] ?? null;
            if($selected_subject){
               $sql = "SELECT * FROM lessons WHERE subject = ?";
                $lessons = fetchAll($conn, $sql, [$selected_subject]);
                  echo json_encode(['lessons' => $lessons]);
            }
       break;
   case 'deleteLesson':
       $lessonId = $_GET['id'] ?? null;
         if($lessonId){
            $sql_delete = "DELETE FROM lessons WHERE id = ?";
            $result = executeNonQuery($conn, $sql_delete, [$lessonId]);
            if($result){
                  echo json_encode(['success' => true]);
              }else{
                  echo json_encode(['success' => false, 'message' => 'Error deleting lesson.']);
               }
          }else{
                echo json_encode(['success' => false, 'message' => 'Lesson id is required.']);
          }
        break;
    default:
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
              $theme = $_POST['theme'];
               $subject = $_POST['subject'];
                $editId = $_POST['editLessonId'] ?? null;
            if($editId){
                  $sql_update = "UPDATE lessons SET theme = ? WHERE id = ?";
                  $result = executeNonQuery($conn, $sql_update, [$theme, $editId]);
                   if($result){
                      echo json_encode(['success' => true]);
                     }else{
                       echo json_encode(['success' => false, 'message' => 'Error updating lesson.']);
                     }
              }else{
                   $sql_insert = "INSERT INTO lessons (subject, theme) VALUES (?, ?)";
                   $result =  executeNonQuery($conn, $sql_insert, [$subject, $theme]);
                    if($result){
                        echo json_encode(['success' => true]);
                     }else{
                          echo json_encode(['success' => false, 'message' => 'Error inserting lesson.']);
                      }
                }

        }
        break;
}
?>