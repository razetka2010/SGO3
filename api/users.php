<?php
session_start();
require_once '../lib/db.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
switch ($action) {
    case 'getUsers':
        $sql = "SELECT users.*, students.class, students.letter FROM users LEFT JOIN students ON users.id = students.user_id";
        $users = fetchAll($conn, $sql);
        echo json_encode(['users' => $users]);
        break;
    case 'deleteUser':
        $userId = $_GET['id'] ?? null;
        if ($userId) {
            $sql_delete = "DELETE FROM users WHERE id = ?";
            $result = executeNonQuery($conn, $sql_delete, [$userId]);
            if ($result) {
               $sql_student_delete = "DELETE FROM students WHERE user_id = ?";
               executeNonQuery($conn, $sql_student_delete, [$userId]);
               echo json_encode(['success' => true]);
             } else {
               echo json_encode(['success' => false, 'message' => 'Error deleting user.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'User id is required.']);
        }
        break;
    default:
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $login = trim($_POST['login']);
            $password = $_POST['password'] ?? null;
            $name = htmlspecialchars(trim($_POST['name']));
            $role = $_POST['role'];

            if (empty($login) || empty($name) || empty($role)) {
                echo json_encode(['success' => false, 'message' => 'Пожалуйста, заполните все поля.']);
            } else {
                $editId = $_POST['editId'] ?? null;
                if ($editId) {
                     $sql_update = "UPDATE users SET login = ?, name = ?, role = ? WHERE id = ?";
                     $result =  executeNonQuery($conn, $sql_update, [$login, $name, $role, $editId]);
                    if($password){
                         $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                        $sql_update_password = "UPDATE users SET password = ? WHERE id = ?";
                       executeNonQuery($conn, $sql_update_password, [$hashedPassword, $editId]);
                   }
                       if ($role == 'student') {
                          $class = $_POST['class'] ?? null;
                           $letter = $_POST['letter'] ?? null;
                            if (empty($class) || empty($letter)) {
                                echo json_encode(['success' => false, 'message' => 'Пожалуйста, заполните поля класса и буквы для учеников.']);
                           }else{
                             $sql_student_update = "UPDATE students SET class = ?, letter = ? WHERE user_id = ?";
                              executeNonQuery($conn, $sql_student_update, [$class, $letter, $editId]);
                               echo json_encode(['success' => true]);
                            }
                       }else{
                              $sql_student_delete = "DELETE FROM students WHERE user_id = ?";
                            executeNonQuery($conn, $sql_student_delete, [$editId]);
                             echo json_encode(['success' => true]);
                       }

                 } else {
                        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                        $sql_insert = "INSERT INTO users (login, password, name, role) VALUES (?, ?, ?, ?)";
                         $result = executeNonQuery($conn, $sql_insert, [$login, $hashedPassword, $name, $role]);
                       $user_id =  getLastInsertedId($conn);
                         if ($role == 'student') {
                              $class = $_POST['class'] ?? null;
                            $letter = $_POST['letter'] ?? null;
                              if (empty($class) || empty($letter)) {
                                  echo json_encode(['success' => false, 'message' => 'Пожалуйста, заполните поля класса и буквы для учеников.']);
                            } else {
                                $sql_student = "INSERT INTO students (user_id, class, letter) VALUES (?, ?, ?)";
                                executeNonQuery($conn, $sql_student, [$user_id, $class, $letter]);
                                echo json_encode(['success' => true]);
                           }
                        } else {
                           echo json_encode(['success' => true]);
                        }
                 }
              }
         }
        break;
}
?>