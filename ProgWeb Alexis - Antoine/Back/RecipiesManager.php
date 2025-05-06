<?php


class RecipiesManager{

    public function handleNewRecipieRequest() {
        echo json_encode(array('handleNewRecipie commence'));
    
        try {
            // Récupération des données JSON du corps de la requête
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
    
            // Vérification si le décodage a réussi
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo json_encode(['status' => 'error', 'message' => 'Erreur de décodage JSON']);
                return;
            }
    
            // Récupération des données du tableau associatif
            $name = htmlspecialchars($data['name'] ?? '');
            $nameFR = htmlspecialchars($data['nameFR'] ?? '');
            $author = htmlspecialchars($data['Author'] ?? '');
            $without = htmlspecialchars(implode(',', $data['Without'] ?? [])); // Si 'Without' est un tableau
            $ingredients = $data['ingredients'] ?? []; // Pas besoin de htmlspecialchars ici
            $steps = $data['steps'] ?? [];
            $timers = $data['timers'] ?? [];
            $imageURL = htmlspecialchars($data['imageURL'] ?? '');
            $originalURL = htmlspecialchars($data['originalURL'] ?? '');
    
            // Affichage des données récupérées (pour débogage)
            echo json_encode([
                "Name" => $name,
                "NameFR" => $nameFR,
                "Author" => $author,
                "Without" => $without,
                "Ingredients" => $ingredients,
                "Steps" => $steps,
                "Timers" => $timers,
                "imageURL" => $imageURL,
                "originalURL" => $originalURL,
            ]);
    
            // Lecture du contenu du fichier JSON
            $jsonData = json_decode(file_get_contents('recipies.json'), true);
            // Si le fichier est vide, initialisez le tableau
            if ($jsonData === null) {
                $jsonData = [];
            }
    
            // TRAITEMENT DES DONNEES
            $newRecipie = [
                'name' => $name,
                'nameFR' => $nameFR,
                'Author' => $author,
                'Without' => $without,
                'ingredients' => $ingredients,
                'steps' => $steps,
                'timers' => $timers,
                'imageURL' => $imageURL,
                'originalURL' => $originalURL,
                'ended' => "off",
            ];
    
            // Ajout de la recette au tableau
            $jsonData[] = $newRecipie;
    
            // Écriture des données dans le fichier JSON
            file_put_contents('recipies.json', json_encode($jsonData, JSON_PRETTY_PRINT));
    
            // Réponse de succès
            echo json_encode(['status' => 'success', 'message' => 'Recette ajoutée avec succès !']);
            exit;
    
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Erreur : ' . $e->getMessage()]);
        }
    }




    public function handleRecipeRequest() {

        //Récuperation du mail
        $recipeName = $_POST['thisRecipeName'];

        // Chargement du fichier JSON
        $jsonData = json_decode(file_get_contents('recipies.json'), true);
        $jsonComments = json_decode(file_get_contents('comments.json'), true);

        foreach ($jsonComments as $comments) {
            if ($comments['name'] == $recipeName) {
                $commentList = $comments['comments'];
            }    
        }

        // Recherche de la recette dans le fichier JSON
        foreach ($jsonData as $recipe) {
            if ($recipe['name'] == $recipeName) {
                $Recipe   = array (
                    'recipeName' => $recipe['name'],
                    'recipeNameFR' => $recipe['nameFR'],
                    'recipeAuthor' => $recipe['Author'],
                    'recipeWithout' => $recipe['Without'],
                    'recipeIngredients' => $recipe['ingredients'],
                    'recipeSteps' => $recipe['steps'],
                    'recipeTimers' => $recipe['timers'],
                    'recipeImageURL' => $recipe['imageURL'],
                    'recipeOriginalURL' => $recipe['originalURL'],
                    'recipeEnded' => $recipe['ended'],
                    'recipeComments' => $commentList
                    );
                
                //echo 'Compte true';
                echo json_encode(array($Recipe));
                exit;
            }
        }
        echo 'Recipe false';
        exit;


    }


    public function handleModifRecipeRequest() {

        echo json_encode(array( 'handleModifierRecipe commence'));
        try {
            // Récupération des données JSON du corps de la requête
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
    
            // Vérification si le décodage a réussi
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo json_encode(['status' => 'error', 'message' => 'Erreur de décodage JSON']);
                return;
            }
    
            // Récupération des données du tableau associatif
            $name = htmlspecialchars($data['name'] ?? '');
            $nameFR = htmlspecialchars($data['nameFR'] ?? '');
            $author = htmlspecialchars($data['Author'] ?? '');
            $without = htmlspecialchars(implode(',', $data['Without'] ?? [])); // Si 'Without' est un tableau
            $ingredients = $data['ingredients'] ?? []; // Pas besoin de htmlspecialchars ici
            $steps = $data['steps'] ?? [];
            $timers = $data['timers'] ?? [];
            $imageURL = htmlspecialchars($data['imageURL'] ?? '');
            $originalURL = htmlspecialchars($data['originalURL'] ?? '');
            $ended = htmlspecialchars($data['ended'] ?? '');
    
            // Affichage des données récupérées (pour débogage)
            echo json_encode([
                "Name" => $name,
                "NameFR" => $nameFR,
                "Author" => $author,
                "Without" => $without,
                "Ingredients" => $ingredients,
                "Steps" => $steps,
                "Timers" => $timers,
                "imageURL" => $imageURL,
                "originalURL" => $originalURL,
                "ended" => $ended,
            ]);
    
            // Lecture du contenu du fichier JSON
            $jsonData = json_decode(file_get_contents('recipies.json'), true);
            // Si le fichier est vide, initialisez le tableau
            if ($jsonData === null) {
                $jsonData = [];
            }
    
            foreach ($jsonData as $key => $recipetochange) {
                if ($recipetochange['name'] == $name) {
                  // Mise à jour des données de l'utilisateur
                  $jsonData[$key]['name'] = $name;
                  $jsonData[$key]['nameFR'] = $nameFR;
                  $jsonData[$key]['Author'] = $author;
                  $jsonData[$key]['Without'] = explode(',', $without);
                  $jsonData[$key]['ingredients'] = $ingredients;
                  $jsonData[$key]['steps'] = $steps;
                  $jsonData[$key]['timers'] = $timers;
                  $jsonData[$key]['imageURL'] = $imageURL;
                  $jsonData[$key]['originalURL'] = $originalURL;
                  $jsonData[$key]['ended'] = $ended;
                }
            }
            // Écriture des données dans le fichier JSON
            file_put_contents('recipies.json', json_encode($jsonData, JSON_PRETTY_PRINT));
    
            // Réponse de succès
            echo json_encode(['status' => 'success', 'message' => 'Recette ajoutée avec succès !']);
            exit;
    
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Erreur : ' . $e->getMessage()]);
        }

    }
    


    public function handleNewCommentRequest() {
      try {  
        // Récupération des données du formulaire
        $text = $_POST['comment'];
        $recipeName = $_POST['recipeName'];
        $username = $_POST['username'];

        $comment = $username . ": " . $text;

        $jsonData = json_decode(file_get_contents('comments.json'), true);
        $jsonRecipies = json_decode(file_get_contents('recipies.json'), true);

        if ($jsonData === null) {
            $jsonData = [];
            foreach ($jsonRecipies as $recipe) {
                $newCommentSection = [
                    'name' => $recipe['name'],
                    'comments' => []
                ];
                 // Ajout de la section commentaire au tableau
                $jsonData[] = $newCommentSection;
            }
            // Écriture des données dans le fichier JSON
            file_put_contents('comments.json', json_encode($jsonData, JSON_PRETTY_PRINT));
        } 
        

        // On ajoute une section com pour la recette si elle n'existe pas
        foreach ($jsonData as $commentaire) {
            if ($commentaire['name'] == $recipeName) {
                $trouvé = "oui";
                break;
            } else {
                $trouvé = "non";
            }
        }
        if ($trouvé == "non") {
            $dernierCommentSection =[
                'name' => $recipeName,
                'comments' => []
            ];
            $jsonData[] = $dernierCommentSection;
            }



        //on cherche la section commentaire
        foreach ($jsonData as $key => $commentSection) {
            if ($commentSection['name'] === $recipeName) {
                $jsonData[$key]['comments'][] = $comment;
                echo " commentaire trouvé";
                break;
            } 
        }

        // Écriture des données dans le fichier JSON
        file_put_contents('comments.json', json_encode($jsonData, JSON_PRETTY_PRINT));

      } catch (Exception $e) {
          echo json_encode(['status' => 'error', 'message' => 'Erreur : ' . $e->getMessage()]);
      }  
    }

}

?>