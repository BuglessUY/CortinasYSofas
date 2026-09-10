<?php
// Aseguramos que la respuesta sea interpretada como JSON por JavaScript
header('Content-Type: application/json');

// 1. VERIFICAR QUE SEA UNA PETICIÓN POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Método no permitido."]);
    exit;
}

// 2. TRAMPA HONEYPOT (Protección Anti-Spam bots)
// Si el campo invisible 'website_hp' tiene algo escrito, es un bot.
if (!empty($_POST['website_hp'])) {
    // Le decimos que tuvo éxito para que el bot no intente otras vulnerabilidades
    echo json_encode(["status" => "success", "message" => "Mensaje enviado correctamente."]);
    exit;
}

// 3. RECIBIR Y SANEAR DATOS (Protección XSS)
// strip_tags remueve etiquetas HTML maliciosas, htmlspecialchars convierte caracteres especiales.
$nombre   = htmlspecialchars(strip_tags(trim($_POST["nombre"])));
$telefono = htmlspecialchars(strip_tags(trim($_POST["telefono"])));
$email    = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
$asunto   = htmlspecialchars(strip_tags(trim($_POST["asunto"])));
$mensaje  = htmlspecialchars(strip_tags(trim($_POST["mensaje"])));

// 4. VALIDACIONES
if (empty($nombre) || empty($telefono) || empty($email) || empty($mensaje)) {
    echo json_encode(["status" => "error", "message" => "Por favor, completa todos los campos obligatorios."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "El formato del correo es inválido."]);
    exit;
}

// 5. PROTECCIÓN CONTRA INYECCIÓN DE CABECERAS
// Evita que un hacker meta saltos de línea en el correo o nombre para cambiar el destinatario
if (preg_match("/[\r\n]/", $nombre) || preg_match("/[\r\n]/", $email)) {
    echo json_encode(["status" => "error", "message" => "Intento de inyección detectado."]);
    exit;
}

// 6. CONFIGURACIÓN DEL CORREO (¡AQUÍ CONFIGURAS TUS DATOS!)
$destinatario = "ventas@cortinasysofasuy.com"; // <--- PON TU CORREO CORPORATIVO AQUÍ
$asunto_email = "Nueva consulta web: " . $asunto;

// Cuerpo del correo que recibirás
$cuerpo_mensaje = "Has recibido una nueva consulta desde el sitio web.\n\n";
$cuerpo_mensaje .= "Detalles del cliente:\n";
$cuerpo_mensaje .= "------------------------\n";
$cuerpo_mensaje .= "Nombre: $nombre\n";
$cuerpo_mensaje .= "Teléfono: $telefono\n";
$cuerpo_mensaje .= "Email: $email\n";
$cuerpo_mensaje .= "Asunto: $asunto\n\n";
$cuerpo_mensaje .= "Mensaje:\n$mensaje\n";

// Cabeceras del correo
// IMPORTANTE: El 'From' debe ser un correo que exista en tu propio servidor/dominio (ej: noreply@tudominio.com) para evitar caer en Spam.
$headers = "From:javiersilva@cortinasysofasuy.com.\r\n"; // <--- CAMBIA 'tudominio.com' por tu dominio real
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// 7. ENVIAR EL CORREO
if (mail($destinatario, $asunto_email, $cuerpo_mensaje, $headers)) {
    echo json_encode(["status" => "success", "message" => "Mensaje enviado correctamente."]);
} else {
    // Si falla, suele ser porque el servidor no tiene configurado el servicio de mail
    echo json_encode(["status" => "error", "message" => "Error del servidor al intentar enviar el correo."]);
}
?>
