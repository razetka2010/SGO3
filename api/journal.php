<?php
session_start();
require_once '../lib/db.php';
header('Content-Type: application/json');
$action = $_GET['action'] ?? '';
switch ($action) {
   case 'getClassesAndSubjects':
        $sql_classes = "SELECT DISTINCT class FROM students";
        $classes = fetchAll($conn, $sql_classes);
          $classesArray = array_map(function($row) { return $row['class']; }, $classes);
        $sql_subjects = "SELECT DISTINCT subject FROM journal";
         $subjects = fetchAll($conn, $sql_subjects);
        $subjectsArray = array_map(function($row) { return $row['subject']; }, $subjects);
         echo json_encode(['classes' => $classesArray, 'subjects' =>  $subjectsArray]);
      break;
   case 'getClassJournal':
       $selected_class = $_GET['class'] ?? '';
       $selected_subject = $_GET['subject'] ?? '';
         if (!empty($selected_class) && !empty($selected_subject)) {
              $sql = "SELECT students.name AS student_name, journal.mark FROM journal
                    JOIN students ON journal.student_id = students.id
                     WHERE students.class = ? AND journal.subject = ?";
               $marks = fetchAll($conn, $sql, [$selected_class, $selected_subject]);
              echo json_encode(['marks' => $marks]);
         }
       break;
     case 'getJournalData':
        $selected_class = $_GET['class'] ?? '';
        $selected_subject = $_GET['subject'] ?? '';
           if (!empty($selected_class) && !empty($selected_subject)) {
                $sql = "SELECT students.id as student_id, users.name, journal.id as journal_id, journal.mark, journal.homework_path, attendance.attendance_date FROM students
                 JOIN users ON students.user_id = users.id
                  LEFT JOIN journal ON students.id = journal.student_id AND journal.subject = ?
                  LEFT JOIN attendance ON students.id = attendance.student_id AND attendance.attendance_date = CURDATE()
                WHERE students.class = ?";
                $journal = fetchAll($conn, $sql, [$selected_subject, $selected_class]);
                 echo json_encode(['journal' => $journal]);
            }
      break;
     case 'deleteMark':
          $markId = $_GET['id'] ?? null;
           if ($markId) {
               $sql_delete = "DELETE FROM journal WHERE id = ?";
                $result = executeNonQuery($conn, $sql_delete, [$markId]);
                if($result){
                   echo json_encode(['success' => true]);
                }else{
                    echo json_encode(['success' => false, 'message' => 'Error deleting mark.']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Mark id is required.']);
            }
      break;
      case 'addMark':
         if($_SERVER['REQUEST_METHOD'] === 'POST'){
                $student_id = $_POST['student_id'];
               $mark = $_POST['mark'];
                 $sql_insert = "INSERT INTO journal (student_id, subject, mark) VALUES (?, ?, ?)";
                $result = executeNonQuery($conn, $sql_insert, [$student_id, $_POST['subject'], $mark]);
                 if($result){
                     echo json_encode(['success' => true]);
                 }else{
                      echo json_encode(['success' => false, 'message' => 'Error adding mark.']);
                }
            }
      break;
    case 'editMark':
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $editId = $_POST['editId'];
             $mark = $_POST['mark'];
                $sql_update = "UPDATE journal SET mark = ? WHERE id = ?";
               $result = executeNonQuery($conn, $sql_update, [$mark, $editId]);
              if($result){
                 echo json_encode(['success' => true]);
              }else{
                  echo json_encode(['success' => false, 'message' => 'Error updating mark.']);
             }
        }
      break;
     case 'setAttendance':
         if($_SERVER['REQUEST_METHOD'] === 'POST'){
              $student_id = json_decode(file_get_contents("php://input"), true)['student_id'];
              $attendance_date = date("Y-m-d");
                $sql_check = "SELECT * FROM attendance WHERE student_id = ? AND attendance_date = ?";
               $check_result =  fetchOne($conn, $sql_check, [$student_id, $attendance_date]);
              if ($check_result) {
                   $sql_update = "UPDATE attendance SET attendance_date = ? WHERE student_id = ?";
                  $result = executeNonQuery($conn, $sql_update, [$attendance_date, $student_id]);
                     if($result){
                        echo json_encode(['success' => true]);
                    }else{
                         echo json_encode(['success' => false, 'message' => 'Error updating attendance.']);
                    }
              } else {
                  $sql_insert = "INSERT INTO attendance (student_id, attendance_date) VALUES (?, ?)";
                     $result = executeNonQuery($conn, $sql_insert, [$student_id, $attendance_date]);
                     if($result){
                      echo json_encode(['success' => true]);
                     }else{
                         echo json_encode(['success' => false, 'message' => 'Error inserting attendance.']);
                     }
                 }

        }
        break;
      case 'addHomework':
          if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                 $uploadDir = '../data/';
                 $file_name = $_FILES['homework_file']['name'];
                $file_tmp = $_FILES['homework_file']['tmp_name'];
                 $student_id = $_POST['student_id'];
                 $file_path = $uploadDir . $file_name;
                 if(move_uploaded_file($file_tmp, $file_path)){
                       $sql_update = "UPDATE journal SET homework_path = ? WHERE student_id = ?";
                       $result = executeNonQuery($conn, $sql_update, [$file_path, $student_id]);
                        if($result){
                            echo json_encode(['success' => true]);
                         }else{
                             echo json_encode(['success' => false, 'message' => 'Error inserting homework.']);
                         }
                }
          }
        break;
}
?>