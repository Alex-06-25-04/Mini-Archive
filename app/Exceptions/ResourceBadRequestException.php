<?php

namespace App\Exceptions;

use Exception;

class ResourceBadRequestException extends Exception
{
    protected $customMessage;

    public function __construct($message = 'Richiesta non valida!')
    {
        parent::__construct($message);
        $this->customMessage = $message;
    }

    public function render()
    {
        return response()->json(['error' => 'Bad Request', 'message' => $this->customMessage], 400);
    }
}
