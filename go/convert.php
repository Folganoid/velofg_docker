<?php

$dbh = new PDO("mysql:host=localhost;dbname=go","fg","56195619", array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));

$sth = $dbh->prepare("SELECT * FROM statdata");
$sth->execute();
$result = $sth->fetchAll();

//var_dump($result);

foreach ($result as $k => $v) {
$sql = "UPDATE statdata SET date=". convertDate($v['date']) ." WHERE id=" . $v['id'];
//$sql = "UPDATE statdata SET time=". convertTime($v['time']) ." WHERE id=" . $v['id'];
$stmt = $dbh->prepare($sql);
$stmt->execute();
}


function convertDate($str) {
if (strlen($str) == 10) return $str;
	$y = substr($str, 0, 4);
	$m = substr($str, 4, 2);
	$d = substr($str, 6, 2);

return mktime(0,0,0, $m, $d, $y);
}

function convertTime($str) {
	$s = substr($str, -2);
	$m = substr($str, -4, 2);

if (strlen($str) == 4) $h = 0;
if (strlen($str) == 5) $h = substr($str, -5, 1);
if (strlen($str) == 6) $h = substr($str, -6, 2);

return $h*60*60 + $m*60 + $s;
}