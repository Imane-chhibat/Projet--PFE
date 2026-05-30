<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Code de vérification Hand_Pro</title>
    <style>
        body {font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; padding: 20px;}
        .container {max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);}
        .code {font-size: 2em; font-weight: bold; text-align: center; margin: 20px 0; color: #2c3e50;}
    </style>
</head>
<body>
<div class="container">
    <h2>Bonjour,</h2>
    <p>Voici votre code de vérification à usage unique pour Hand_Pro :</p>
    <div class="code">{{ $otp }}</div>
    <p>Ce code est valable pendant 10 minutes. Ne le partagez avec personne.</p>
    <p>Si vous n'avez pas demandé ce code, veuillez ignorer cet email.</p>
    <br>
    <p>Cordialement,<br>Équipe Hand_Pro</p>
</div>
</body>
</html>
