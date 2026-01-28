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
                $fridays[] = $day;
            }
        }
        Cache::put('fridays_count_' . $month . '_' . $year, count($fridays));
        return count($fridays);
    }

    public function getHowManyDateFridayInMonth($month,$years)
    {
        if(Cache::has('fridays_dates_' . $month . '_' . $years)) {
            return Cache::get('fridays_dates_' . $month . '_' . $years);
        }
        $fridays = [];
        $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $years);
        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date = strtotime("$years-$month-$day");
            if (date('N', $date) == 5) { // 5 means Friday
                $fridays[] = $date;
            }
        }
        Cache::put('fridays_dates_' . $month . '_' . $years, $fridays);
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
