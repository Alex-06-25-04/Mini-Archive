<?php

namespace App\Http\Controllers;

use App\Services\ResourceService;
use App\Models\Resource;
use App\Http\Requests\StoreResourceRequest;
use App\Http\Requests\SearchResourceRequest;
use App\Http\Requests\EditResourceRequest;

class ResourceController extends Controller
{
    protected ResourceService $service;

    public function __construct(ResourceService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $resources = $this->service->getAll();

        // return view('resource.index', compact('resources'));
        return response()->json($resources, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreResourceRequest $request)
    {
        // DEBUG TEMPORANEO
        \Log::info('Store Resource - Dati ricevuti:', $request->all());

        $resource = $this->service->create($request->validated());

        \Log::info('Store Resource - Risorsa creata:', ['id' => $resource->id]);

        return response()->json($resource, 201);
    }

    /**
     * Search the specific name or category about the resource
     */
    public function search(SearchResourceRequest $request)
    {
        // Ricerca per nome
        // if ($request->has("name"))
        //     $query->where("name", "like", "%$request->name%");

        $resources = $this->service->search($request->validated());

        return response()->json($resources);
    }

    /**
     * Display the specified resource.
     */
    public function show(Resource $resource)
    {
        return response()->json($resource, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EditResourceRequest $request, Resource $resource)
    {
        // $resource = Resource::findOrFail($id);

        $resource = $this->service->update($resource, $request->validated());

        return response()->json($resource, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resource $resource)
    {
        $this->service->delete($resource);

        return response()->json(null, 204);
    }
}
