<!DOCTYPE html>
                <html>
                    <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                        <style>
                            #field
                            {
                             margin:10px 250px;
                             box-shadow:10px 10px 5px #888888;
                             opacity:0.9;
                             position:absolute;
                             background:#FFFFCC;
                             border:8px solid #ffcc00;
                             padding:8px 5px;
                             border-radius:10px 10 10 10px;
                             border-style:outset;
                            }
                        </style>
 
        <title>Port Scan Completed..</title>
                    </head>
                    <body>
                        <center>
                        <h1>SCAN RESULT....</h1>
                        <br>
                        <br>
                        <br>
                        <input type="button" value="Go_back" onclick="history.go(-1)">
                        <fieldset id="field">
                            <legend style="color:red;">
                                <b> Port Scan Details : </b>
                            </legend>
                        <?php
                        // Main Script begins here
                        error_reporting(~E_ALL);
 
        //ip port range and ip
                        $host=$_POST['ip'];
                        $from = $_POST['from']; //48 connections supported for now, change php.ini default_socket_timeout for more
                        $to = $_POST['to'];
                        //validation
                        if (empty($_POST["ip"]) || empty($_POST['from']) || empty($_POST['to']))
                        {
                         echo"<b> Incomplete data, Go back! </b>";
                        }
                        elseif (!(filter_var($host, FILTER_VALIDATE_IP,FILTER_FLAG_IPV4)))
                        {
                          echo "<b>This IP address is not valid ! </b>";
                        }
                        elseif (!(is_numeric($from)) || !(is_numeric($to)))
                        {
                            echo "<b>Entered data is not a Port numeber</b>";
                        }
                        elseif ($from > $to || $from==$to)
                        {
                            echo "<b>Please enter lower value in the <i>FROM</i> field !</b>";
                        }
                        else
                        {
                            echo "<br><b><u>Scanned IP/Host : $host </u><br><u><i>List of Open Ports:</i></u></b><br>";
 
            //Creating Socket
                            $socket = socket_create(AF_INET , SOCK_STREAM , SOL_TCP);
                            for($port = $from; $port <= $to ; $port++)
                            {
                                //connect to the host and port
                                $connection = socket_connect($socket , $host ,  $port);
                                if($connection)
                                {
                                    //display port open warning on connect
                                    echo "port $port Open (Warning !) <img src='warning.png' height=30px width=30px alt='open port'> ".'<br>';
                                    //close the socket connection
                                    socket_close($socket);
                                    //Create a new since earlier socket was closed , we need to close and recreate only when a connection is made
                                    //otherwise we can use the same socket
                                    $socket = socket_create(AF_INET , SOCK_STREAM , SOL_TCP);
                                }
                                else
                                {
                                }
                            }
                        }
 
        ?>
                            </fieldset>
                        </center>
 
                     </body>
                </html>