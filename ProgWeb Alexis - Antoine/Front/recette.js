const recipeName = sessionStorage.getItem("recipeName");
const username = sessionStorage.getItem("username_connexion");

//bouton de retour a l'acceuil
document.getElementById('home-button').addEventListener('click', function() {
    window.location.href = 'acceuil.html';
});


$.ajax({
    type: "POST",
    url: "/recetteManager",
    data: {
        thisRecipeName: recipeName
    }
}).then(function(Recipe) {
    console.log("Réponse du serveur recu : ")
    console.log(Recipe);
    
    var RecipeArray = $.parseJSON(Recipe);
    console.log(RecipeArray);
    console.log(RecipeArray[0].recipeNameFR)
    if (RecipeArray[0].recipeName /*&& User.translator && User.chef && User.administrator*/) {

        const recipeNameFR = RecipeArray[0].recipeNameFR;
        const recipeAuthor = RecipeArray[0].recipeAuthor;
        const recipeWithout = RecipeArray[0].recipeWithout;
        const recipeIngredients = RecipeArray[0].recipeIngredients;
        const recipeSteps = RecipeArray[0].recipeSteps;
        const recipeTimers = RecipeArray[0].recipeTimers;
        const recipeImageURL = RecipeArray[0].recipeImageURL;
        const recipeOriginalURL = RecipeArray[0].recipeOriginalURL;
        const recipeEnded = RecipeArray[0].recipeEnded;
        const recipeComments = RecipeArray[0].recipeComments;
        console.log(recipeComments);

        // Store as sessionStorage entries
        sessionStorage.setItem("recipeNameFR", recipeNameFR);
        sessionStorage.setItem("recipeAuthor", recipeAuthor);
        sessionStorage.setItem("recipeWithout", recipeWithout);

        // For arrays, store JSON stringified
        sessionStorage.setItem("recipeIngredients", JSON.stringify(recipeIngredients));
        sessionStorage.setItem("recipeSteps", JSON.stringify(recipeSteps));
        sessionStorage.setItem("recipeTimers", JSON.stringify(recipeTimers));

        sessionStorage.setItem("recipeImageURL", recipeImageURL);
        sessionStorage.setItem("recipeOriginalURL", recipeOriginalURL);
        sessionStorage.setItem("recipeEnded", recipeEnded);

        const commentstest = [
            "Test: Ceci est un commentaire.",
            "Test: Voici un autre commentaire."
        ];

        displayRecipeData();
        displayComments(recipeComments);
    } else {
        console.log("Erreur, la réponse n'est pas au format attendu.")
    }
}).catch(function(xhr, status, error) {
    console.log("Erreur : " + error);
});






// Fonction pour afficher les données de la recette
function displayRecipeData() {
    const recipeNameFR = sessionStorage.getItem("recipeNameFR");
    const recipeAuthor = sessionStorage.getItem("recipeAuthor");
    const recipeWithout = sessionStorage.getItem("recipeWithout");
    const recipeIngredients = JSON.parse(sessionStorage.getItem("recipeIngredients")) || [];
    const recipeSteps = JSON.parse(sessionStorage.getItem("recipeSteps")) || [];
    const recipeTimers = JSON.parse(sessionStorage.getItem("recipeTimers")) || [];
    const recipeImageURL = sessionStorage.getItem("recipeImageURL");
    const recipeOriginalURL = sessionStorage.getItem("recipeOriginalURL");
    const recipeEnded = sessionStorage.getItem("recipeEnded");

    // Afficher les données dans les éléments HTML
    document.getElementById("recipe-title").textContent = recipeName || "Titre non disponible";
    document.getElementById("recipe-titleFR").textContent = recipeNameFR || "";
    document.getElementById("recipe-author").textContent = recipeAuthor || "Auteur inconnu";
    document.getElementById("recipe-without").textContent = recipeWithout || "";
    document.getElementById("recipe-ended-status").textContent = recipeEnded || "";

    // Afficher les ingrédients
    const ingredientsList = document.getElementById("ingredients-list");
    ingredientsList.innerHTML = "";
    recipeIngredients.forEach(ingredient => {
        const li = document.createElement("li");
        // Créer une chaîne formatée pour afficher la quantité, le nom et le type
        li.textContent = `${ingredient.quantity} ${ingredient.name} (${ingredient.type})`;
        ingredientsList.appendChild(li);
    });

    // Afficher les étapes
    const stepsList = document.getElementById("steps-list");
    stepsList.innerHTML = "";
    recipeSteps.forEach(step => {
        const li = document.createElement("li");
        li.textContent = step;
        stepsList.appendChild(li);
    });

    // Afficher les timers (si c'est un tableau, sinon adapt to string)
    const timerList = document.getElementById("timer-list");
    timerList.innerHTML = "";
    if (Array.isArray(recipeTimers) && recipeTimers.length > 0) {
        recipeTimers.forEach(timer => {
            const li = document.createElement("li");
            li.textContent = timer;
            timerList.appendChild(li);
        });
    } else if (typeof recipeTimers === "string" && recipeTimers.length > 0) {
        const li = document.createElement("li");
        li.textContent = recipeTimers;
        timerList.appendChild(li);
    }

    // Afficher l'image de la recette
    const recipeImage = document.getElementById("recipe-image");
    if (recipeImageURL) {
        recipeImage.src = recipeImageURL;
        recipeImage.style.display = "block";
        recipeImage.alt = "Image de la recette";
    }



    // Récupérer les valeurs de sessionStorage
    const username = sessionStorage.getItem("username_connexion");
    const admin = sessionStorage.getItem("administrator_connexion");
    console.log(admin);
    // Vérifier si l'utilisateur est l'auteur de la recette
    if (username === recipeAuthor || admin === "on") {
        const editButton = document.getElementById("edit-recipe-btn");
        editButton.style.display = "block"; // Afficher le bouton
        editButton.addEventListener("click", () => {
            window.location.href = "modifRecipe.html"; // Rediriger vers la page de modification
        });
    }

}



function displayComments(commentsArray) {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = ''; // vider avant d'afficher

    commentsArray.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.textContent = comment;
        // Appliquer uniquement une classe CSS
        commentDiv.classList.add("comment-card");
        commentsList.appendChild(commentDiv);
    });
}




// Publier un commentaire
document.getElementById('submit-comment').addEventListener('click', function() {
    const commentInput = document.getElementById('comment-input');
    const commentText = commentInput.value.trim();
    console.log(commentText);
        $.ajax({
            type: 'POST',
            url: '/ajouterComment', // URL de votre endpoint pour modification
            data: {
                username: username,
                comment: commentText,
                recipeName: recipeName
              }
        }).then(response => {
            alert('Commentaire publié avec succès !');
            console.log('Réponse serveur:', response);          
        }).catch(err => {
            console.error('Erreur lors de la modification:', err);
            alert('Erreur lors de la modification de la recette.');
        });
    });


