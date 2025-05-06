<?php
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, Accept-Language, Accept-Encoding');

require_once 'router.php';
require_once 'RecipiesManager.php';
require_once 'UserManager.php';

//Initialize the router and recipes manager
$router = new router();
$UserManager = new UserManager(__DIR__);
$RecipiesManager = new RecipiesManager(__DIR__);


//Handle the registration
$router->register('POST', '/registration', [$UserManager, 'handleRegisterRequest']);
//Handle the login
$router->register('POST', '/login', [$UserManager, 'handleLoginRequest']);
//Handle the Compte
$router->register('POST', '/compteManager', [$UserManager, 'handleCompteRequest']);
//Handle the modifier compte
$router->register('POST', '/modifierCompte', [$UserManager, 'handleModifierCompteRequest']);



//Handle the ajouter recette
$router->register('POST', '/ajouterRecette', [$RecipiesManager, 'handleNewRecipieRequest']);
//Handle the modifier recette
$router->register('POST', '/recetteManager', [$RecipiesManager, 'handleRecipeRequest']);
//Handle the modifier recette
$router->register('POST', '/modifRecipe', [$RecipiesManager, 'handleModifRecipeRequest']);


//Handle ajouter comment
$router->register('POST', '/ajouterComment', [$RecipiesManager, 'handleNewCommentRequest']);




//Handle the incoming request
try {
    $router->handleRequest();
} catch (Exception $e) {
    echo 'Erreur : ' . $e->getMessage();
    echo 'Fichier : ' . $e->getFile();
    echo 'Ligne : ' . $e->getLine();
}

?>