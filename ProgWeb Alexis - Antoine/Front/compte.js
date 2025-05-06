//bouton de retour a l'acceuil
document.getElementById('home-button').addEventListener('click', function() {
  window.location.href = 'acceuil.html';
});
//bouton de retour a l'acceuil
document.getElementById('login-button').addEventListener('click', function() {
  window.location.href = 'index.html';
});

//on recupere les donnees de la session
const Email = sessionStorage.getItem("email_connexion");
const Password = sessionStorage.getItem("password_connexion");
const Username = sessionStorage.getItem("username_connexion");
const Translator = sessionStorage.getItem("translator_connexion");
const Chef = sessionStorage.getItem("chef_connexion");
const Administrator = sessionStorage.getItem("administrator_connexion");

document.getElementById("email").textContent = Email ;
document.getElementById("password").textContent = Password ;
document.getElementById("username").textContent = Username ;
document.getElementById("translator").textContent = Translator ;
document.getElementById("chef").textContent = Chef ;
document.getElementById("administrator").textContent = Administrator ;






document.getElementById("modifier-btn").addEventListener("click", function() {
    document.getElementById("modifier-form").style.display = "block";
    document.getElementById("modifier-btn").style.display = "none";
    
    document.getElementById("password-modifier").value = Password;
    document.getElementById("username-modifier").value = Username;
    document.getElementById("translator-modifier").value = Translator;
    document.getElementById("chef-modifier").value = Chef;
  });
  
  // Enregistrement des modifications
document.getElementById("enregistrer-btn").addEventListener("click", function(event) {
  event.preventDefault(); // Empêche l'envoi du formulaire
  
  const nouvelPassword = document.getElementById("password-modifier").value;
  const nouvelUsername = document.getElementById("username-modifier").value;
  const nouvelTranslator = document.getElementById("translator-modifier").value;
  const nouvelChef = document.getElementById("chef-modifier").value;

  
  // Envoi des données modifiées au serveur
  $.ajax({
    type: 'POST',
    url: '/modifierCompte',
    data: {
      email: Email,
      password: nouvelPassword,
      username: nouvelUsername,
      translator: nouvelTranslator,
      chef: nouvelChef
    }
    }).then(function(User) {
      console.log("Réponse du serveur recu : ")
      // Mise à jour des données de l'utilisateur
      sessionStorage.setItem("password_connexion", nouvelPassword);
      sessionStorage.setItem("username_connexion", nouvelUsername);
      sessionStorage.setItem("translator_connexion", nouvelTranslator);
      sessionStorage.setItem("chef_connexion", nouvelChef);

      // Affichage des données modifiées
      document.getElementById("password").textContent = nouvelPassword;
      document.getElementById("username").textContent = nouvelUsername;
      document.getElementById("translator").textContent = nouvelTranslator;
      document.getElementById("chef").textContent = nouvelChef;
  }).catch(function(xhr, status, error) {
      console.log("Erreur : " + error);
  });
});

