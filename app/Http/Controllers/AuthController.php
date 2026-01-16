<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use App\Http\Requests\LoginRequest;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(LoginRequest $request)
    {
        $isAuthenticated = $this->authService->loginUser($request->validated());
        if (!$isAuthenticated)
            return response()->json(['message' => 'Credenziali errate!'], 401);

        return response()->json($isAuthenticated, 200);
    }

    public function logout()
    {
        $this->authService->logout();

        return response()->json(['message' => 'Logout successful'], 200);
    }
}
