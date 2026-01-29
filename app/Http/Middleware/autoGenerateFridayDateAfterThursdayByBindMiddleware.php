<?php

namespace App\Http\Middleware;

use App\Helper\KytDateParser;
use App\Models\KytDateList;
use Carbon\CarbonInterface;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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
        $kytDate = KytDateList::latest()->first();

        if (!$kytDate) {
            $friday = now()->next(CarbonInterface::FRIDAY);
        } else {
            $base = Carbon::parse($kytDate->kyt_date);

            if ($base->copy()->subDays(2)->timestamp > now()->timestamp) {
                return $next($request);
            }

            $friday = $base->copy()->next(CarbonInterface::FRIDAY);

            if ($friday->month !== $base->month) {
                $friday = $base->copy()->addMonthNoOverflow()->startOfMonth()->next(CarbonInterface::FRIDAY);
            }
        }

        $mYDateNow = $this->getHowManyFridayInMonth($friday->month, $friday->year);
        $weekIndex = array_search($friday->format('Y-m-d'), array_column($mYDateNow, 'date_end'), true);

        $newKytDate = new KytDateList();
        $newKytDate->kyt_date = $friday->format('Y-m-d');
        $newKytDate->number_of_Weeks = $weekIndex !== false ? $weekIndex + 1 : 1;
        $newKytDate->save();

        return $next($request);
    }
}
