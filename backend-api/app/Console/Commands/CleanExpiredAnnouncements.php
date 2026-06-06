<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Announcement;
use Carbon\Carbon;

class CleanExpiredAnnouncements extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'announcements:cleanup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up expired announcements';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Announcement::where('expires_at', '<', Carbon::today())->delete();
        $this->info('Expired announcements deleted.');
        return 0;
    }
}
