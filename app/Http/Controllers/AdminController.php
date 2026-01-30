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

    //
    public function index()
    {
        // Get current month and next month weeks from database
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

        // Get all teams with their KYT submissions
        $teams = TeamKYT::all()->map(function($team) use ($weeksInCurrentMonth) {
            $weeklyKYT = [];
            foreach ($weeksInCurrentMonth as $index => $week) {
                $kyt = \App\Models\KYTList::where('team_k_y_t_id', $team->id)
                    ->where('kyt_date_id', $week['id'])
                    ->first();

                $weeklyKYT[$index] = $kyt ? [
                    'id' => $kyt->id,
                    'image' => $kyt->{'result-path'}, // Use result-path field
                    'title' => $kyt->title,
                    'desc' => $kyt->potensi,
                    'submittedBy' => $kyt->user_name,
                ] : null;
            }

            return [
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
        $team = TeamKYT::findOrFail($id);
        $team->delete();

        return back()->with(['success' => 'Team deleted successfully.']);
    }

    public function kytList()
    {
        $kytList = KytDateList::with(['kytLists'])->get();

        return Inertia::render('Admin/KYT-list-index', [
            'kytLists' => $kytList,
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
}
