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
}
