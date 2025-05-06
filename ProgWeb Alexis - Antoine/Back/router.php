<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, Accept-Language, Accept-Encoding');
header('Access-Control-Max-Age: 3600');

class router
{
    private array $routes = [];

    public function register (string $method, string $path, callable $handler): void
    {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler,
        ];
    }


    public function handleRequest(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        foreach($this -> routes as $route) {
            if ($route['method'] == $method && $route['path'] == $path) {
                call_user_func($route['handler']);
                return;
            }
        }
    }

}

?>