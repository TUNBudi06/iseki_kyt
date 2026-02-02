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

        if (! $team) {
            return Inertia::render('Leader/Dashboard', [
                'team' => null,
                'weeksInCurrentMonth' => [],
                'currentYear' => now()->year,
                'currentMonthName' => now()->format('F'),
            ]);
        }

        // Get weeks for current and next month using trait method
        $weeksInCurrentMonth = $this->getWeeksForCurrentAndNextMonth();

        // Get KYT submissions for this team
        $weeklyKYT = [];
        foreach ($weeksInCurrentMonth as $week) {
            $kyt = KYTList::where('team_k_y_t_id', $team->id)
                ->where('kyt_date_id', $week['id'])
                ->first();

            // Use week_number as key instead of index
            $weeklyKYT[$week['week_number']] = $kyt ? [
                'id' => $kyt->id,
                'image_url' => $kyt->{'result-path'}, // Use result-path field from database
                'status' => 'submitted',
                'submitted_at' => $kyt->created_at,
                'week_number' => $week['week_number'],
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

    public function kytHistory(): Response
    {
        $user = auth()->user();

        // Get the team for this leader
        $team = TeamKYT::where('user_id', $user->id)->first();

        // Get all date lists with KYT entries filtered by team
        $dateLists = KytDateList::with(['kytLists' => function ($query) use ($team) {
            if ($team) {
                $query->where('team_k_y_t_id', $team->id);
            }
        }])
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('Leader/KytHistory', [
            'kytListDates' => $dateLists,
            'team' => $team ? [
                'id' => $team->id,
                'team_name' => $team->team_name,
            ] : null,
        ]);
    }

    public function addKyt(string $IdKytDate)
    {
        $kytDateList = KytDateList::find($IdKytDate);

        $kytTeam = TeamKYT::where('user_id', auth()->user()->id)->first();

        return Inertia::render('Leader/editor-KYT', [
            'bgKyt' => asset('assets/img/bg-kyt.jpg'),
            'kytDate' => $kytDateList->kyt_date,
            'kytTeam' => $kytTeam->team_name,
            'kytDateId' => $kytDateList->id,
            'kytTeamId' => $kytTeam->id,
        ]);
    }

    public function storeKyt(Request $request)
    {
        $validated = $request->validate([
            'foto_path' => 'required|image|max:2048',
            'title' => 'required|string|max:255',
            'user_name' => 'required|string|max:255',
            'potensi' => 'required|string',
            'penanganan' => 'required|string',
            'kyt_date_id' => 'required|exists:kyt_date_lists,id',
            'team_id' => 'required|exists:team_k_y_t_s,id',
        ]);



        return $validated;
    }
}
