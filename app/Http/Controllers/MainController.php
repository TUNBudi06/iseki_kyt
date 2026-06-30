<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MainController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Auth/LoginPage');
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'username' => 'required',
            'password' => 'required|string',
        ]);


        $user = User::where('username', $data['username'])->first();
        if (!$user){
            return back()->withErrors(['username' => 'Username not found.']);
        }

        if ($user->password !== $data['password']){
            return back()->withErrors(['password' => 'Incorrect password.']);
        }
        Auth::login($user);

        if ($user->role === 'admin') {
            return redirect()->route('admin.home')->with('success', 'Login successful! Welcome Admin.');
        }

        return redirect()->route('leader.dashboard')->with('success', 'Login successful! Welcome back.');
    }

    public function logout()
    {
        Auth::logout();
        return redirect('/')->with('success', 'Logged out successfully.');
    }
}
