<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F5EDE0; font-family: 'Segoe UI', Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F5EDE0; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    
                    {{-- Header --}}
                    <tr>
                        <td style="background: linear-gradient(135deg, #603A2A 0%, #2A1B15 100%); padding: 32px 40px; text-align: center;">
                            <h1 style="color: #CDB58E; font-size: 28px; margin: 0; font-weight: 700; letter-spacing: 2px;">
                                🔧 Hand_Pro
                            </h1>
                            <p style="color: #E8DCC8; font-size: 13px; margin: 8px 0 0; letter-spacing: 1px; opacity: 0.8;">
                                Plateforme des Artisans Professionnels
                            </p>
                        </td>
                    </tr>

                    {{-- Body --}}
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #2A1B15; font-size: 22px; margin: 0 0 8px; font-weight: 700;">
                                Réinitialisation du mot de passe
                            </h2>
                            <div style="width: 50px; height: 3px; background-color: #CDB58E; border-radius: 2px; margin-bottom: 24px;"></div>
                            
                            <p style="color: #5A4A3A; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
                                Bonjour <strong>{{ $userName }}</strong>,
                            </p>
                            <p style="color: #5A4A3A; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                                Vous avez demandé la réinitialisation de votre mot de passe sur Hand_Pro.
                                Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
                            </p>

                            {{-- CTA Button --}}
                            <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 24px;">
                                <tr>
                                    <td style="border-radius: 12px; background: linear-gradient(135deg, #603A2A 0%, #4A2A1A 100%);">
                                        <a href="{{ $resetLink }}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #F5EDE0; text-decoration: none; font-size: 16px; font-weight: 700; letter-spacing: 0.5px;">
                                            🔑 Réinitialiser mon mot de passe
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            {{-- Alternative link --}}
                            <p style="color: #8E887F; font-size: 13px; line-height: 1.5; margin: 0 0 8px;">
                                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
                            </p>
                            <p style="color: #603A2A; font-size: 12px; word-break: break-all; background-color: #F5EDE0; padding: 12px 16px; border-radius: 8px; border: 1px solid #CDB58E40; margin: 0 0 24px;">
                                {{ $resetLink }}
                            </p>

                            {{-- Warning --}}
                            <div style="background-color: #FFF8F0; border-left: 4px solid #CDB58E; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 8px;">
                                <p style="color: #8E887F; font-size: 13px; line-height: 1.5; margin: 0;">
                                    ⏱ Ce lien expire dans <strong style="color: #603A2A;">60 minutes</strong>.<br>
                                    Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.
                                </p>
                            </div>
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td style="background-color: #F5EDE0; padding: 24px 40px; text-align: center; border-top: 1px solid #CDB58E30;">
                            <p style="color: #8E887F; font-size: 12px; margin: 0 0 4px;">
                                © {{ date('Y') }} Hand_Pro — Tous droits réservés
                            </p>
                            <p style="color: #A89A8A; font-size: 11px; margin: 0;">
                                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
