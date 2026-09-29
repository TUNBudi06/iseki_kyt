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
            $table->unique(['team_k_y_t_id', 'kyt_date_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('k_y_t_lists', function (Blueprint $table) {
            $table->dropUnique(['team_k_y_t_id', 'kyt_date_id']);
        });
    }
};
