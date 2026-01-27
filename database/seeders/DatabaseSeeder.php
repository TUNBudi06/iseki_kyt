<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::insert([
            [
                'username' => 'admin',
                'password' => 'iseki123', // In a real application, make sure to hash passwords. yes i know but i dont need it
                'role' => 'admin',
            ],
        ]);
    }
}
