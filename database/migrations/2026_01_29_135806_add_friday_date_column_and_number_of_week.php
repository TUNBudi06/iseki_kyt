<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('k_y_t_lists', function (Blueprint $table) {
            $table->date('friday_date')->after('id')->nullable()->comment('tanggal hari jumat pada minggu kyt dibuat');
            $table->integer('number_of_week')->after('friday_date')->nullable()->comment('minggu keberapa dalam tahun berjalan kyt dibuat');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
