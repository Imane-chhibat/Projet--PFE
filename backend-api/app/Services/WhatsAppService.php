<?php

namespace App\Services;

use Twilio\Rest\Client;

class WhatsAppService
{
    protected $twilio;
    protected $isConfigured;

    public function __construct()
    {
        $sid = config('services.twilio.account_sid');
        $token = config('services.twilio.auth_token');
        $this->isConfigured = !empty($sid) && !empty($token);
        
        if ($this->isConfigured) {
            $this->twilio = new Client($sid, $token);
        }
    }

    /**
     * Send WhatsApp message to a client when artisan accepts a request
     */
    public function sendAcceptanceMessage($clientPhone, $artisanName, $requestedDate): bool
    {
        // Don't attempt to send if Twilio is not configured
        if (!$this->isConfigured) {
            \Log::warning('WhatsApp service is not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM in .env');
            return false;
        }

        try {
            $from = config('services.twilio.whatsapp_from');
            
            if (empty($from)) {
                \Log::warning('TWILIO_WHATSAPP_FROM is not configured');
                return false;
            }

            $to = $this->formatPhoneNumber($clientPhone);

            $message = "Bonjour! L'artisan {$artisanName} a accepté votre demande de rendez-vous pour le {$requestedDate}. Quel type de service souhaitez-vous recevoir?";

            $this->twilio->messages->create(
                $to,
                [
                    'from' => "whatsapp:{$from}",
                    'body' => $message
                ]
            );

            return true;
        } catch (\Exception $e) {
            \Log::error('WhatsApp message failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Format phone number for WhatsApp
     */
    protected function formatPhoneNumber($phone): string
    {
        // Remove any non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        // Add country code if not present (assuming Morocco +212)
        if (strlen($phone) === 10 && str_starts_with($phone, '0')) {
            $phone = '212' . substr($phone, 1);
        }
        
        return "whatsapp:+{$phone}";
    }
}
