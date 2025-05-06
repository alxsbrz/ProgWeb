document.getElementById("login-form").addEventListener("submit", async (event) => {
	event.preventDefault(); // Prévention de la soumission du formulaire par défaut

    // Récupération des données du formulaire
	const form = event.target;
	const formData = new FormData(form);
	const email = formData.get('email');
	const password = formData.get('password');

    console.log(email);
	console.log(password);

    // aucun champs vide
	if (email === '' || password === '') {
        alert('Veuillez remplir tous les champs');
        return;
    }

    try {
		const response = await $.ajax({
		type: "POST",
		url: "/login",
		data: {
		  email: email,
		  password: password
		},
		contentType: "application/x-www-form-urlencoded",
		}).then((response) => {
		console.log('Login envoyé avec succes');
		console.log(response); // Affiche la réponse du serveur

        if (response.includes("Connexion false")) {
            alert("Tentative de login ratée.");
        } else if (response.includes("Connexion true")) {
            // on stock l'email pour la page d'acceuil  
            sessionStorage.setItem("email_connexion",email);
            sessionStorage.setItem("password_connexion",password);
            window.location.href = "acceuil.html";
        }  
	    });
	
	} catch (error) {
		console.error('Erreur : ' + error.responseText);
	}


});