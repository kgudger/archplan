<?php
  $debug = false;
  require_once 'Mlib.php';
  header('Content-type: application/json');
  header('Access-Control-Allow-Origin: *');
  $db = new DB();

  /* Removes everything past a space, fixes problem with iOS requests */
//  print_r($_REQUEST);
  if ( is_array($_REQUEST) && count($_REQUEST) ) {
    if ($debug) {
      $my_file = 'alog.txt';
      $handle = fopen($my_file, 'a') or die('Cannot open file:  '.$my_file); //open file for writing
      $data = json_encode($_REQUEST);
      fwrite($handle, $data);
      $data = "\n" . date("D, M d, Y H:i:s") . "\n";
      fwrite($handle, $data);
      fclose($handle);
    }
    end($_REQUEST); 
    $arend =  $_REQUEST[key($_REQUEST)];
    $arend = explode(" ",$arend) ;
    $arend = $arend[0] ;
    $_REQUEST[key($_REQUEST)] = $arend ;
    reset($_REQUEST) ; 
//  echo "<br>Last element is " . $arend . "<br>" ;
//  print_r($_REQUEST);
  }
  
  // get the command
  $command = $_REQUEST['command'];


  // determine which command will be run
  if($command == "getZone") {
	$zone = $_REQUEST['zone'];
	echo $db->getZone($zone);
  }
  else
    echo "command was not recognized";
?>
 
