<?php

//error_reporting(E_ALL | E_STRICT);

class DB
{
    private $db;
	function __construct()
	{
    		$db = $this->connect();
	}

	function connect()
	{
	    if ($this->db == 0)
	    {
	        require_once("dbconvars.php");
		try {
	        /* Establish database connection */
	        	$this->db = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpwd);
			$this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		} catch (Exception $e) {
			echo "Unable to connect: " . $e->getMessage() ."<p>";
			die();
		}


	    }
	    return $this->db ;
	}

	function getZone($muni, $zone) 
	{
	  $output = array();
	  if ( ( $zone != "" ) && ( $muni != "" ) ) {
		$sql = "SELECT * 
			FROM zones 
			WHERE `zone` = :zoney AND 
			      `muni` = :muny" ;
		$stmt = $this->db->prepare($sql);
		$stmt->execute([':zoney' => $zone, ':muny' => $muni]);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
//		$output[] = $row[0] / 50 ;
//		echo ($row["SUM(number)"]) ;
		$output['zone'] = $zone;
		$output['name'] = $row["name"];
		$output['pstories'] = $row["pstories"];
		$output['pheight'] = $row["pheight"];
		$output['astories'] = $row["astories"];
		$output['aheight'] = $row["aheight"];
		$output['sstories'] = $row["sstories"];
		$output['sheight'] = $row["sheight"];
		$output['minarea'] = $row["minarea"];
		$output['minwidth'] = $row["minwidth"];
		$output['sfront'] = $row["sfront"];
		$output['srear'] = $row["srear"];
		$output['s1side'] = $row["s1side"];
		$output['s2side'] = $row["s2side"];
		$output['interior'] = $row["interior"];
		$output['exterior'] = $row["exterior"];
		$output['maxbuild'] = $row["maxbuild"];
	
	  echo json_encode($output) ;
    }
   }
}
