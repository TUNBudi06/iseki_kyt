<?php

namespace Database\Seeders;

use App\Models\KytDateList;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KytDateListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Generate all Fridays for the year 2026
        $startDate = Carbon::create(2026, 1, 1);
        $endDate = Carbon::create(2026, 12, 31);

        $weekNumber = 1;

        // Find first Friday of 2026
        $currentFriday = $startDate->copy();
        while ($currentFriday->dayOfWeek !== Carbon::FRIDAY) {
            $currentFriday->addDay();
        }

        // Loop through all Fridays
        while ($currentFriday->lte($endDate)) {
            KytDateList::create([
                'kyt_date' => $currentFriday->format('Y-m-d'),
                'number_of_Weeks' => $weekNumber,
            ]);

            // Move to next Friday
            $currentFriday->addWeek();
            $weekNumber++;
        }

        $this->command->info('Generated ' . ($weekNumber - 1) . ' weeks for 2026');
    }
}
