<?php

namespace App\Services;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    public function loginUser(array $credentials)
    {
        if (!Auth::attempt($credentials))
            return null;

        $user = Auth::user();

        $token = $user->createToken('api-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    public function logout()
    {
        auth()->user()->currentAccessToken()->delete();
    }
}