<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });
        
        // Inserisco le categorie di base
        DB::table('categories')->insert([
            ['name' => 'documenti', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'software', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'hardware', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'marketing', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'formazione', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'hr', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
