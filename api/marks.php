<?php
session_start();
require_once '../lib/db.php';
header('Content-Type: application/json');
$action = $_GET['action'] ?? '';
switch($action){
    case 'getStudentMarks':
        if (isset($_SESSION['user_id'])) {
              $sql_marks = "SELECT journal.subject, journal.mark FROM journal
                  JOIN students ON journal.student_id = students.id
                  WHERE students.user_id = ?";
            $marks = fetchAll($conn, $sql_marks, [$_SESSION['user_id']]);
                echo json_encode(['marks' => $marks]);
        }else{
              echo json_encode(['success' => false, 'message' => 'User not authenticated.']);
        }
     break;
}
?>