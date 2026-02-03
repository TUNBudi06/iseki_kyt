<?php

namespace App\Http\Controllers;

use App\Helper\KytDateParser;
use App\Models\KytDateList;
use App\Models\KYTList;
use App\Models\TeamKYT;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LeaderController extends Controller
{
    use KytDateParser;

    private $basePath = 'storage/kyt';

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
                'image_url' => $kyt->result_path, // Use result_path field from database
                'status' => 'submitted',
                'submitted_at' => $kyt->created_at,
                'week_number' => $week['week_number'],
                'kyt_date_id' => $week['id'], // Add kyt_date_id for linking
            ] : [
                'kyt_date_id' => $week['id'], // Add kyt_date_id for empty weeks too
            ];
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
            'result_path' => 'required|image|max:8192',
            'title' => 'required|string|max:255',
            'user_name' => 'required|string|max:255',
            'potensi' => 'required|string',
            'penanganan' => 'required|string',
            'kyt_date_id' => 'required|exists:kyt_date_lists,id',
            'team_id' => 'required|exists:team_k_y_t_s,id',
        ]);

        $kytDate = KytDateList::find($validated['kyt_date_id']);
        $teamKYT = TeamKYT::find($validated['team_id']);
        $date = Carbon::parse($kytDate->kyt_date);

        return DB::transaction(function () use ($request, $kytDate, $teamKYT, $validated, $date) {

            // Create KYT record
            $kyt = new KYTList;
            $kyt->team_k_y_t_id = $teamKYT->id;
            $kyt->kyt_date_id = $kytDate->id;
            $kyt->user_name = $validated['user_name'];
            $kyt->title = $validated['title'];
            $kyt->potensi = $validated['potensi'];
            $kyt->penanganan = $validated['penanganan'];
            $kyt->save();

            // Create directory path: storage/kyt/2026-02_week-5/
            $dir = $this->basePath.'/'.$date->format('Y-m').'_'.'week-'.$kytDate->number_of_Weeks;

            \Log::info('KYT Upload Debug', [
                'directory' => $dir,
                'team_name' => $teamKYT->team_name,
                'kyt_id' => $kyt->id,
                'has_foto_path' => $request->hasFile('foto_path'),
                'has_result_path' => $request->hasFile('result_path'),
            ]);

            // Handle foto_path upload (edited canvas image)
            if ($request->hasFile('foto_path')) {
                $fotoFile = $request->file('foto_path');
                $fotoFilename = 'foto_'.$teamKYT->team_name.'.'.$fotoFile->getClientOriginalExtension();
                $fotoPath = $fotoFile->move($dir, $fotoFilename);
                $kyt->foto_path = $dir.'/'.$fotoFilename;
            }

            // Handle result_path upload (full preview thumbnail)
            if ($request->hasFile('result_path')) {
                $resultFile = $request->file('result_path');
                $resultFilename = 'result_'.$teamKYT->team_name.'.'.$resultFile->getClientOriginalExtension();
                $resultPath = $resultFile->move($dir, $resultFilename);
                $kyt->result_path = $dir.'/'.$resultFilename;
            }

            $kyt->save();

            return redirect()->route('leader.kyt')->with('success', 'KYT berhasil disimpan!');
        });
    }

    // Settings Methods
    public function settings()
    {
        return Inertia::render('Leader/Settings');
    }

    public function changePassword(Request $request)
    {
        $user = auth()->user();

        $data = $request->validate([
            'new_password' => 'required|string|min:8|confirmed',
        ], [
            'new_password.required' => 'New password is required.',
            'new_password.min' => 'New password must be at least 8 characters.',
            'new_password.confirmed' => 'Password confirmation does not match.',
        ]);

        // Update password directly
        $user->password = $data['new_password'];
        $user->save();

        return back()->with(['success' => 'Password changed successfully.']);
    }

    public function deleteKyt($id)
    {
        try {
            $kyt = KYTList::findOrFail($id);

            // Check if the KYT belongs to the current user's team
            $user = auth()->user();
            $team = TeamKYT::where('user_id', $user->id)->first();

            if (! $team || $kyt->team_k_y_t_id !== $team->id) {
                return back()->with(['error' => 'You are not authorized to delete this KYT.']);
            }

            // Delete the image files if they exist
            if ($kyt->foto_path && file_exists(public_path($kyt->foto_path))) {
                unlink(public_path($kyt->foto_path));
            }

            if ($kyt->result_path && file_exists(public_path($kyt->result_path))) {
                unlink(public_path($kyt->result_path));
            }

            // Delete the KYT record
            $kyt->delete();

            return redirect()->route('leader.kyt')->with(['success' => 'KYT deleted successfully.']);
        } catch (\Exception $e) {
            return back()->with(['error' => 'Failed to delete KYT: '.$e->getMessage()]);
        }
    }
}
