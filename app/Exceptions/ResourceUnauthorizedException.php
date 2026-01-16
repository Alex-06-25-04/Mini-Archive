<?php

namespace App\Exceptions;

use Exception;

class ResourceUnauthorizedException extends Exception
{
    public function render()
    {
        return response()->json(['error' => 'Non autorizzato'], 401);
    }
}
