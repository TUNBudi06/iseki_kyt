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
            $table->renameColumn('foto-path', 'foto_path');
            $table->renameColumn('result-path', 'result_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('k_y_t_lists', function (Blueprint $table) {
            $table->renameColumn('foto_path', 'foto-path');
            $table->renameColumn('result_path', 'result-path');
        });
    }
};
