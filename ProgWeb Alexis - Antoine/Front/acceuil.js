// Récupération de l'email depuis la session
const Email = sessionStorage.getItem("email_connexion");
console.log("Email récupéré de sessionStorage :", Email);

// Affichage dans l'en-tête
document.getElementById("email_utilisateur").textContent = Email;

// Requête pour récupérer les infos utilisateur
$.ajax({
    type: "POST",
    url: "/compteManager",
    data: {
        email: Email
    }
}).then(function(response) {
    console.log("Réponse du serveur reçue :", response);

    try {
        const UserArray = $.parseJSON(response);
        const user = UserArray[0];

        if (user && user.username) {
            sessionStorage.setItem("username_connexion", user.username);
            sessionStorage.setItem("translator_connexion", user.translator);
            sessionStorage.setItem("chef_connexion", user.chef);
            sessionStorage.setItem("administrator_connexion", user.administrator);
        } else {
            console.warn("Format de réponse inattendu :", UserArray);
        }
    } catch (e) {
        console.error("Erreur lors du parsing JSON :", e);
    }
}).catch(function(xhr, status, error) {
    console.error("Erreur AJAX :", error);
});


// Fonction pour charger les recettes depuis le JSON
function loadRecipes() {
    return $.getJSON('../recipies.json');
}

// Fonction pour afficher les résultats dans l’interface
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Reset des résultats

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p style="color:#d35400; font-weight:bold;">Aucune recette trouvée.</p>';
        return;
    }

    results.forEach(recipe => {
        const btn = document.createElement('button');
        btn.classList.add('button'); // Reuse de ta classe .button pour le style

        btn.innerHTML = `
            <strong>${recipe.nameFR}</strong><br/>
            <small style="color:#888;">(${recipe.name})</small>
        `;
        btn.style.margin = '10px';
        btn.style.padding = '15px';
        btn.style.display = 'block';
        btn.style.width = '100%';
        btn.style.textAlign = 'left';

        btn.addEventListener('click', () => {
            sessionStorage.setItem('recipeName', recipe.name);
            window.location.href = 'recette.html';
        });

        resultsContainer.appendChild(btn);
    });
}

// Gestion du clic sur le bouton de recherche
document.getElementById('search-button').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();

    loadRecipes().then(recipes => {
        const filtered = recipes.filter(recipe => {
            const name = (recipe.name || "").toLowerCase();
            const nameFR = (recipe.nameFR || "").toLowerCase();
            const author = (recipe.author || "").toLowerCase();
            const without = Array.isArray(recipe.without)
                ? recipe.without.join(' ').toLowerCase()
                : (recipe.without || "").toLowerCase();
            const steps = Array.isArray(recipe.steps)
                ? recipe.steps.join(' ').toLowerCase()
                : "";

            let ingredientsText = '';
            if (Array.isArray(recipe.ingredients)) {
                ingredientsText = recipe.ingredients.map(ing => {
                    return `${ing.quantity || ''} ${ing.name || ''} ${ing.type || ''}`.toLowerCase();
                }).join(' ');
            }

            const fullText = `${name} ${nameFR} ${author} ${without} ${steps} ${ingredientsText}`;
            return fullText.includes(searchTerm);
        });

        displaySearchResults(filtered);
    }).catch(error => {
        console.error("Erreur lors du chargement des recettes :", error);
        document.getElementById('search-results').innerHTML = "<p>Une erreur est survenue lors de la recherche.</p>";
    });
});
