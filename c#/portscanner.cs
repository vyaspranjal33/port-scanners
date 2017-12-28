using System;
using System.Collections;
using System.Threading;
using System.Net.Sockets;
namespace MultiThreadedWebApp 
{
/// <summary>
/// this class inherits from the Page class.
/// the portscanner.aspx diverts from this class.
/// </summary>
public class PortScanner : System.Web.UI.Page 
{
private string _ipPorts;
private ArrayList _ports;
/// <summary>
/// The ArrayList of ScanPort objects.
/// </summary>
public ArrayList ScanResults 
{
get { return _ports; }
}
/// <summary>
/// This method is called to parse the string containing the ip and port information.
/// and creates An ArrayList of ScanPort objects.
/// </summary>
/// <param name="ipPorts">the string containing the ip and port information</param>
public void parse(string ipPorts) 
{
string lPort = "";
string lIP = "";
int[] lPorts;
string[] lPortRange;
string[] lIPs = ipPorts.Split('\n');
int ipIdx, portRangeIdx, portIdx;
_ports = new ArrayList();
// each ip/host, ex: www.microsoft.com:10-20,21,25,80,105-115
for ( ipIdx = 0; ipIdx < lIPs.Length; ipIdx ++ ) 
{
string[] ipInfo = lIPs[ipIdx].Split(':');
lIP = ipInfo[0];
lPortRange = ipInfo[1].Split(',');
// each port range, ex: 10-20,21,25,80,105-115
for ( portRangeIdx = 0; portRangeIdx < lPortRange.Length; portRangeIdx ++ ) 
{
// ex: 10-20
if ( lPortRange[portRangeIdx].IndexOf("-") != -1 ) 
{
string[] lBounds = lPortRange[portRangeIdx].Split('-');
int lStart = int.Parse( lBounds[0] );
int lEnd = int.Parse( lBounds[1] );
lPorts = new int[ lEnd - lStart + 1] ;
int lIdx = 0;
for ( portIdx = lStart; portIdx <= lEnd; portIdx ++ )
lPorts[lIdx++] = portIdx;
} 
else // ex: 80
lPorts = new int[] { int.Parse( lPortRange[portRangeIdx] ) };
// create a ScanPort object for each port,
// then add the object to the _ports ArrayList
for ( int lIdx = 0; lIdx < lPorts.Length; lIdx ++ )
_ports.Add( new ScanPort( lIP, lPorts[lIdx] ) );
}
}
}
/// <summary>
/// This method creates, starts and manages the threads
/// </summary>
/// <param name="pIPs">The string containing the ip and port information passed from the portscanner.aspx</param>
/// <returns></returns>
public bool Scan(string pIPs) 
{
try 
{
// parse the string to ips and ports
parse(pIPs);
// create the threads
Thread[] lThreads = new Thread[ _ports.Count ];
int lIdx = 0;
// add the ScanPort objects' scan method to the threads, then run them.
for ( lIdx = 0; lIdx < _ports.Count; lIdx ++ ) 
{
lThreads[lIdx] = new Thread( new ThreadStart( ((ScanPort)_ports[lIdx]).Scan ) );
lThreads[lIdx].Start();
}
// wait for all of them to finish
for ( lIdx = 0; lIdx < lThreads.Length; lIdx ++ )
lThreads[lIdx].Join();
return true;
} 
catch 
{
return false;
}
}
}
/// <summary>
/// This class does the work of connecting to the port.
/// </summary>
public class ScanPort 
{
private string _ip = "";
private int _port = 0;
private TimeSpan _timeSpent;
private string _status = "Not scanned";
public string ip 
{
get { return _ip; }
}
public int port 
{
get { return _port; }
}
public string status 
{
get { return _status; }
}
public TimeSpan timeSpent 
{
get { return _timeSpent; }
}
private ScanPort() {}
public ScanPort(string ip, int port) 
{
_ip = ip;
_port = port;
}
/// <summary>
/// initiate a connection to the port.
/// </summary>
public void Scan() 
{
TcpClient scanningIpPort = new TcpClient();
DateTime lStarted = DateTime.Now;
try 
{
scanningIpPort.Connect( _ip, _port );
scanningIpPort.Close();
_status = "Open";
} 
catch 
{
_status = "Closed";
}
_timeSpent = DateTime.Now.Subtract( lStarted );
}
}
}