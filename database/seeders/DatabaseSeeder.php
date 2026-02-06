<?php

namespace Database\Seeders;

use App\Models\TeamKYT;
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
        // Seed KYT Date Lists first
        $this->call(KytDateListSeeder::class);

        User::insert([
            [
                'id' => 1,
                'username' => 'saiful',
                'password' => 'saiful123', // In a real application, make sure to hash passwords. yes i know but i dont need it
                'role' => 'admin',
            ],
            [
                'id' => 2,
                'username' => 'dst',
                'password' => 'iseki123',
                'role' => 'leader',
            ],
            [
                'id' => 3,
                'username' => 'painting',
                'password' => 'leader123',
                'role' => 'leader',
            ],
            [
                'id' => 4,
                'username' => 'mainline',
                'password' => 'iseki123',
                'role' => 'leader',
            ],
            [
                'id' => 5,
                'username' => 'subengine',
                'password' => 'iseki123',
                'role' => 'leader',
            ],
            [
                'id' => 6,
                'username' => 'inspeksi',
                'password' => 'iseki123',
                'role' => 'leader',
            ],
        ]);

        TeamKYT::insert([
            [
                'id' => 1,
                'team_name' => 'DST',
                'team_description' => 'Team for DST Department',
                'user_id' => 2,
            ],
            [
                'id' => 2,
                'team_name' => 'Painting',
                'team_description' => 'Team for Painting Department',
                'user_id' => 3,
            ],
            [
                'id' => 3,
                'team_name' => 'Mainline & Sub Assy',
                'team_description' => 'Team for Mainline Department',
                'user_id' => 4,
            ],
            [
                'id' => 4,
                'team_name' => 'Sub Engine & Transmission',
                'team_description' => 'Team for Subengine Department',
                'user_id' => 5,
            ],
            [
                'id' => 5,
                'team_name' => 'Inspeksi, Mow-Coll',
                'team_description' => 'Team for Inspeksi Department',
                'user_id' => 6,
            ]
        ]);
    }
}
