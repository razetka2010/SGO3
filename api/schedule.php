<?php
session_start();
require_once '../lib/db.php';
header('Content-Type: application/json');
$action = $_GET['action'] ?? '';
switch ($action) {
   case 'getSchedule':
        $sql = "SELECT * FROM schedule";
        $schedule = fetchAll($conn, $sql);
        echo json_encode(['schedule' => $schedule]);
    break;
    case 'getStudentSchedule':
        if (isset($_SESSION['user_id'])) {
            $sql_student = "SELECT class FROM students WHERE user_id = ?";
             $student_data = fetchOne($conn, $sql_student, [$_SESSION['user_id']]);
             $student_class = $student_data['class'];
            $sql = "SELECT * FROM schedule WHERE class = ?";
            $schedule = fetchAll($conn, $sql, [$student_class]);
            echo json_encode(['schedule' => $schedule]);
           }else{
              echo json_encode(['success' => false, 'message' => 'User not authenticated.']);
          }
       break;
    case 'deleteSchedule':
        $scheduleId = $_GET['id'] ?? null;
           if ($scheduleId) {
             $sql_delete = "DELETE FROM schedule WHERE id = ?";
                $result = executeNonQuery($conn, $sql_delete, [$scheduleId]);
               if($result){
                  echo json_encode(['success' => true]);
                }else{
                  echo json_encode(['success' => false, 'message' => 'Error deleting schedule.']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Schedule id is required.']);
          }
        break;
    default:
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
             $class = $_POST['class'];
            $subject = $_POST['subject'];
            $time = $_POST['time'];
            $teacher = $_POST['teacher'];
             $editId = $_POST['editScheduleId'] ?? null;
             if($editId){
                   $sql_update = "UPDATE schedule SET class = ?, subject = ?, time = ?, teacher = ? WHERE id = ?";
                  $result =  executeNonQuery($conn, $sql_update, [$class, $subject, $time, $teacher, $editId]);
                  if($result){
                    echo json_encode(['success' => true]);
                 }else{
                       echo json_encode(['success' => false, 'message' => 'Error updating schedule.']);
                   }
             }else{
                 $sql_insert = "INSERT INTO schedule (class, subject, time, teacher) VALUES (?, ?, ?, ?)";
                   $result =  executeNonQuery($conn, $sql_insert, [$class, $subject, $time, $teacher]);
                   if($result){
                       echo json_encode(['success' => true]);
                   }else{
                       echo json_encode(['success' => false, 'message' => 'Error inserting schedule.']);
                  }
             }
        }
       break;
}
?>