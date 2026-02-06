<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KytPenanganan extends Model
{
    protected $table = 'kyt_penanganans';

    protected $fillable = [
        'kyt_list_id',
        'penanganan_title',
        'foto_path',
        'result_path',
    ];

    public function kytList()
    {
        return $this->belongsTo(KytList::class, 'kyt_list_id');
    }
}
