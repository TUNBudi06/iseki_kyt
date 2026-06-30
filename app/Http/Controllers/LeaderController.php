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
        //        debugbar()->info($weeksInCurrentMonth);

        $weeklyKYT = [];
        foreach ($weeksInCurrentMonth as $week) {
            $kyt = KYTList::with('Penanganans')->where('team_k_y_t_id', $team->id)
                ->where('kyt_date_id', $week['id'])
                ->first();
            //            debugbar()->info($kyt,$team->id,$week['week_number']);

            $weeklyKYT[$week['id']] = $kyt ? [
                'id' => $kyt->id,
                'image_url' => $kyt->result_path,
                'foto_path' => $kyt->foto_path,
                'title' => $kyt->title,
                'user_name' => $kyt->user_name,
                'potensi' => $kyt->potensi,
                'penanganan' => $kyt->penanganan,
                'status' => $kyt->Penanganans ? true : false,
                'submitted_at' => $kyt->created_at,
                'week_number' => $week['week_number'],
                'kyt_date_id' => $week['id'],
            ] : [
                'kyt_date_id' => $week['id'],
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
            'bgKyt' => asset('assets/img/bg-kyt.jpg'),
        ]);
    }

    public function kytHistory(Request $request): Response
    {
        $user = auth()->user();

        // Get the team for this leader
        $team = TeamKYT::where('user_id', $user->id)->first();

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

        // Get date lists with KYT entries filtered by team and selected month
        $dateLists = KytDateList::whereYear('kyt_date', $year)
            ->whereMonth('kyt_date', $month)
            ->with(['kytLists' => function ($query) use ($team) {
                if ($team) {
                    $query->where('team_k_y_t_id', $team->id)->with(['kytDateList']);
                }
                $query->with('penanganans');
            }])
            ->orderBy('kyt_date', 'desc')
            ->get();

        return Inertia::render('Leader/KytHistory', [
            'kytListDates' => $dateLists,
            'team' => $team ? [
                'id' => $team->id,
                'team_name' => $team->team_name,
            ] : null,
            'availableMonths' => $availableMonths,
            'selectedMonthYear' => $monthYear,
            'bgKyt' => asset('assets/img/bg-kyt.jpg'),
        ]);
    }

    public function addKyt(string $IdKytDate)
    {
        $kytDateList = KytDateList::find($IdKytDate);

        $kytTeam = TeamKYT::where('user_id', auth()->user()->id)->first();

        return Inertia::render('Leader/editor-KYT-create', [
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
                $fotoFilename = 'fotoKyt_'.$teamKYT->team_name.'.'.$fotoFile->getClientOriginalExtension();
                $fotoPath = $fotoFile->move($dir, $fotoFilename);
                $kyt->foto_path = $dir.'/'.$fotoFilename;
            }

            // Handle result_path upload (full preview thumbnail)
            if ($request->hasFile('result_path')) {
                $resultFile = $request->file('result_path');
                $resultFilename = 'resultKyt_'.$teamKYT->team_name.'.'.$resultFile->getClientOriginalExtension();
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

    public function editKyt(string $id)
    {
        $kyt = KYTList::findOrFail($id);

        // Check if the KYT belongs to the current user's team
        $user = auth()->user();
        $team = TeamKYT::where('user_id', $user->id)->first();

        if (! $team || $kyt->team_k_y_t_id !== $team->id) {
            return back()->with(['error' => 'You are not authorized to edit this KYT.']);
        }

        $kytDateList = KytDateList::find($kyt->kyt_date_id);

        return Inertia::render('Leader/editor-KYT-edit', [
            'bgKyt' => asset('assets/img/bg-kyt.jpg'),
            'kytDate' => $kytDateList->kyt_date,
            'kytTeam' => $team->team_name,
            'kytId' => $kyt->id,
            'kytTeamId' => $team->id,
            'kytData' => [
                'id' => $kyt->id,
                'user_name' => $kyt->user_name,
                'title' => $kyt->title,
                'potensi' => $kyt->potensi,
                'penanganan' => $kyt->penanganan,
                'foto_path' => $kyt->foto_path,
                'result_path' => $kyt->result_path,
            ],
        ]);
    }

    public function updateKyt(Request $request, string $id)
    {
        $validated = $request->validate([
            'foto_path' => 'nullable|image|max:2048',
            'result_path' => 'required|image|max:8192',
            'title' => 'required|string|max:255',
            'user_name' => 'required|string|max:255',
            'potensi' => 'required|string',
            'penanganan' => 'required|string',
        ]);

        return DB::transaction(function () use ($request, $validated, $id) {

            // Create KYT record
            $kyt = KYTList::with(['kytDateList', 'teamKYT'])->findOrFail($id);
            $kyt->user_name = $validated['user_name'];
            $kyt->title = $validated['title'];
            $kyt->potensi = $validated['potensi'];
            $kyt->penanganan = $validated['penanganan'];
            $kyt->save();
            $date = Carbon::parse($kyt->kytDateList->kyt_date);

            // Create directory path: storage/kyt/2026-02_week-5/
            $dir = $this->basePath.'/'.$date->format('Y-m').'_'.'week-'.$kyt->kytDateList->number_of_Weeks;

            \Log::info('KYT Upload Debug', [
                'directory' => $dir,
                'kyt_id' => $kyt->id,
                'has_foto_path' => $request->hasFile('foto_path'),
                'has_result_path' => $request->hasFile('result_path'),
            ]);

            // Handle foto_path upload (edited canvas image)
            if ($request->hasFile('foto_path')) {
                $fotoFile = $request->file('foto_path');
                $fotoFilename = 'fotoKyt_'.$kyt->teamKYT->team_name.'.'.$fotoFile->getClientOriginalExtension();
                $fotoPath = $fotoFile->move($dir, $fotoFilename);
                $kyt->foto_path = $dir.'/'.$fotoFilename;
            }

            // Handle result_path upload (full preview thumbnail)
            if ($request->hasFile('result_path')) {
                $resultFile = $request->file('result_path');
                $resultFilename = 'resultKyt_'.$kyt->teamKYT->team_name.'.'.$resultFile->getClientOriginalExtension();
                $resultPath = $resultFile->move($dir, $resultFilename);
                $kyt->result_path = $dir.'/'.$resultFilename;
            }

            $kyt->save();

            return back()->with('success', 'KYT berhasil diperbarui!');
        });
    }

    public function addPenanganan(string $kytListId)
    {
        $kyt = KYTList::findOrFail($kytListId);

        return Inertia::render('Leader/penanganan/Penanganan-create', [
            'kyt' => $kyt,
        ]);
    }

    public function editPenanganan(string $id)
    {
        $penanganan = \App\Models\KytPenanganan::with('kytList')->findOrFail($id);

        // Check authorization
        $user = auth()->user();
        $team = TeamKYT::where('user_id', $user->id)->first();

        if (! $team || $penanganan->kytList->team_k_y_t_id !== $team->id) {
            return back()->with(['error' => 'You are not authorized to edit this penanganan.']);
        }

        return Inertia::render('Leader/penanganan/Penanganan-edit', [
            'penanganan' => [
                'id' => $penanganan->id,
                'penanganan_title' => $penanganan->penanganan_title,
                'foto_path' => $penanganan->foto_path,
                'result_path' => $penanganan->result_path,
                'kyt_list_id' => $penanganan->kyt_list_id,
            ],
            'kyt' => $penanganan->kytList,
        ]);
    }

    public function updatePenanganan(Request $request, string $id)
    {
        $penanganan = \App\Models\KytPenanganan::with(['kytList.kytDateList', 'kytList.teamKYT'])->findOrFail($id);

        // Check authorization
        $user = auth()->user();
        $team = TeamKYT::where('user_id', $user->id)->first();

        if (! $team || $penanganan->kytList->team_k_y_t_id !== $team->id) {
            return back()->with(['error' => 'You are not authorized to update this penanganan.']);
        }

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'foto_path' => 'nullable|max:8192',
            'result_path' => 'nullable|max:8192',
        ]);

        return DB::transaction(function () use ($request, $data, $penanganan) {
            $penanganan->penanganan_title = $data['title'];
            $date = Carbon::parse($penanganan->kytList->kytDateList->kyt_date);
            $dir = $this->basePath.'/'.$date->format('Y-m').'_'.'week-'.$penanganan->kytList->kytDateList->number_of_Weeks;

            if ($request->hasFile('foto_path')) {
                // Remove old file
                if ($penanganan->foto_path && file_exists(public_path($penanganan->foto_path))) {
                    unlink(public_path($penanganan->foto_path));
                }
                $file = $request->file('foto_path');
                $filename = 'penangananKyt_'.$penanganan->kytList->teamKYT->team_name.'_'.time().'.'.$file->getClientOriginalExtension();
                $file->move($dir, $filename);
                $penanganan->foto_path = $dir.'/'.$filename;
            }

            if ($request->hasFile('result_path')) {
                // Remove old file
                if ($penanganan->result_path && file_exists(public_path($penanganan->result_path))) {
                    unlink(public_path($penanganan->result_path));
                }
                $file = $request->file('result_path');
                $filename = 'penangananResultKyt_'.$penanganan->kytList->teamKYT->team_name.'_'.time().'.'.$file->getClientOriginalExtension();
                $file->move($dir, $filename);
                $penanganan->result_path = $dir.'/'.$filename;
            }

            $penanganan->save();

            return redirect()->route('leader.kyt')->with('success', 'Penanganan berhasil diperbarui!');
        });
    }

    public function submitPenanganan(Request $request, string $id)
    {
        $validated = $request->validate([
            'penanganan' => 'required|string',
        ]);

        $kyt = KYTList::findOrFail($id);

        // Check if the KYT belongs to the current user's team
        $user = auth()->user();
        $team = TeamKYT::where('user_id', $user->id)->first();

        if (! $team || $kyt->team_k_y_t_id !== $team->id) {
            return back()->with(['error' => 'You are not authorized to update this KYT.']);
        }

        $kyt->penanganan = $validated['penanganan'];
        $kyt->save();

        return back()->with(['success' => 'Penanganan berhasil disubmit!']);
    }

    /**
     * @throws \Throwable
     */
    public function storePenanganan(Request $request)
    {
        $data = $request->validate([
            'kyt_list_id' => 'required|exists:k_y_t_lists,id',
            'title' => 'required|string|max:255',
            'foto_path' => 'nullable|max:8192',
            'result_path' => 'nullable|max:8192',
        ]);

        $kytList = KYTList::with(['kytDateList'])->findOrFail($data['kyt_list_id']);

        return DB::transaction(function () use ($request, $data, $kytList) {
            $penanganan = new \App\Models\KytPenanganan;
            $penanganan->kyt_list_id = $data['kyt_list_id'];
            $penanganan->penanganan_title = $data['title'];
            $date = Carbon::parse($kytList->kytDateList->kyt_date);
            // Handle result_path upload
            if ($request->hasFile('foto_path')) {
                $file = $request->file('foto_path');
                $dir = $this->basePath.'/'.$date->format('Y-m').'_'.'week-'.$kytList->kytDateList->number_of_Weeks;
                $filename = 'penangananKyt_'.$kytList->teamKYT->team_name.'_'.time().'.'.$file->getClientOriginalExtension();
                $filePath = $file->move($dir, $filename);
                $penanganan->foto_path = $dir.'/'.$filename;
            }
            if ($request->hasFile('result_path')) {
                $file = $request->file('result_path');
                $dir = $this->basePath.'/'.$date->format('Y-m').'_'.'week-'.$kytList->kytDateList->number_of_Weeks;
                $filename = 'penangananResultKyt_'.$kytList->teamKYT->team_name.'_'.time().'.'.$file->getClientOriginalExtension();
                $filePath = $file->move($dir, $filename);
                $penanganan->result_path = $dir.'/'.$filename;
            }
            $penanganan->save();

            return redirect()->route('leader.kyt', ['id' => $data['kyt_list_id']])->with('success', 'Penanganan berhasil ditambahkan!');
        });
    }
}
