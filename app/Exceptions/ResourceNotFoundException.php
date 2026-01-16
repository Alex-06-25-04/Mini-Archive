<?php

namespace App\Exceptions;

use Exception;

class ResourceNotFoundException extends Exception
{
    public function render($request)
    {
        if (!$request)
            return response()->json(['error' => 'Risorsa on trovata!'], 404);
    }
}
