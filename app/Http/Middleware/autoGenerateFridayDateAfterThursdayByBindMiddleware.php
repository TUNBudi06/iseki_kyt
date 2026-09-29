<?php

namespace App\Http\Middleware;

use App\Helper\KytDateParser;
use App\Models\KytDateList;
use Carbon\CarbonInterface;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class autoGenerateFridayDateAfterThursdayByBindMiddleware
{
    use KytDateParser;
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $kytDate = KytDateList::latest('kyt_date')->first();

        if (!$kytDate) {
            // If no data exists, generate current month
            $this->generateMonthFridays(now()->month, now()->year);
        } else {
            $base = Carbon::parse($kytDate->kyt_date);

            // Check if we're 2 days before the last Friday (Wednesday)
            if ($base->copy()->subDays(2)->timestamp > now()->timestamp) {
                return $next($request);
            }

            // Generate next month based on CURRENT date, not last Friday
            $months = $this->getCurrentAndNextMonth();

            $generatedCacheKey = 'kyt_months_generated_'
                .$months['current']['year'].'-'.$months['current']['month'].'_'
                .$months['next']['year'].'-'.$months['next']['month'];

            if (Cache::has($generatedCacheKey)) {
                return $next($request);
            }

            // Check if CURRENT month already has data
            $currentMonthHasData = KytDateList::whereYear('kyt_date', $months['current']['year'])
                ->whereMonth('kyt_date', $months['current']['month'])
                ->exists();

            if (!$currentMonthHasData) {
                $this->generateMonthFridays($months['current']['month'], $months['current']['year']);
            }

            // Check if NEXT month already has data
            $nextMonthHasData = KytDateList::whereYear('kyt_date', $months['next']['year'])
                ->whereMonth('kyt_date', $months['next']['month'])
                ->exists();

            if (!$nextMonthHasData) {
                $this->generateMonthFridays($months['next']['month'], $months['next']['year']);
            }

            Cache::put($generatedCacheKey, true, now()->addHour());
        }

        return $next($request);
    }

    /**
     * Generate all Fridays for a given month
     */
    protected function generateMonthFridays(int $month, int $year): void
    {
        $allFridays = $this->getHowManyFridayInMonth($month, $year);

        foreach ($allFridays as $index => $friday) {
            try {
                KytDateList::firstOrCreate(
                    ['kyt_date' => $friday['date_end']],
                    ['number_of_Weeks' => $index + 1]
                );
            } catch (\Illuminate\Database\QueryException $e) {
                // Another concurrent request already inserted this Friday - safe to ignore.
            }
        }
    }
}
