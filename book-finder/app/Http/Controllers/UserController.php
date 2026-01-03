<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function Register(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:8|confirmed',
            ]);

            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'user',
            ]);


            return response()->json([
                'status' => 'success',
                'user' => new UserResource($user),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Registration failed', 'message' => $e->getMessage()], 400);
        }
    }

    public function Login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|min:8',
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

            $token = $user->createToken('auth_token')->plainTextToken;


            return response()->json([
                'status' => 'success',
                'user' => new UserResource($user),
                'token' => $token,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Login failed', 'message' => $e->getMessage()], 400);
        }
    }
}
