

document.getElementById("register-form").addEventListener("submit", async (event) => {
	event.preventDefault(); // Prévention de la soumission du formulaire par défaut
	
	// Récupération des données du formulaire
	const form = event.target;
	const formData = new FormData(form);
	const email = formData.get('email');
	const username = formData.get('username');
	const password = formData.get('password');
	const confirm = formData.get('confirm');
	const translator = formData.get('translator');
	const chef = formData.get('chef');

	console.log(email);
	console.log(username);
	console.log(password);
	console.log(confirm);
	console.log(translator);
	console.log(chef);
	
	// Validation des données

	// aucun champs vide
	if (email === '' || username === '' || password === '' || confirm === '') {
	  alert('Veuillez remplir tous les champs');
	  return;
	}

	// password et confirm sont egaux
	if (password != confirm) {
		alert('Mots de passes différents');
		return;
	}

	//mdp trop court
	if (password.length < 5) {
		alert('Mot de passe trop court');
		return;
	}


	try {
		const response = await $.ajax({
		type: "POST",
		url: "/registration",
		data: {
		  email: email,
		  username: username,
		  password: password,
		  confirm: confirm,
		  translator: translator,
		  chef: chef
		  
		},
		contentType: "application/x-www-form-urlencoded"
		}).then((response) => {
		console.log('Données ajoutées avec succès');
		console.log(response); // Affiche la réponse du serveur

		if (response.includes("Email false")) {
            alert("Email déjà utilisé");
		} else if (response.includes("Username false")) {
			alert("Username déjà utilisé")
        } else if (response.includes("Inscription true")) {
            window.location.href = "index.html";        }  
	    });
	
	} catch (error) {
		console.error('Erreur : ' + error.responseText);
	}
});