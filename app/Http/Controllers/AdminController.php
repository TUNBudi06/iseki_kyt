<?php

namespace App\Http\Controllers;

use App\Helper\KytDateParser;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    use KytDateParser;
    //
    public function index()
    {
        return Inertia::render('Admin/Dashboard',[
            'weeksInCurrentMonth' => $this->getHowManyFridayInMonth(date('m'), date('Y')),
            'currentMonthName' => $this->monthNumberToName(date('m')),
            'currentYear' => date('Y'),
        ]);
    }
}
