<?php

use App\Http\Controllers\BookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [\App\Http\Controllers\UserController::class, 'Register']);
Route::post('/login', [\App\Http\Controllers\UserController::class, 'Login']);

Route::get('/getbooks', [BookController::class, 'getBooks']);
Route::post('/savebook', [BookController::class, 'saveBook']);
Route::get('/listbooks', [BookController::class, 'getSavedBooks']);
