document.addEventListener('DOMContentLoaded', () => {
    let ingredientCount = 1;
    let stepCount = 1;

  
    const authorInput = document.getElementById('author');
    const username = sessionStorage.getItem("username_connexion") || "Unknown";
    if(authorInput) {
        authorInput.value = username;
        authorInput.readOnly = true;
}

    const ingredientsTbody = document.getElementById('ingredients-tbody');
    const addIngredientBtn = document.getElementById('add-ingredient-btn');

    const stepsContainer = document.getElementById('steps-container');
    const addStepBtn = document.getElementById('add-step-btn');

    // Ajouter un ingrédient
    addIngredientBtn.addEventListener('click', () => {
        ingredientCount++;
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td><input type="text" name="quantity-${ingredientCount}" required /></td>
            <td><input type="text" name="ingredient-name-${ingredientCount}" required /></td>
            <td>
                <select name="type-${ingredientCount}" required>
                    <option value="Baking">Pâtisserie</option>
                    <option value="Dairy">Laiterie</option>
                    <option value="Condiments">Condiments</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Légumes</option>
                    <option value="Meat">Viande</option>
                    <option value="Seafood">Fruits de mer</option>
                </select>
            </td>
            <td><button type="button" class="remove-ingredient-btn">Supprimer</button></td>
        `;

        ingredientsTbody.appendChild(tr);
    });

    // Supprimer un ingrédient (délégation d'événement)
    ingredientsTbody.addEventListener('click', e => {
        if (e.target.classList.contains('remove-ingredient-btn')) {
            const row = e.target.closest('tr');
            if (row) {
                ingredientsTbody.removeChild(row);
            }
        }
    });

    // Ajouter une étape
    addStepBtn.addEventListener('click', () => {
        stepCount++;
        const div = document.createElement('div');
        div.classList.add('step-container');
        div.dataset.step = stepCount;

        div.innerHTML = `
            <input type="text" name="step-${stepCount}" placeholder="Description de l'étape ${stepCount}" required />
            <input type="number" name="timer-${stepCount}" class="timer-input" min="0" value="0" title="Durée (minutes)" />
            <span class="timer">Timer: 0 min</span>
            <button type="button" class="remove-step-btn">Supprimer</button>
        `;

        stepsContainer.appendChild(div);
    });

    // Supprimer une étape (délégation d'événement)
    stepsContainer.addEventListener('click', e => {
        if (e.target.classList.contains('remove-step-btn')) {
            const stepDiv = e.target.closest('.step-container');
            if (stepDiv) {
                stepsContainer.removeChild(stepDiv);
                updateStepNumbers();
            }
        }
    });

    // Met à jour les numéros d'étape et les noms des inputs après suppression
    function updateStepNumbers() {
        const stepDivs = stepsContainer.querySelectorAll('.step-container');
        stepCount = stepDivs.length;
        stepDivs.forEach((div, index) => {
            const stepNum = index + 1;
            div.dataset.step = stepNum;
            const textInput = div.querySelector('input[type="text"]');
            const timerInput = div.querySelector('input[type="number"]');
            const timerSpan = div.querySelector('.timer');

            textInput.name = `step-${stepNum}`;
            textInput.placeholder = `Description de l'étape ${stepNum}`;

            timerInput.name = `timer-${stepNum}`;
            timerSpan.textContent = `Timer: ${timerInput.value} min`;
        });
    }

    // Mise à jour du texte des timers en temps réel
    stepsContainer.addEventListener('input', e => {
        if (e.target.classList.contains('timer-input')) {
            const timerSpan = e.target.nextElementSibling;
            if (timerSpan && timerSpan.classList.contains('timer')) {
                let val = e.target.value;
                timerSpan.textContent = `Timer: ${val === '' ? 0 : val} min`;
            }
        }
    });

    // Soumettre la recette
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.addEventListener('click', (event) => {
        event.preventDefault();

        // Récupérer les valeurs du formulaire sans trim pour permettre valeurs vides
        const nameInput = document.getElementById('name');
        const name = nameInput ? nameInput.value : '';

        const nameFRInput = document.getElementById('nameFR');
        const nameFR = nameFRInput ? nameFRInput.value : '';

        const authorInput = document.getElementById('author');
        const author = authorInput ? authorInput.value : '';

        const withoutSelect = document.getElementById('without');
        const without = withoutSelect ? Array.from(withoutSelect.selectedOptions).map(option => option.value) : [];

        // Ingrédients
        const ingredients = [];
        const ingredientRows = ingredientsTbody.querySelectorAll('tr');
        ingredientRows.forEach(row => {
            const quantityInput = row.querySelector('input[name^="quantity-"]');
            const ingredientNameInput = row.querySelector('input[name^="ingredient-name-"]');
            const typeSelect = row.querySelector('select[name^="type-"]');

            const quantity = quantityInput ? quantityInput.value : '';
            const ingredientName = ingredientNameInput ? ingredientNameInput.value : '';
            const type = typeSelect ? typeSelect.value : '';

            if (quantity || ingredientName || type) { 
                ingredients.push({
                    quantity: quantity,
                    name: ingredientName,
                    type: type
                });
            }
        });

        // Étapes et timers
        const steps = [];
        const timers = [];
        const stepDivs = stepsContainer.querySelectorAll('.step-container');
        stepDivs.forEach(div => {
            const stepDescInput = div.querySelector('input[type="text"]');
            const timerInput = div.querySelector('input[type="number"]');

            const stepDesc = stepDescInput ? stepDescInput.value : '';
            let timerVal = timerInput ? parseInt(timerInput.value, 10) : 0;
            if (isNaN(timerVal)) timerVal = 0;

            if (stepDesc) {
                steps.push(stepDesc);
                timers.push(timerVal);
            }
        });

        const imageURLInput = document.getElementById('imageURL');
        const imageURL = imageURLInput ? imageURLInput.value : '';

        const originalURLInput = document.getElementById('originalURL');
        const originalURL = originalURLInput ? originalURLInput.value : '';

        // Construire l'objet recette pour affichage
        const Recipie = {
            name: name,
            nameFR: nameFR,
            Author: author,
            Without: without,
            ingredients: ingredients,
            steps: steps,
            timers: timers,
            imageURL: imageURL,
            originalURL: originalURL
        };

        console.log('Recipie envoyée:', Recipie);

        // appel AJAX avec JSON
        $.ajax({
            type: "POST",
            url: "/ajouterRecette",
            data: JSON.stringify(Recipie),
            contentType: "application/json"
        }).then(response => {
            console.log("Réponse du serveur reçue : ", response);
            alert('Recette ajoutée avec succès !');

            // Réinitialiser le formulaire si besoin
            document.getElementById('new-recipie-form').reset();

            // Réinitialiser les comptages
            ingredientCount = 1;
            stepCount = 1;

            // Supprimer ingrédients et étapes ajoutés, garder la première ligne / étape
            while (ingredientsTbody.children.length > 1) {
                ingredientsTbody.removeChild(ingredientsTbody.lastChild);
            }
            while (stepsContainer.children.length > 1) {
                stepsContainer.removeChild(stepsContainer.lastChild);
            }
            updateStepNumbers();
        }).catch((xhr, status, error) => {
            console.error("Erreur : " + error);
            alert('Erreur lors de l\'ajout de la recette : ' + error);
        });
    });
})
