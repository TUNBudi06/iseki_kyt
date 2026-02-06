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
        Schema::create('kyt_penanganans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('kyt_list_id');
            $table->foreign('kyt_list_id')->references('id')->on('k_y_t_lists')->onDelete('cascade');
            $table->text('penanganan_title')->nullable();
            $table->string('result_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kyt_penanganans');
    }
};
