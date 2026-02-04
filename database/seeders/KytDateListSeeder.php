<?php

namespace Database\Seeders;

use App\Helper\KytDateParser;
use App\Models\KytDateList;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class KytDateListSeeder extends Seeder
{
    use KytDateParser;

    /**
     * Run the database seeds.
     * Generates all Fridays for 2 years before and 2 years after current date
     * Each month has its own week numbering (1-4 or 1-5)
     */
    public function run(): void
    {
        // Get current date
        $today = Carbon::now();

        // Calculate start date (2 years before)
        $startYear = $today->year - 2;

        // Calculate end date (2 years after)
        $endYear = $today->year + 2;

        $this->command->info("Generating weeks from {$startYear} to {$endYear}");

        $totalWeeks = 0;

        // Loop through each year
        for ($year = $startYear; $year <= $endYear; $year++) {
            // Loop through each month
            for ($month = 1; $month <= 12; $month++) {
                // Get all Fridays in this month using KytDateParser helper
                $fridays = $this->getHowManyFridayInMonth($month, $year);

                // Insert each Friday with its week number (resets each month)
                foreach ($fridays as $weekNumber => $fridayData) {
                    $kytDate = $fridayData['date_end']; // The Friday date

                    // Check if this date already exists to avoid duplicates
                    $exists = KytDateList::where('kyt_date', $kytDate)->exists();

                    if (! $exists) {
                        KytDateList::create([
                            'kyt_date' => $kytDate,
                            'number_of_Weeks' => $weekNumber + 1, // Week 1, 2, 3, 4, or 5
                        ]);
                        $totalWeeks++;
                    }
                }

                $this->command->info('Generated '.count($fridays).' weeks for '.$this->monthNumberToName($month)." {$year}");
            }
        }

        $this->command->info("Successfully generated {$totalWeeks} weeks total ({$startYear} - {$endYear})");
    }
}
