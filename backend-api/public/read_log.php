<?php
header('Content-Type: text/plain');
$log = file_get_contents(__DIR__.'/../storage/logs/laravel.log');
$lines = explode("\n", $log);
$last = array_slice($lines, -100);
echo implode("\n", $last);
