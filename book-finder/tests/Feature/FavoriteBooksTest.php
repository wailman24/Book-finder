<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class FavoriteBooksTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_list_their_favorite_books()
    {
        // 1. Manually create a user (matching your specific migration columns)
        $user = User::create([
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        $book = Book::create([
            'title' => 'Test Book',
            'author' => 'Test Author',
            'isbn' => '1234567890123',
            'cover_url' => 'https://example.com/image.jpg'
        ]);

        // 3. Attach the favorite
        $user->favoriteBooks()->attach($book->id);

        $response = $this->actingAs($user)
            ->getJson('/api/listfavorites');
        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success'
            ]);

        $this->assertCount(1, $response->json('favorites'));
    }

    public function test_unauthenticated_user_cannot_access_favorites()
    {
        // Ensure you are using the correct URL as defined in your routes
        $response = $this->getJson('/api/listfavorites');
        // This will only return 401 if the route is protected by 'auth:sanctum' or 'auth' middleware
        $response->assertStatus(401);
    }
}
