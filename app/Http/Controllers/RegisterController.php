<?php

namespace App\Http\Controllers;

use App\Services\RegisterService;
use App\Http\Requests\RegisterRequest;

class RegisterController extends Controller
{
    protected RegisterService $registerService;

    public function __construct(RegisterService $registerService)
    {
        $this->registerService = $registerService;
    }

    public function register(RegisterRequest $request)
    {
        $user = $this->registerService->registerUser($request->validated());

        return response()->json($user, 201);
    }
}
