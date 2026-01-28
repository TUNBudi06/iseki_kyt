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
        Schema::create('k_y_t_lists', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('team_k_y_t_id');
            $table->foreign('team_k_y_t_id')->references('id')->on('team_k_y_t_s')->onDelete('cascade');
            $table->string('user_name')->comment('disampaikan oleh siapa');
            $table->string('title')->comment('judul kyt');
            $table->text('potensi')->comment('potensi bahaya kyt');
            $table->text('penanganan')->comment('penanganan kyt');
            $table->string('foto-path')->nullable()->comment('path foto kyt');
            $table->string('result-path')->nullable()->comment('path foto hasil penanganan kyt');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('k_y_t_lists');
    }
};
