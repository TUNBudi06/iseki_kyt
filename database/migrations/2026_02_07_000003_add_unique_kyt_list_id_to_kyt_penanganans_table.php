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
        Schema::table('kyt_penanganans', function (Blueprint $table) {
            $table->unique('kyt_list_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kyt_penanganans', function (Blueprint $table) {
            $table->dropUnique(['kyt_list_id']);
        });
    }
};
