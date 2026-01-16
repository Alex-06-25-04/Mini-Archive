<?php

namespace App\Exceptions;

use Exception;

class ResourceConflictException extends Exception
{
    public function render()
    {
        return response()->json(['error' => 'Risorsa già esistente'], 409);
    }
}
