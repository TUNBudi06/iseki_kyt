<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KYTList extends Model
{
    protected $table = 'k_y_t_lists';

    protected $fillable = [
        'team_k_y_t_id',
        'kyt_date_id',
        'user_name',
        'title',
        'potensi',
        'penanganan',
        'foto',
        'result',
    ];
}
