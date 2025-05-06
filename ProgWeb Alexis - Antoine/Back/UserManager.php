<?php


class UserManager{

    public function handleRegisterRequest() {
        echo json_encode(array( 'handleregister commence'));

        try {
        // Récupération des données du formulaire
        $email = htmlspecialchars($_POST['email']);
        $username = htmlspecialchars($_POST['username']);
        $password = htmlspecialchars($_POST['password']);
        $confirm = htmlspecialchars($_POST['confirm']);
        $translator = (isset($_POST['translator']) && $_POST['translator'] == 'on') ? 'on' : 'off';
        $chef = (isset($_POST['chef']) && $_POST['chef'] == 'on') ? 'on' : 'off';

        // Affichage des données récuperées
        echo json_encode(array( "Email : $email<br>"));
        echo json_encode(array( "Username : $username<br>"));
        echo json_encode(array( "Password : $password<br>"));
        echo json_encode(array( "Confirm : $confirm<br>"));
        echo json_encode(array( "Translator : $translator<br>"));
        echo json_encode(array( "Chef : $chef<br>"));




        // Lecture du contenu du fichier JSON
        $jsonData = json_decode(file_get_contents('donnees.json'), true);
        // Si le fichier est vide, initialisez le tableau
        if ($jsonData === null) {
            $jsonData = [];
        }




        // TRAITEMENT DES DONNEES

        //email déjà utilisé
        foreach ($jsonData as $utilisateur) {
            if ($utilisateur['email'] == $email) {
                echo 'Email false';
                exit;
            }
        }


        // username déjà prit
        foreach ($jsonData as $utilisateur) {
            if ($utilisateur['username'] == $username) {
                echo 'Username false';
                exit;
            }
        }


        // Creation de l'utilisateur pour le fichier JSON
        $newUser   = [
            'username' => $username,
            'email' => $email,
            'password' => $password,
            'role' => [
                'translator' => $translator,
                'chef' => $chef,
                'administrator' => 'off'
            ]
        ];
        // Ajout de l'utilisateur au tableau des anciens utilisateurs
        $jsonData[] = $newUser ;
       

        // Écriture des données dans le fichier JSON
        file_put_contents('donnees.json', json_encode($jsonData, JSON_PRETTY_PRINT));

        // Affichage des données
        print_r($jsonData);

        // Inscription réussie
        echo 'Inscription true';

        // Redirection vers la page d'accueil
        //header('Location: /front/index.html');
        exit;

        } catch(Exception $e){
            var_dump('Erreur : ' . $e->getMessage());
        }
    }






    public function handleLoginRequest() {


        try {
        // Récupération des données du formulaire
        $email = htmlspecialchars($_POST['email']);
        $password = htmlspecialchars($_POST['password']);

        // Affichage des données récuperées
        echo json_encode(array( "Email : $email<br>"));
        echo json_encode(array( "Password : $password<br>"));
    
        // Chargement du fichier JSON
        $jsonData = json_decode(file_get_contents('donnees.json'), true);
        
        

        // Recherche de l'utilisateur dans le fichier JSON
        foreach ($jsonData as $utilisateur) {
            if ($utilisateur['email'] == $email && $utilisateur['password'] == $password) {
                // Connexion réussie
                echo 'Connexion true'; // Pour rediriger vers page d'acceuil
                exit;
            }
        }
    
        echo 'Connexion false';
        exit;
        }catch(Exception $e){
            var_dump('Erreur : ' . $e->getMessage());
        }
    }






    public function handleCompteRequest() {
        //echo 'compte request commence ';
        //Récuperation du mail
        $email = $_POST['email'];
        // Affichage des données récuperées
        //echo json_encode(array( 'email' => $email));

        // Chargement du fichier JSON
        $jsonData = json_decode(file_get_contents('donnees.json'), true);

        // Recherche de l'utilisateur dans le fichier JSON
        foreach ($jsonData as $utilisateur) {
            if ($utilisateur['email'] == $email) {
                $User   = array (
                    'username' => $utilisateur['username'],
                    'translator' => $utilisateur['role']['translator'],
                    'chef' => $utilisateur['role']['chef'],
                    'administrator' => $utilisateur['role']['administrator']
                    );
                
                //echo 'Compte true';
                echo json_encode(array($User));
                exit;
            }
        }
        echo 'Compte false';
        exit;


    }


    public function handleModifierCompteRequest() {
        echo json_encode(array( 'handleModifierCompte commence'));
        // Récupération des données modifiées
        $email = $_POST['email'];
        $password = $_POST['password'];
        $username = $_POST['username'];
        $translator = $_POST['translator'];
        $chef = $_POST['chef'];
        
        // Chargement du fichier JSON
        $jsonData = json_decode(file_get_contents('donnees.json'), true);
        
        // Recherche de l'utilisateur dans le fichier JSON
        foreach ($jsonData as $key => $utilisateur) {
          if ($utilisateur['email'] == $email) {
            // Mise à jour des données de l'utilisateur
            $jsonData[$key]['email'] = $email;
            $jsonData[$key]['password'] = $password;
            $jsonData[$key]['username'] = $username;
            $jsonData[$key]['role']['translator'] = $translator;
            $jsonData[$key]['role']['chef'] = $chef;
            $jsonData[$key]['role']['administrator'] = $jsonData[$key]['role']['administrator'];
            
            // Enregistrement des données modifiées dans le fichier JSON
            file_put_contents('donnees.json', json_encode($jsonData, JSON_PRETTY_PRINT));
            
            // Affichage des données modifiées
            echo json_encode(array('message' => 'Données modifiées avec succès'));
            exit;
          }
        }
        
        // Affichage d'une erreur si l'utilisateur n'est pas trouvé
        echo json_encode(array('message' => 'Erreur lors de la modification des données'));
        exit;
      }


}

?>