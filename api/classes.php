<?php
session_start();
require_once '../lib/db.php';
header('Content-Type: application/json');
$action = $_GET['action'] ?? '';
switch($action){
    case 'getClassesAndSubjects':
            $sql_classes = "SELECT DISTINCT class FROM students";
            $classes = fetchAll($conn, $sql_classes);
              $classesArray = array_map(function($row) { return $row['class']; }, $classes);
            $sql_subjects = "SELECT DISTINCT subject FROM journal";
             $subjects = fetchAll($conn, $sql_subjects);
             $subjectsArray = array_map(function($row) { return $row['subject']; }, $subjects);
                echo json_encode(['classes' => $classesArray, 'subjects' =>  $subjectsArray]);
        break;
}
?>