<?php

namespace App\Services;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RegisterService
{
    public function registerUser(array $dataUser)
    {
        // return User::create([
        //     ...$dataUser,
        //     "password" => bcrypt($dataUser["password"])
        // ]);

        return User::create([
            'name' => $dataUser['name'],
            'email' => $dataUser['email'],
            'password' => Hash::make($dataUser['password'])
        ]);
    }
}