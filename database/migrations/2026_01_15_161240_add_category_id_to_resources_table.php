<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('resources', function (Blueprint $table) {
            // 1. Aggiungo la colonna category_id
            $table->foreignId('category_id')->nullable()->after('name');

            // 2. Creo la foreign key (collega resources -> categories)
            $table->foreign('category_id')
                ->references('id')
                ->on('categories')
                ->onDelete('cascade');
        });

        // 3. Migrazione dati: Associo ogni risorsa alla categoria giusta
        $resources = DB::table('resources')->get(); // Prendo tutte le 17 risorse
        foreach ($resources as $resource) {
            // Per ogni risorsa, trovo l'ID della categoria
            $categoryId = DB::table('categories')
                ->where('name', $resource->category)
                ->value('id');

            // Aggiorno la risorsa con il category_id
            DB::table('resources')
                ->where('id', $resource->id)
                ->update(['category_id' => $categoryId]);
        }

        // 4. Tolgo il vecchio campo category (dopo aver migrato i dati)
        Schema::table('resources', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('resources', function (Blueprint $table) {
            // Rimetto il campo category
            $table->string('category')->after('name');

            // Rimuovo la foreign key e la colonna category_id
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
    }
};
