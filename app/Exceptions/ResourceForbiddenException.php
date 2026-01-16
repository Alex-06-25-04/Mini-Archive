<?php

namespace App\Exceptions;

use Exception;

class ResourceForbiddenException extends Exception
{
    public function render()
    {
        return response()->json(['error' => 'Accesso negato'], 403);
    }
}
