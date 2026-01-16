<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name'];

    // Relazione: Una categoria ha molte risorde
    public function resources()
    {
        return $this->hasMany(Resource::class);
    }
}
