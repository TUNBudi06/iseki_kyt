<?php

namespace App\Helper;

use Illuminate\Support\Facades\Cache;

trait KytDateParser
{
    public function getHowManyFridayInMonth($month, $year)
    {
        if (Cache::has('fridays_count_' . $month . '_' . $year)) {
            return Cache::get('fridays_count_' . $month . '_' . $year);
        }

        $fridays = [];
        $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);
        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date = strtotime("$year-$month-$day");
            if (date('N', $date) == 5) { // 5 means Friday
                $fridays[] = [
                    'date_end'=>date('Y-m-d', $date),
                    'date_start'=>date('Y-m-d', strtotime("-4 days", $date))
                ];
            }
        }
        debugbar()->log($fridays);
        Cache::put('fridays_count_' . $month . '_' . $year, $fridays);
        return $fridays;
    }

    public function monthNameToNumber($monthName): ?string
    {
        $date = \DateTime::createFromFormat('F', $monthName);
        return $date ? $date->format('m') : null;
    }

    public function monthNumberToName($monthNumber): ?string
    {
        $date = \DateTime::createFromFormat('m', str_pad($monthNumber, 2, '0', STR_PAD_LEFT));
        return $date ? $date->format('F') : null;
    }

    /**
     * Get current month and next month data
     * Returns array with current and next month/year
     */
    public function getCurrentAndNextMonth(): array
    {
        $currentMonth = now()->month;
        $currentYear = now()->year;

        // Calculate next month properly
        if ($currentMonth == 12) {
            $nextMonth = 1;
            $nextYear = $currentYear + 1;
        } else {
            $nextMonth = $currentMonth + 1;
            $nextYear = $currentYear;
        }

        return [
            'current' => [
                'month' => $currentMonth,
                'year' => $currentYear,
            ],
            'next' => [
                'month' => $nextMonth,
                'year' => $nextYear,
            ],
        ];
    }

    /**
     * Get KYT date list for current and next month
     * Returns collection of KytDateList with date_start and date_end calculated
     */
    public function getWeeksForCurrentAndNextMonth(): array
    {
        $months = $this->getCurrentAndNextMonth();

        $kytDates = \App\Models\KytDateList::where(function($query) use ($months) {
                $query->where(function($q) use ($months) {
                    $q->whereYear('kyt_date', $months['current']['year'])
                      ->whereMonth('kyt_date', $months['current']['month']);
                })
                ->orWhere(function($q) use ($months) {
                    $q->whereYear('kyt_date', $months['next']['year'])
                      ->whereMonth('kyt_date', $months['next']['month']);
                });
            })
            ->orderBy('kyt_date', 'asc')
            ->get();

        // Transform to include date_start and date_end
        return $kytDates->map(function($kytDate) {
            $friday = \Carbon\Carbon::parse($kytDate->kyt_date);
            return [
                'id' => $kytDate->id,
                'date_start' => $friday->copy()->subDays(4)->format('Y-m-d'), // Monday
                'date_end' => $friday->format('Y-m-d'), // Friday
                'week_number' => $kytDate->number_of_Weeks,
                'kyt_date' => $kytDate->kyt_date,
            ];
        })->toArray();
    }
}
