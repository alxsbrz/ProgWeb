document.addEventListener('DOMContentLoaded', () => {
    let ingredientCount = 1;
    let stepCount = 1;
    const admin = sessionStorage.getItem('administrator_connexion');
    // Récupérer les données de la recette depuis sessionStorage
    const recipeName = sessionStorage.getItem('recipeName');
    const recipeNameFR = sessionStorage.getItem("recipeNameFR") || "";
    const recipeAuthor = sessionStorage.getItem("recipeAuthor") || "";
    const recipeWithout = sessionStorage.getItem("recipeWithout") || [];
    const recipeIngredients = JSON.parse(sessionStorage.getItem("recipeIngredients")) || [];
    const recipeSteps = JSON.parse(sessionStorage.getItem("recipeSteps")) || [];
    const recipeTimers = JSON.parse(sessionStorage.getItem("recipeTimers")) || [];
    const recipeImageURL = sessionStorage.getItem("recipeImageURL") || "";
    const recipeOriginalURL = sessionStorage.getItem("recipeOriginalURL") || "";
    const recipeEnded = sessionStorage.getItem("recipeEnded");
    // Préremplir le champ auteur
    const authorInput = document.getElementById('author');
    if (authorInput) {
        authorInput.value = recipeAuthor;
        authorInput.readOnly = true; // non modifiable
    }
    // Préremplir le champ nom de la recette
    const nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.value = recipeName;
        nameInput.readOnly = true; // non modifiable
    }
    //Préremplir le champ nomFR de la recette
    const nameFRInput = document.getElementById('nameFR');
    if (nameFRInput) {
        nameFRInput.value = recipeNameFR;
    }
    //Préremplir le champ ended de la recette
    const endedInput = document.getElementById('ended-text');
    if (endedInput) {
        endedInput.value = recipeEnded;
        if(admin==="off") { // si on est pas admin alors pas modifiable
            endedInput.readOnly = true;
        }
    }
    // Préremplir les champs imageURL et originalURL
    const imageURLInput = document.getElementById('imageURL');
    const originalURLInput = document.getElementById('originalURL');
    if (imageURLInput) {
        imageURLInput.value = recipeImageURL;
    }
    if (originalURLInput) {
        originalURLInput.value = recipeOriginalURL;
    }
    // Préremplir le champ "Sans"
    const withoutSelect = document.getElementById('without');
    if(withoutSelect) {
        Array.from(withoutSelect.options).forEach(option => {
            option.selected = recipeWithout.includes(option.value);
        });
    }
    // Préremplir les ingrédients
    const ingredientsTbody = document.getElementById('ingredients-tbody');
    const firstIngredientDiv = ingredientsTbody.firstElementChild;
    recipeIngredients.forEach((ingredient, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><input type="text" name="quantity-${index+1}" value="${ingredient.quantity}" required /></td>
          <td><input type="text" name="ingredient-name-${index+1}" value="${ingredient.name}" required /></td>
          <td>
            <select name="type-${index+1}" required>
              <option value="Baking" ${ingredient.type === "Baking" ? "selected" : ""}>Pâtisserie</option>
              <option value="Dairy" ${ingredient.type === "Dairy" ? "selected" : ""}>Laiterie</option>
              <option value="Condiments" ${ingredient.type === "Condiments" ? "selected" : ""}>Condiments</option>
              <option value="Fruits" ${ingredient.type === "Fruits" ? "selected" : ""}>Fruits</option>
              <option value="Vegetables" ${ingredient.type === "Vegetables" ? "selected" : ""}>Légumes</option>
              <option value="Meat" ${ingredient.type === "Meat" ? "selected" : ""}>Viande</option>
              <option value="Seafood" ${ingredient.type === "Seafood" ? "selected" : ""}>Fruits de mer</option>
            </select>
          </td>
          <td><button type="button" class="remove-ingredient-btn">Supprimer</button></td>
        `;
        ingredientsTbody.appendChild(tr);
        ingredientCount++;
    });
    ingredientsTbody.removeChild(firstIngredientDiv);
    // Préremplir les étapes
    const stepsContainer = document.getElementById('steps-container');
    const firstStepDiv = stepsContainer.firstElementChild;
    recipeSteps.forEach((step, index) => {
        const div = document.createElement('div');
        div.classList.add('step-container');
        div.dataset.step = index + 1;
        const timer = recipeTimers[index] || 0;
        div.innerHTML = `
          <input type="text" name="step-${index+1}" value="${step}" placeholder="Description de l'étape ${index+1}" required />
          <input type="number" name="timer-${index+1}" class="timer-input" min="0" value="${timer}" title="Durée (minutes)" />
          <span class="timer">Timer: ${timer} min</span>
          <button type="button" class="remove-step-btn">Supprimer</button>
        `;
        stepsContainer.appendChild(div);
        stepCount++;
    });
    stepsContainer.removeChild(firstStepDiv);
    // Si aucune étape, créer une vide
    if (stepCount === 1) {
        const div = document.createElement('div');
        div.classList.add('step-container');
        div.dataset.step = 1;
        div.innerHTML = `
          <input type="text" name="step-1" placeholder="Description de l'étape 1" required />
          <input type="number" name="timer-1" class="timer-input" min="0" value="0" title="Durée (minutes)" />
          <span class="timer">Timer: 0 min</span>
          <button type="button" class="remove-step-btn">Supprimer</button>
        `;
        stepsContainer.appendChild(div);
        stepCount = 1;
    }





    // Gestionnaires ajout/suppression ingrédients et étapes
    const addIngredientBtn = document.getElementById('add-ingredient-btn');
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

    ingredientsTbody.addEventListener('click', e => {
        if (e.target.classList.contains('remove-ingredient-btn')) {
            const row = e.target.closest('tr');
            if (row) ingredientsTbody.removeChild(row);
        }
    });
    const addStepBtn = document.getElementById('add-step-btn');
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

    stepsContainer.addEventListener('click', e => {
        if (e.target.classList.contains('remove-step-btn')) {
            const div = e.target.closest('.step-container');
            if (div) {
                stepsContainer.removeChild(div);
                updateStepNumbers();
            }
        }
    });
    function updateStepNumbers() {
        const stepDivs = stepsContainer.querySelectorAll('.step-container');
        stepCount = stepDivs.length;
        stepDivs.forEach((div, index) => {
            const i = index + 1;
            div.dataset.step = i;
            div.querySelector('input[type="text"]').name = `step-${i}`;
            div.querySelector('input[type="text"]').placeholder = `Description de l'étape ${i}`;
            div.querySelector('input[type="number"]').name = `timer-${i}`;
            div.querySelector('.timer').textContent = `Timer: ${div.querySelector('input[type="number"]').value} min`;
        });
    }

    stepsContainer.addEventListener('input', e => {
        if (e.target.classList.contains('timer-input')) {
            const span = e.target.nextElementSibling;
            if (span && span.classList.contains('timer')) {
                const val = e.target.value === '' ? 0 : e.target.value;
                span.textContent = `Timer: ${val} min`;
            }
        }
    });
    // Soumission de la modification
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.addEventListener('click', e => {
        e.preventDefault();

        const name = nameInput ? nameInput.value : '';
        const nameFR = document.getElementById('nameFR') ? document.getElementById('nameFR').value : '';
        const author = authorInput ? authorInput.value : '';
        const without = withoutSelect ? Array.from(withoutSelect.selectedOptions).map(option => option.value) : [];
        const ended = document.getElementById('ended-text') ? document.getElementById('ended-text').value : '';
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
        // URL image et originale si présents
        const imageURL = imageURLInput ? imageURLInput.value : '';        
        const originalURL = originalURLInput ? originalURLInput.value : '';
        const Recipie = {
            name: name,
            nameFR: nameFR,
            Author: author,
            Without: without,
            ingredients: ingredients,
            steps: steps,
            timers: timers,
            imageURL: imageURL,
            originalURL: originalURL,
            ended: ended,
        };

        $.ajax({
            type: 'POST',
            url: '/modifRecipe', // URL de votre endpoint pour modification
            data: JSON.stringify(Recipie),
            contentType: "application/json"
        }).then(response => {
            alert('Recette modifiée avec succès !');
            console.log('Réponse serveur:', response);
            window.location.href = 'recette.html';            
        }).catch(err => {
            console.error('Erreur lors de la modification:', err);
            alert('Erreur lors de la modification de la recette.');
        });
    });
});