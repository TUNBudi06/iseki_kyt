<?php

namespace App\Http\Controllers;

use App\Helper\KytDateParser;
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

        // Get the team for this leader (assuming user has team_id or relationship)
        $team = TeamKYT::where('user_id', $user->id)->first();

        if (!$team) {
            return Inertia::render('Leader/Dashboard', [
                'team' => null,
                'weeksInCurrentMonth' => [],
                'currentYear' => now()->year,
                'currentMonthName' => now()->format('F'),
            ]);
        }

        // Get weeks in current month
        $currentMonth = now()->month;
        $currentYear = now()->year;
        $weeksInCurrentMonth = $this->getHowManyFridayInMonth($currentMonth, $currentYear);

        $weeklyKYT = [];
        foreach ($weeksInCurrentMonth as $index => $week) {
            $kyt = KYTList::where('team_k_y_t_id', $team->id)
                ->whereHas('kytDateList', function($q) use ($week) {
                    $q->where('kyt_date', $week['date_start']);
                })
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
            'currentYear' => $currentYear,
            'currentMonthName' => now()->format('F'),
        ]);
    }
}
