<?php
session_start();
require_once '../lib/db.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
switch ($action) {
    case 'checkAuth':
        if (isset($_SESSION['user_id'])) {
            $sql = "SELECT id, name, role FROM users WHERE id = ?";
            $user = fetchOne($conn, $sql, [$_SESSION['user_id']]);
            echo json_encode(['authenticated' => true, 'user' => $user]);
        } else {
            echo json_encode(['authenticated' => false]);
        }
        break;
    case 'logout':
        session_destroy();
        echo json_encode(['success' => true]);
        break;
    default:
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $login = trim($_POST['login']);
            $password = $_POST['password'];
            $sql = "SELECT id, name, role, password FROM users WHERE login = ?";
            $user = fetchOne($conn, $sql, [$login]);
             if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                echo json_encode(['success' => true, 'user' => ['id' => $user['id'], 'name' => $user['name'], 'role' => $user['role'] ]]);
             }else{
                 echo json_encode(['success' => false]);
            }
        }
        break;
}
?>