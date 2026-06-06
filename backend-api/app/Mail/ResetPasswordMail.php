<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $resetLink;
    public string $userName;

    /**
     * Create a new message instance.
     */
    public function __construct(string $resetLink, string $userName = 'Utilisateur')
    {
        $this->resetLink = $resetLink;
        $this->userName = $userName;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Réinitialisation de votre mot de passe - Hand_Pro')
                    ->view('emails.reset-password')
                    ->with([
                        'resetLink' => $this->resetLink,
                        'userName'  => $this->userName,
                    ]);
    }
}
