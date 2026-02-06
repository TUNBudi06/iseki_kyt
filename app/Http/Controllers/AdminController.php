<?php

namespace App\Http\Controllers;

use App\Helper\KytDateParser;
use App\Models\KytDateList;
use App\Models\KYTList;
use App\Models\TeamKYT;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    use KytDateParser;

    public function index()
    {
        $weeksInCurrentMonth = $this->getWeeksForCurrentAndNextMonth();
        //        debugbar()->info($weeksInCurrentMonth);
        $teams = TeamKYT::all()->map(function ($team) use ($weeksInCurrentMonth) {
            $weeklyKYT = [];

            foreach ($weeksInCurrentMonth as $week) {
                $kyt = KYTList::with('Penanganans')->where('team_k_y_t_id', $team->id)
                    ->where('kyt_date_id', $week['id'])
                    ->first();

                $weeklyKYT[$week['id']] = $kyt ? [
                    'id' => $kyt->id,
                    'image' => $kyt->result_path,
                    'title' => $kyt->title,
                    'desc' => $kyt->potensi,
                    'status' => $kyt->penanganans ?: false,
                    'submittedBy' => $kyt->user_name,
                    'week_number' => $week['week_number'],
                    'kyt_date_id' => $week['id'],
                ] : null;
            }

            return [
                'id' => $team->id,
                'name' => $team->team_name,
                'desc' => $team->team_description,
                'weeklyKYT' => $weeklyKYT,
            ];
        })->toArray();

        return Inertia::render('Admin/Dashboard', [
            'weeksInCurrentMonth' => $weeksInCurrentMonth,
            'teams' => $teams,
            'currentMonthName' => now()->format('F'),
            'currentYear' => now()->year,
        ]);
    }

    public function userList()
    {
        $user = User::all();

        return Inertia::render('Admin/User-Lists', [
            'users' => $user,
        ]);
    }

    public function userAdd(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|unique:users,username',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,leader',
        ]);
        debugbar()->info($data);
        $user = new User;
        $user->username = $data['username'];
        $user->password = $data['password'];
        $user->role = $data['role'];
        $user->save();

        return back()->with(['success' => 'User added successfully.']);
    }

    public function userEdit(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'username' => 'required|unique:users,username,'.$id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|in:admin,leader',
        ]);

        $user->username = $data['username'];
        if (! empty($data['password'])) {
            $user->password = $data['password'];
        }
        $user->role = $data['role'];
        $user->save();

        return back()->with(['success' => 'User updated successfully.']);
    }

    public function userDelete($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return back()->with(['success' => 'User deleted successfully.']);
    }

    // Team Management Methods
    public function teamList()
    {
        $teams = TeamKYT::with('user')->get();
        $users = User::all(); // For PIC dropdown

        return Inertia::render('Admin/Team-Lists', [
            'teams' => $teams,
            'users' => $users,
        ]);
    }

    public function teamAdd(Request $request)
    {
        $data = $request->validate([
            'team_name' => 'required|string|max:255|unique:team_k_y_t_s,team_name',
            'team_description' => 'nullable|string|max:500',
            'user_id' => 'required|exists:users,id',
        ]);

        TeamKYT::create($data);

        return back()->with(['success' => 'Team added successfully.']);
    }

    public function teamEdit(Request $request, $id)
    {
        $team = TeamKYT::findOrFail($id);

        $data = $request->validate([
            'team_name' => 'required|string|max:255|unique:team_k_y_t_s,team_name,'.$id,
            'team_description' => 'nullable|string|max:500',
            'user_id' => 'required|exists:users,id',
        ]);

        $team->update($data);

        return back()->with(['success' => 'Team updated successfully.']);
    }

    public function teamDelete($id)
    {
        try {
            $team = TeamKYT::findOrFail($id);
            $team->delete();

            return back()->with(['success' => 'Team deleted successfully.']);
        } catch (\Exception $e) {
            return back()->with(['error' => 'Failed to delete team: '.$e->getMessage()]);
        }
    }

    public function kytList(Request $request)
    {
        // Get month-year from request or default to current month
        $monthYear = $request->input('month_year', now()->format('Y-m'));
        [$year, $month] = explode('-', $monthYear);

        // Get all available month-year combinations from KytDateList
        $availableMonths = KytDateList::selectRaw('DISTINCT DATE_FORMAT(kyt_date, "%Y-%m") as month_year, YEAR(kyt_date) as year, MONTH(kyt_date) as month')
            ->orderBy('kyt_date', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'value' => $item->month_year,
                    'label' => now()->setDate($item->year, $item->month, 1)->format('F Y'),
                ];
            });

        // Filter KytDateList by selected month and year
        $kytList = KytDateList::whereYear('kyt_date', $year)
            ->whereMonth('kyt_date', $month)
            ->with(['kytLists' => function ($q) {
                $q->with(['kytDateList', 'teamKYT', 'Penanganans']);
            }])
            ->orderBy('kyt_date', 'asc')
            ->get();

        $teamKyt = TeamKYT::all();

        return Inertia::render('Admin/KYT-list-index', [
            'kytLists' => $kytList,
            'teamKyt' => $teamKyt,
            'availableMonths' => $availableMonths,
            'selectedMonthYear' => $monthYear,
        ]);
    }

    // Settings Methods
    public function settings()
    {
        return Inertia::render('Admin/Settings');
    }

    public function changePassword(Request $request)
    {
        $user = auth()->user();

        $data = $request->validate([
            'new_password' => 'required|string|confirmed',
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
}
