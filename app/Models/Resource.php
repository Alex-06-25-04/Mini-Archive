<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    protected $fillable = [
        'name',
        'category_id',
        'image',
        'link',
        'description',
    ];

    // Relazione: Una risorsa appartiene a una categoria
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
