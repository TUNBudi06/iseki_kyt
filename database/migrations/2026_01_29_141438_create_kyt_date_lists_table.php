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
        Schema::create('kyt_date_lists', function (Blueprint $table) {
            $table->id();
            $table->date('kyt_date')->unique();
            $table->integer('number_of_Weeks')->comment('minggu ke- dalam setahun')->default(1);
            $table->timestamps();
        });

        Schema::table('k_y_t_lists', function (Blueprint $table) {
            $table->unsignedBigInteger('kyt_date_id')->after('team_k_y_t_id');
            $table->foreign('kyt_date_id')->references('id')->on('kyt_date_lists')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kyt_date_lists');
    }
};
