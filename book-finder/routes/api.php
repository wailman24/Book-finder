<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [UserController::class, 'Register']);
Route::post('/login', [UserController::class, 'Login']);

Route::middleware(['auth:sanctum', 'isadmin'])->group(function () {
    Route::get('/getbooks', [BookController::class, 'getBooks']);
    Route::post('/savebook', [BookController::class, 'saveBook']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/listbooks', [BookController::class, 'getSavedBooks']);
    Route::post('/togglefavorite', [FavoriteController::class, 'toggleFavorite']);
    Route::get('/listfavorites', [FavoriteController::class, 'listFavorites']);
});
