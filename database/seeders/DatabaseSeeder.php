<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Resource;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crea utente admin
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);

        // Crea utente normale
        User::create([
            'name' => 'Normal User',
            'email' => 'user@test.com',
            'password' => Hash::make('password'),
            'is_admin' => false,
        ]);

        // Le categorie già esistono dalla migration, prendiamole
        $categories = Category::all();

        // Crea risorse di esempio
        $resources = [
            [
                'name' => 'Documentazione Laravel',
                'category_id' => $categories->where('name', 'documenti')->first()->id,
                'link' => 'https://laravel.com/docs',
                'description' => 'Documentazione ufficiale di Laravel',
                'image' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
            ],
            [
                'name' => 'Visual Studio Code',
                'category_id' => $categories->where('name', 'software')->first()->id,
                'link' => 'https://code.visualstudio.com',
                'description' => 'Editor di codice gratuito e potente',
                'image' => 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
            ],
            [
                'name' => 'MacBook Pro M3',
                'category_id' => $categories->where('name', 'hardware')->first()->id,
                'link' => 'https://www.apple.com/macbook-pro',
                'description' => 'Laptop professionale per sviluppatori',
                'image' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
            ],
            [
                'name' => 'Google Analytics',
                'category_id' => $categories->where('name', 'marketing')->first()->id,
                'link' => 'https://analytics.google.com',
                'description' => 'Analisi del traffico web',
                'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
            ],
            [
                'name' => 'Corso PHP Completo',
                'category_id' => $categories->where('name', 'formazione')->first()->id,
                'link' => 'https://www.udemy.com/course/php-completo',
                'description' => 'Corso completo di PHP da zero',
                'image' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
            ],
            [
                'name' => 'LinkedIn Recruiting',
                'category_id' => $categories->where('name', 'hr')->first()->id,
                'link' => 'https://www.linkedin.com/talent',
                'description' => 'Piattaforma per recruiting professionale',
                'image' => 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
            ],
            [
                'name' => 'Postman API Platform',
                'category_id' => $categories->where('name', 'software')->first()->id,
                'link' => 'https://www.postman.com',
                'description' => 'Tool per testare API REST',
                'image' => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
            ],
            [
                'name' => 'GitHub Documentation',
                'category_id' => $categories->where('name', 'documenti')->first()->id,
                'link' => 'https://docs.github.com',
                'description' => 'Guida completa a Git e GitHub',
                'image' => 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800',
            ],
        ];

        foreach ($resources as $resource) {
            Resource::create($resource);
        }
    }
}
