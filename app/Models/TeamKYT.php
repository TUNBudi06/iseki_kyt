<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeamKYT extends Model
{
    use SoftDeletes;

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

    public function kytLists()
    {
        return $this->hasMany(KYTList::class, 'team_k_y_t_id');
    }
}
