<?php

namespace App\Services;

use App\Models\Resource;

class ResourceService
{

    public function getAll()
    {
        return Resource::with('category')->get();
    }

    public function search(array $filters)
    {
        // return Resource::query()
        //     ->when(
        //         $filters['name'] ?? null,
        //         fn($q, $name) =>
        //         $q->where('name', "like", "%{$name}%")
        //     )
        //     ->when(
        //         $filters['category'] ?? null,
        //         fn($q, $cat) =>
        //         $q->where('category', 'like', "%{$cat}%")
        //     )
        //     ->get();
        $query = Resource::query()->with('category');

        $searchTerm = $filters['name'] ?? $filters['category'] ?? null;

        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhereHas('category', function ($q) use ($searchTerm) {
                        $q->where('name', 'like', "%{$searchTerm}%");
                    });
            });

            // whereHas('category', ...) → cerca nelle risorse che hanno una categoria il cui nome contiene il termine
        }

        return $query->get();
    }

    public function create(array $data)
    {
        return Resource::create($data);
    }

    public function update(Resource $resource, array $data)
    {
        $resource->update($data);

        return $resource;
    }

    public function delete(Resource $resource)
    {
        return $resource->delete();
    }
}