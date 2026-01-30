<?php

namespace App\Http\Controllers;

use App\Helper\KytDateParser;
use App\Models\KytDateList;
use App\Models\KYTList;
use App\Models\TeamKYT;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaderController extends Controller
{
    use KytDateParser;

    /**
     * Display the leader dashboard
     */
    public function dashboard(): Response
    {
        $user = auth()->user();

        // Get the team for this leader
        $team = TeamKYT::where('user_id', $user->id)->first();

        if (!$team) {
            return Inertia::render('Leader/Dashboard', [
                'team' => null,
                'weeksInCurrentMonth' => [],
                'currentYear' => now()->year,
                'currentMonthName' => now()->format('F'),
            ]);
        }

        // Get current month and next month weeks from database
        $currentMonth = now()->month;
        $currentYear = now()->year;
        $nextMonth = now()->addMonth()->month;
        $nextYear = now()->addMonth()->year;

        // Get all weeks from current month and next month
        $kytDates = KytDateList::where(function($query) use ($currentMonth, $currentYear, $nextMonth, $nextYear) {
                $query->where(function($q) use ($currentMonth, $currentYear) {
                    $q->whereYear('kyt_date', $currentYear)
                      ->whereMonth('kyt_date', $currentMonth);
                })
                ->orWhere(function($q) use ($nextMonth, $nextYear) {
                    $q->whereYear('kyt_date', $nextYear)
                      ->whereMonth('kyt_date', $nextMonth);
                });
            })
            ->orderBy('kyt_date', 'asc')
            ->get();

        // Transform to include date_start and date_end
        $weeksInCurrentMonth = $kytDates->map(function($kytDate) {
            $friday = \Carbon\Carbon::parse($kytDate->kyt_date);
            return [
                'id' => $kytDate->id,
                'date_start' => $friday->copy()->subDays(4)->format('Y-m-d'), // Monday
                'date_end' => $friday->format('Y-m-d'), // Friday
                'kyt_date' => $kytDate->kyt_date,
            ];
        })->toArray();

        // Get KYT submissions for this team
        $weeklyKYT = [];
        foreach ($weeksInCurrentMonth as $index => $week) {
            $kyt = KYTList::where('team_k_y_t_id', $team->id)
                ->where('kyt_date_id', $week['id'])
                ->first();

            $weeklyKYT[$index] = $kyt ? [
                'id' => $kyt->id,
                'image_url' => $kyt->image_url,
                'status' => $kyt->status ?? 'submitted',
                'submitted_at' => $kyt->created_at,
            ] : null;
        }

        return Inertia::render('Leader/Dashboard', [
            'team' => [
                'id' => $team->id,
                'team_name' => $team->team_name,
                'team_description' => $team->team_description,
                'weeklyKYT' => $weeklyKYT,
            ],
            'weeksInCurrentMonth' => $weeksInCurrentMonth,
            'currentYear' => now()->year,
            'currentMonthName' => now()->format('F'),
        ]);
    }
}
