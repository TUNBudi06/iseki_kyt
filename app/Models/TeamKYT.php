<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamKYT extends Model
{
    protected $table = 'team_k_y_t_s';

    protected $fillable = [
        'team_name',
        'team_description',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
