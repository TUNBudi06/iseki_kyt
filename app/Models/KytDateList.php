<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KytDateList extends Model
{
    protected $table = 'kyt_date_lists';

    protected $fillable = [
        'kyt_date',
        'number_of_Weeks',
    ];

    public function kytLists()
    {
        return $this->hasMany(KYTList::class, 'kyt_date_id', 'id');
    }
}
