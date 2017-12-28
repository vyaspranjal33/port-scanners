//
//                                  This code is under GPL license
//                             See :http://www.gnu.org/copyleft/gpl.html
//
//                           (c) 2009 Nestor Garcia , at hipernes@users.sourceforge.net
//



var req_arr = new Array();
var tout_arr = new Array();
var user = new Array();
var pass = new Array();
var req_pend = 0;
var acumtime = 0;
var meantime = 0;
var tot_req = 0;
var starttime  = new Time();
var finishtime  = new Time();
var time_prev=0;
var stat_arr = new Array();
var cron_to=0;
var timeelap =0;
               
// common user and passwords to probe, from http://www.phenoelit-us.org/dpl/dpl.html . Add in here the yours!

user=["admin","","adm","administrator","root","operator","user","anonymous"];

pass=["qwerty","admin","1234","123456","12345678","default","0000","root","","none","password","PASSWORD","Password","secret","access","system","pass","motorola","smcadmin","D-Link","Cisco"];



var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};

function cron( ){
   stat_arr.push(req_pend);
   document.getElementById('line7').innerHTML = "<br>Time elapsed " + timeelap++ + " secs.";
   cron_to = setTimeout("cron();",1000 );
}

function init(){
   BrowserDetect.init();
   document.getElementById('cancel').disabled = true;
   document.getElementById('stats').disabled = true;

      
   if(document.location.search.indexOf("pinghost")!=-1) pinghost();
   if(document.location.search.indexOf("scanusers")!=-1) scanusers(); 
   if(BrowserDetect.browser!="Explorer") alert("Only works fine on MSIE. In others browsers the xmlhttprequest object don't have the same behavior.");
}


function scanhosts(){

   resetdata();
   
   //  values for scan ----------------------------------------------

   var x = document.createElement("form");
   x.id="f";
   document.getElementById("line0").appendChild(x);
  
   var y = document.createElement("input");
   y.type="text";
   y.id="hini";
   y.value=location.host;
   y.size=15;
   x.innerHTML="From host: ";
   x.appendChild(y);
   
   y = document.createElement("input");
   y.type="text";
   y.id="hend";
   y.value=location.host;
   y.size=15;
   x.innerHTML=x.innerHTML+"to host: ";
   x.appendChild(y);
   
   y = document.createElement("input");
   y.type="text";
   y.id="port";
   y.value=80;
   y.size=5;
   x.innerHTML=x.innerHTML+"at port: ";
   x.appendChild(y);
 
   y = document.createElement("input");
   y.type="text";
   y.id="user";
   y.value="admin";
   y.size=15;
   x.innerHTML=x.innerHTML+" auth user: ";
   x.appendChild(y);

   y = document.createElement("input");
   y.type="text";
   y.id="password";
   y.value="";
   y.size=10;
   x.innerHTML=x.innerHTML+" password: ";
   x.appendChild(y);
  
   y = document.createElement("input");
   y.type="hidden";
   y.id="method";
   y.value="GET";
   x.appendChild(y);

   y = document.createElement("input");
   y.type="button";
   y.value="scan!";
   y.onclick=function (){ initscanhosts(document.getElementById("f")); };
   x.appendChild(y);
   
   y = document.createElement("input");
   y.type="text";
   y.id="words";
   y.value=""
   y.size=30;
   document.getElementById("line3").innerHTML="Seek regexp ( separated by commas): ";
   document.getElementById("line3").appendChild(y);   
 
  
   // port for scan ( for more see http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers ) -----------------------
 
   x = document.createElement("form");
   x.id="p";
   document.getElementById("line1").appendChild(x);
   x.innerHTML="Known ports: ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=80";
   y.defaultChecked=true;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Http";
   
   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=139";
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"nbt";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=443";
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"https";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=631";
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"ipp";


   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=901";
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"swat";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=1214";
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"kazaa";


   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=3306";
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"mysql";
   
   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=5800";
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+"vnc";
    
   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=8080";
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+"proxy";
    
   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=4662";
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+"emule";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=6001";
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"x11";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=26214";
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"slsk";

   // known networks from http://network-tools.com/ ----------------------------------------------------

   x = document.createElement("form");
   x.id="n";
   document.getElementById("networks").appendChild(x);
   x.innerHTML="Known networks: ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.hini.value='72.14.192.0';javascript:f.hend.value='72.14.255.255'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Google ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.hini.value='68.180.128.0';javascript:f.hend.value='68.180.255.255'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Yahoo ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.hini.value='207.200.64.0';javascript:f.hend.value='207.200.127.255'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Aol ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.hini.value='208.70.188.0';javascript:f.hend.value='208.70.191.255'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Terra ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.hini.value='207.68.128.0';javascript:f.hend.value='207.68.207.255'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"MSN ";


   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.hini.value='66.135.192.0';javascript:f.hend.value='66.135.223.255'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Ebay ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.hini.value='207.46.0.0';javascript:f.hend.value='207.46.255.255'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Microsoft ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.hini.value='72.21.192.0';javascript:f.hend.value='72.21.223.255'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Amazon ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.hini.value='209.202.192.0';javascript:f.hend.value='209.202.255.255'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Lycos ";


   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.hini.value='195.53.169.0';javascript:f.hend.value='195.53.169.255'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Telefonica ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.hini.value='217.167.28.0';javascript:f.hend.value='217.167.31.255'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Orange ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.hini.value='195.232.128.0';javascript:f.hend.value='195.233.255.255'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Vodafone ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.hini.value='62.42.230.0';javascript:f.hend.value='62.42.232.255'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Ono ";

   //options -------------------------------------------------------
 
   x = document.createElement("form");
   x.id="o";
   document.getElementById("line2").appendChild(x);
   x.innerHTML="Scan timing: ";

   y = document.createElement("input");
   y.type="radio";
   y.id="fixedtype";
   y.defaultChecked=true;
   y.onfocus="document.getElementById('fixedtype').checked=true;document.getElementById('randomtype').checked=false";
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+"Fixed";


   y = document.createElement("input");
   y.type="text";
   y.id="timeinterval";
   y.onfocus="document.getElementById('fixedtype').checked=true;document.getElementById('randomtype').checked=false";
   y.value="3"
   y.size=2;
   x.innerHTML =  x.innerHTML+" with time interval (secs):"  ;
   x.appendChild(y); 

   y = document.createElement("input");
   y.type="radio";
   y.id="randomtype";
   y.onfocus="document.getElementById('randomtype').checked=true;document.getElementById('fixedtype').checked=false";
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+" Random";

  
   y = document.createElement("input");
   y.type="text";
   y.id="timewindow";
   y.onfocus="document.getElementById('randomtype').checked=true;document.getElementById('fixedtype').checked=false";
   y.value="500"
   y.size=4;
   x.innerHTML =  x.innerHTML+" with time window (secs):"  ;
   x.appendChild(y); 

   x.innerHTML +=" View options: ";

   y = document.createElement("input");
   y.type="checkbox";
   y.id="hidefails";
   y.onclick="options()";
   y.defaultChecked=true;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"hide fails ";

   y = document.createElement("input");
   y.type="checkbox";
   y.id="hidetimeouts";
   y.onclick="options()";  
   y.defaultChecked=true;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"hide timeouts ";
 
   y = document.createElement("input");
   y.type="checkbox";
   y.id="sort";
   y.onclick="options()";
   y.defaultChecked=true;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"sorted scan ";
 
   y = document.createElement("input");
   y.type="checkbox";
   y.id="graph";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"graphics";


 
   x = document.getElementById("line3");
   x.innerHTML +=" Seek options: ";

   y = document.createElement("input");
   y.type="checkbox";
   y.id="global";
   y.defaultChecked=true;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"global";

   y = document.createElement("input");
   y.type="checkbox";
   y.id="caseins";  
   y.defaultChecked=true;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"ignore case";
  
}

function scanports(){
   
   resetdata();

   //  values for scan ----------------------------------------------
   
   var x = document.createElement("form");
   x.id="f";
   document.getElementById("line0").appendChild(x);
 
   var y = document.createElement("input");
   y.type="text";
   y.id="pini";
   y.value="75";
   y.size=5;
   x.innerHTML="From port: ";
   x.appendChild(y);
   
   y = document.createElement("input");
   y.type="text";
   y.id="pend";
   y.value="85";
   y.size=5;
   x.innerHTML=x.innerHTML+" to port: ";
   x.appendChild(y);
   
   y = document.createElement("input");
   y.type="text";
   y.id="host";
   y.value=window.location.host;
   y.size=15;
   x.innerHTML=x.innerHTML+"at host: ";
   x.appendChild(y);
   
   y = document.createElement("input");
   y.type="button";
   y.value="scan!";
   y.onclick=function (){ initscanports(document.getElementById("f")); } ;
   x.appendChild(y);
   
   y = document.createElement("input");
   y.type="hidden";
   y.id="method";
   y.value="GET";
   x.appendChild(y);
 
 
   // known networks from http://network-tools.com/ ----------------------------------------------------

   x = document.createElement("form");
   x.id="n";
   document.getElementById("networks").appendChild(x);
   x.innerHTML="Known networks: ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.host.value='72.14.207.99'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Google ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.host.value='68.180.206.184'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Yahoo ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.host.value='64.12.193.85'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Aol ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.host.value='208.70.188.151'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Terra ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.host.value='207.68.172.246'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"MSN ";


   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.host.value='66.211.160.87'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Ebay ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.host.value='207.46.232.182'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Microsoft ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.host.value='72.21.210.11'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Amazon ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.host.value='209.202.230.30'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Lycos ";


 
   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.host.value='195.53.169.57'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Telefonica ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.host.value='217.167.29.246'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Orange ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.host.value='195.232.194.11'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Vodafone ";


   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(n,this)";
   y.onclick="javascript:f.host.value='62.42.230.18'";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Ono ";   
   
    //options -------------------------------------------------------
 
   x = document.createElement("form");
   x.id="o";
   document.getElementById("line2").appendChild(x);
   x.innerHTML="Scan timing: ";

   y = document.createElement("input");
   y.type="radio";
   y.id="fixedtype";
   y.defaultChecked=true;
   y.onfocus="document.getElementById('fixedtype').checked=true;document.getElementById('randomtype').checked=false";
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+"Fixed";

   y = document.createElement("input");
   y.type="text";
   y.id="timeinterval";
   y.onfocus="document.getElementById('fixedtype').checked=true;document.getElementById('randomtype').checked=false";
   y.value="3"
   y.size=2;
   x.innerHTML =  x.innerHTML+" with time interval (secs):"  ;
   x.appendChild(y); 

   y = document.createElement("input");
   y.type="radio";
   y.id="randomtype";
   y.onfocus="document.getElementById('randomtype').checked=true;document.getElementById('fixedtype').checked=false";   
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+" Random";

  
   y = document.createElement("input");
   y.type="text";
   y.id="timewindow";
   y.onfocus="document.getElementById('randomtype').checked=true;document.getElementById('fixedtype').checked=false";   
   y.value="500"
   y.size=4;
   x.innerHTML =  x.innerHTML+" with time window (secs):"  ;
   x.appendChild(y); 
 
   x.innerHTML +=" Options: ";
    
   y = document.createElement("input");
   y.type="checkbox";
   y.id="hidefails";
   y.onclick="options()";
   y.defaultChecked=true;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"hide fails";

   y = document.createElement("input");
   y.type="checkbox";
   y.id="hidetimeouts";
   y.onclick="options()";  
   y.defaultChecked=true;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"hide timeouts";
 
   y = document.createElement("input");
   y.type="checkbox";
   y.id="sort";
   y.onclick="options()";
   y.defaultChecked=true;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"sorted scan ";
  
   y = document.createElement("input");
   y.type="checkbox";
   y.id="graph";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"graphics";

 
   
}


function scanusers(){

   resetdata();
      
// var for scan users --------------------------------------------- 

   var x = document.createElement("form");
   x.id="f";
   document.getElementById("line0").appendChild(x);
   
   var y = document.createElement("input");
   y.type="text";
   y.id="host";
   y.value=window.location.host;
   y.size=15;
   x.innerHTML="Host: ";
   x.appendChild(y);
   
   y = document.createElement("input");
   y.type="text";
   y.id="port";
   y.value=80;
   y.size=5;
   x.innerHTML=x.innerHTML+" port: ";
   x.appendChild(y);
   
   y = document.createElement("input");
   y.type="text";
   y.id="file";
   y.value="/";
   y.size=15;
   x.innerHTML=x.innerHTML+" file: ";
   x.appendChild(y);
  
  
   y = document.createElement("input");
   y.type="hidden";
   y.id="method";
   y.value="GET";
   x.appendChild(y);
    
   y = document.createElement("input");
   y.type="button";
   y.value="scan users";
   y.onclick=function (){initscanusers(document.getElementById("f"));};
   x.appendChild(y);  

      //options -------------------------------------------------------
 
   x = document.createElement("form");
   x.id="o";
   document.getElementById("line2").appendChild(x);
   x.innerHTML="Scan type: ";

   y = document.createElement("input");
   y.type="radio";
   y.id="fixedtype";
   y.defaultChecked=true;
   y.onfocus="document.getElementById('fixedtype').checked=true;document.getElementById('randomtype').checked=false";
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+"Fixed";

   y = document.createElement("input");
   y.type="text";
   y.id="timeinterval";
   y.onfocus="document.getElementById('fixedtype').checked=true;document.getElementById('randomtype').checked=false";
   y.value="1"
   y.size=2;
   x.innerHTML =  x.innerHTML+" with time interval (secs):"  ;
   x.appendChild(y); 

   y = document.createElement("input");
   y.type="radio";
   y.id="randomtype";
   y.onfocus="document.getElementById('randomtype').checked=true;document.getElementById('fixedtype').checked=false";   
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+" Random";

  
   y = document.createElement("input");
   y.type="text";
   y.id="timewindow";
   y.onfocus="document.getElementById('randomtype').checked=true;document.getElementById('fixedtype').checked=false";   
   y.value="500"
   y.size=4;
   x.innerHTML =  x.innerHTML+" with time window (secs):"  ;
   x.appendChild(y); 
 
   x.innerHTML +=" Options: ";
    
   y = document.createElement("input");
   y.type="checkbox";
   y.id="hidefails";
   y.onclick="options()";
   y.defaultChecked=true;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"hide fails";

   y = document.createElement("input");
   y.type="checkbox";
   y.id="hidetimeouts";
   y.onclick="options()";  
   y.defaultChecked=true;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"hide timeouts";
   
   y = document.createElement("input");
   y.type="checkbox";
   y.id="sort";
   y.onclick="options()";
   y.defaultChecked=true;
   y.disabled = true;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"sorted scan ";
   y = document.createElement("input");
   y.type="checkbox";
   y.id="graph";
   y.defaultChecked=false;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"graphics";


 
   //  params in the location bar ---------------
  
   var params = document.location.search.split('&');
   var par;
   var i=1;
   if(document.location.search.indexOf("scanusers")!=-1) {
      par = params[1].split('=');
      f.host.value=par[1];
      par = params[2].split('=');
      f.port.value=par[1];
      
        
   }

}


function pinghost(){

   resetdata();
   
// var for ping --------------------------------------------- 

   var x = document.createElement("form");
   x.id="f";
   document.getElementById("line0").appendChild(x);
   
   var y = document.createElement("input");
   y.type="text";
   y.id="host";
   y.value=window.location.host;
   y.size=15;
   x.innerHTML="Host: ";
   x.appendChild(y);
   
   y = document.createElement("input");
   y.type="text";
   y.id="port";
   y.value=80;
   y.size=5;
   x.innerHTML=x.innerHTML+" port: ";
   x.appendChild(y);
   
   y = document.createElement("input");
   y.type="text";
   y.id="file";
   y.value="/";
   y.size=15;
   x.innerHTML=x.innerHTML+" file: ";
   x.appendChild(y);

   y = document.createElement("input");
   y.type="text";
   y.id="user";
   y.value="admin";
   y.size=15;
   x.innerHTML=x.innerHTML+" auth user: ";
   x.appendChild(y);

   y = document.createElement("input");
   y.type="text";
   y.id="password";
   y.value="";
   y.size=10;
   x.innerHTML=x.innerHTML+" password: ";
   x.appendChild(y);

 
   y = document.createElement("input");
   y.type="hidden";
   y.id="method";
   y.value="GET";
   x.appendChild(y);
    
   y = document.createElement("textarea");
   y.id="content_send";
   y.rows=2;
   y.cols=50;
   document.getElementById("line3").innerHTML="Content (POST and PUT):";
   document.getElementById("line3").appendChild(y);   
  
  
   y = document.createElement("input");
   y.type="button";
   y.value="ping!";
   y.onclick=function (){ping(document.getElementById("f"));};
   x.appendChild(y);  

   y = document.createElement("input");
   y.type="button";
   y.value="open";
   y.onclick=function (){window.open('http://'+f.host.value+':'+f.port.value);};
   x.appendChild(y);  


 // port for scan -----------------------------
 
   x = document.createElement("form");
   x.id="p";
   document.getElementById("line1").appendChild(x);
   x.innerHTML="Known ports: ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=80";
   y.defaultChecked=true;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"Http";
   
   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=139";
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"nbt";

    y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=443";
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"https";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=631";
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"ipp";


   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=901";
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"swat";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=1214";
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"kazaa";


   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=3306";
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"mysql";
   
   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=5800";
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+"vnc";
    
   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=8080";
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+"proxy";
    
   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=4662";
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+"emule";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=6001";
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"x11";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(p,this)";
   y.onclick="javascript:f.port.value=26214";
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"slsk";


   
 
// method -------------------------------------------------
 
   x = document.createElement("form");
   x.id="m";
   document.getElementById("line2").appendChild(x);
   x.innerHTML="Http method: ";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(m,this)";
   y.onclick="javascript:f.method.value='GET'";
   y.defaultChecked=true;
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+"GET";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(m,this)";
   y.onclick="javascript:f.method.value='POST'";
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+"POST";

   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(m,this)";
   y.onclick="javascript:f.method.value='PUT'";
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+"PUT";
   
   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(m,this)";
   y.onclick="javascript:f.method.value='HEAD'";
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+"HEAD";
   
   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(m,this)";
   y.onclick="javascript:f.method.value='OPTIONS'";
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+"OPTIONS";
   
   y = document.createElement("input");
   y.type="radio";
   y.onfocus="check(m,this)";
   y.onclick="javascript:f.method.value='DELETE'";
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+"DELETE";


  //  params in the location bar ---------------
  
   var params = document.location.search.split('&');
   var par;
   var i=1;
   if(document.location.search.indexOf("pinghost")!=-1) {
      par = params[1].split('=');
      f.host.value=par[1];
      par = params[2].split('=');
      f.port.value=par[1];
      
        
   }

}



//------------------------------------    scans  --------------------------------------------------------------

function initscanhosts(f){
   var i,j,k;
   var req;
   var cur_req=0;
   var words = document.getElementById("words").value;

   var matchIP = f.hini.value.match(/^\d+.\d+.\d+.\d+$/);

   if (!matchIP) {
      alert("ip address not valid. only numeric doted values allowed.");
      return;
   }
   matchIP = f.hend.value.match(/^\d+.\d+.\d+.\d+$/);
   if (!matchIP) {
      alert("ip address not valid. only numeric doted values allowed.");
      return;
   }
   matchIP = f.port.value.match(/^\d+$/);
   if (!matchIP) {
      alert(" a numeric valid port is needed.(0-65535)");
      return;
   }
   i=iptonum(f.hini.value);
   j=iptonum(f.hend.value);
   if(i>j){
      alert("source greater than destiny");
      return;
   }


   resetresult(document.getElementById("line4"));   
   resetresult(document.getElementById("line5"));
   resetresult(document.getElementById("line6"));
   resetresult(document.getElementById("line7"));
   
   document.getElementById('cancel').disabled = false;
   document.getElementById('stats').disabled = true;
 

   window.status="scanning...";
   starttime = new Time();
   finishtime = new Time();
   time_prev = 0;
   acumtime=0;
   stat_arr = new Array();
   timeelap=0;
   cron();
   
  
   for(k=i;k<=j;k++){
      cur_req++;
      document.getElementById( 'line4' ).innerHTML =  "wait please...";
      req = new scanrequest( "h",f.method.value,  numtoip(k), f.port.value, "" ,f.user.value, f.password.value, cur_req , words);
      appendline( req.getid() );
      req_arr.push(req);
   }
   document.getElementById('line4').innerHTML = " launching " + req_arr.length +" requests ";
   launchrequests();
   document.getElementById('line4').innerHTML = " done. ";

   window.status="done!";
}



function initscanports(f){
   var cur_req = 0;
   var j = new Number(f.pend.value);
   var k = new Number(f.pini.value);
   var req;

   var matchport = f.pini.value.match(/^\d+$/);
   if (!matchport) {
      alert("port not valid");
      return;
   }
   matchport = f.pend.value.match(/^\d+$/);
   if (!matchport) {
      alert("port not valid");
      return;
   }
   if ( f.host.value.length ==0 ) {
      alert("host name or ip address not valid.");
      return;
   }
  
   resetresult(document.getElementById("line4"));   
   resetresult(document.getElementById("line5"));
   resetresult(document.getElementById("line6"));
   resetresult(document.getElementById("line7"));
   
   document.getElementById('cancel').disabled = false;
   document.getElementById('stats').disabled = true;

   
   window.status="scanning...";
   starttime = new Time();
   finishtime = new Time();
   time_prev = 0;
   acumtime=0;
   stat_arr = new Array();
   timeelap=0;
   cron();
   
   for(i=k;i <= j;i++){
      cur_req++;
      document.getElementById( 'line4' ).innerHTML =  "wait please...";
      req = new scanrequest( "p",f.method.value, f.host.value,i,"/", "" , "" , cur_req ,"");
      appendline( req.getid() );
      req_arr.push(req); 
   }
   document.getElementById('line4').innerHTML = " launching " + req_arr.length +" requests ";
   launchrequests();
   document.getElementById('line4').innerHTML = " done. ";
   window.status="done!";

}

function initscanusers(f){
   var i,j,k;
   var req;
   var cur_req=0;

   resetresult(document.getElementById("line4"));   
   resetresult(document.getElementById("line5"));
   resetresult(document.getElementById("line6"));
   
   document.getElementById('cancel').disabled = false;
   document.getElementById('stats').disabled = true;

   window.status="scanning...";
   starttime = new Time();
   finishtime = new Time();
   time_prev = 0;
   acumtime=0;
  
   for(i=0;i<user.length;i++){
      for(j=0;j<pass.length;j++){
         cur_req++;
         document.getElementById( 'line4' ).innerHTML =  "wait please...";
         req = new scanrequest("u", f.method.value, f.host.value,f.port.value,f.file.value, user[i] , pass[j], cur_req ,user[i]+"/"+ pass[j]);
         appendline( req.getid() );
         document.getElementById( req.getid() ).innerHTML = "Trying: " + user[i]+"/"+ pass[j]; 
         req_arr.push(req); 
     }
   }

   document.getElementById('line4').innerHTML = " launching " + req_arr.length +" requests ";
   launchrequests();
   document.getElementById('line4').innerHTML = " done. ";
   window.status="done!";
}


function scanrequest(type,method, host, port, file, user, password, req , words){
   var cur_req = req;
   var m = method;
   var h = host;
   var p = port;
   var f = file;
   var u = user;
   var x = password;
   var w = words;
   var initimepoint;
   var endtimepoint;
   var xhr = getXmlHttpRequestObject();
   var id = String(Math.floor(Math.random()*10000000000));
   this.getstatus = function () { return status };
   this.getid = function() {  return id   };
   this.getip = function() { return  h };
   this.getport = function() { return p };
   this.abort = function() { xhr.abort(); };

   this.dorequest = function(){
      try{
         xhr.open( m ,"http://" + h + ":" + p + f, true, user, password);
         xhr.onreadystatechange = function(){
            if(xhr.readyState==0) ; //document.getElementById('line4').innerHTML = "uninitiated "+ id ;
            if(xhr.readyState==1) { //document.getElementById('line4').innerHTML = "loading "+ id ;
               req_pend++; 
               initimepoint= new Time(); 
               document.getElementById( id ).innerHTML = initimepoint.gettime();
               document.getElementById('line5').innerHTML =  showinfo(cur_req);
            } ; 
            if(xhr.readyState==2) ;  //document.getElementById('line4').innerHTML = "loaded "+ id ;
            if(xhr.readyState==3) ; //document.getElementById('line4').innerHTML = "interactive "+ id ;
            if(xhr.readyState==4){  //document.getElementById('line4').innerHTML = "completed "+ id ;
               document.getElementById('line4').innerHTML = "" ;
               endtimepoint = new Time();
         	   req_pend--;

               ended = endtimepoint.getseconds() - initimepoint.getseconds();
               var cad = "";
               var scantime = ended;
               acumtime += ended;

               for(var v=0;v<25;v++){
                  if( scantime >0)  cad += "#";
                  else              cad += "~";
                  scantime--;	   
               }
               if(document.getElementById( "graph" ).checked==true ) document.getElementById( id ).innerHTML = cad +" Request ";             
               else   document.getElementById( id ).innerHTML =  endtimepoint.gettime() +" Request ";             
               document.getElementById( id ).innerHTML+= " on "+ h + " at port " + p + " returns "+xhr.status+ " in " + ended + " secs";
               document.getElementById( id ).innerHTML+= " : "+ codes(xhr.status);
 		   
               // seek regexp in response headers------------------
               if((type=="h")&&(w!=null)){
                  if(w.length>0){
                     var tokens = w.split(',');
                     for(var i=0; i<tokens.length; i++){
                        var optregexp =  "";
                        if( document.getElementById("global").checked == true )  optregexp+="g";
                        if( document.getElementById("caseins").checked == true ) optregexp+="i";
                        var regexp = new RegExp( tokens[i] , optregexp);
         
                        if(xhr.status <= 505){// response from server
                           var headers = xhr.getAllResponseHeaders();
                           if( headers.match( regexp )!=null){
                              document.getElementById( id ).innerHTML+= " <b>FOUND!</b> "+ tokens[i] +" in headers ";
                           }else{
                              // document.getElementById( id ).innerHTML+= " " + tokens[i];
                           }
                        }else{ // fail, timeout...  
                           //document.getElementById( id ).innerHTML+= " no seek. ";
                        }
                     }
                  }  
               }
               // seek regexp in response content------------------
               if((type=="h")&&(w!=null)){
                  if(w.length>0){
                     var tokens = w.split(',');
                     for(var i=0; i<tokens.length; i++){
                        var optregexp =  "";
                        if( document.getElementById("global").checked == true )  optregexp+="g";
                        if( document.getElementById("caseins").checked == true ) optregexp+="i";
                        var regexp = new RegExp( tokens[i] , optregexp);
         
                        if(xhr.status <= 505){// response from server
                           if(xhr.responseText.match( regexp )!=null){
                              document.getElementById( id ).innerHTML+= " <b>FOUND!</b> "+ tokens[i] +" in content ";
                           }else{
                              //document.getElementById( id ).innerHTML+= " not found " + tokens[i];
                           }
                        }else{ // fail, timeout...  
                           //document.getElementById( id ).innerHTML+= " no seek. ";
                        }
                     }
                  }  
               }
               // status ----------------------------------
               switch(xhr.status){
                  case 12029: // failed
                     document.getElementById( id ).style.color ="brown";
                     if(ended <  20) document.getElementById( id ).innerHTML+= " Maybe do you want <input type=button onclick=window.open('"+window.location+"?action=pinghost&host="+h+"&port="+p+"') value='ping?'> ";
                    
                     document.getElementById( id ).id="failed";
                     ended = "finished";
                     break;
                  case 12002: //timeout 
                     document.getElementById( id ).style.color ="blue";
                     document.getElementById( id ).id ="timeout";
                     ended = "retry";
                     break;
                  case 401: // auth 
                     document.getElementById( id ).style.color ="red";
                     if(type=="h"){
                        document.getElementById( id ).innerHTML+= " <input type=button onclick=window.open('"+window.location+"?action=scanusers&host="+h+"&port="+p+"') value='scan users'> ";
                        document.getElementById( id ).innerHTML+= " <input type=button onclick=window.open('"+window.location+"?action=pinghost&host="+h+"&port="+p+"') value='ping!'> ";
                     }else{
                        document.getElementById( id ).innerHTML+= " <input type=button onclick=window.open('"+"?action=pinghost&host="+h+"&port="+p+"') value='ping!'> ";
                     }
                     document.getElementById( id ).innerHTML+= " <input type=button onclick=window.open('http://"+h+":"+p+"') value='open'> ";
                     document.getElementById( id ).id ="auth";
                     ended = "finished";
                     break;
                  case 200: // success 
                     document.getElementById( id ).style.color ="green";
                     document.getElementById( id ).innerHTML+= "<input type=button onclick=window.open('"+window.location+"?action=pinghost&host="+h+"&port="+p+"') value='ping!'> ";
                     document.getElementById( id ).innerHTML+= "<input type=button onclick=window.open('http://"+h+":"+p+"') value='open'> ";
                     if(type=="u") document.getElementById( id ).innerHTML += "Success with "+w ;
                     document.getElementById( id ).id ="success";
                     ended = "finished";
                     break;
                  default:
                     document.getElementById( id ).style.color ="black";
                     document.getElementById( id ).id ="default";
                     ended = "finished";
               }

               document.getElementById('line5').innerHTML = showinfo(cur_req);
               document.getElementById('line5').style.color = "blue";
                         
               options();
               
               if( req_pend == 0 && req_arr.length==0 ){
                  finishtime = new Time();
                  clearTimeout( cron_to);
                  document.getElementById('stats').disabled = false;
                  alert( showstats() );
               }
            }      
         };
         xhr.send(null);
         
      }catch(error){
         printerror(error);
      }
   }
}


function launchrequests(){
   tw = Number(document.getElementById('timewindow').value);
   ti = Number(document.getElementById('timeinterval').value);

   if( isNaN(tw) ) tw = 500;
   if( isNaN(ti) ) ti = 3;

   options();
   tot_req = req_arr.length;

   if( document.getElementById('fixedtype').checked == true ){ 
      time_prev = ti * tot_req;
      for( k=0 ; k< req_arr.length ; k++){
         tout_arr[k] = setTimeout("if(req_arr.length > 0) req_arr.shift().dorequest();", 1000 * ti * k);
      }
   }else{
      time_prev = tw;
      for( k=0 ; k< req_arr.length ; k++){
         tout_arr[k] = setTimeout("if(req_arr.length > 0) req_arr.shift().dorequest();", Math.floor(Math.random() * 1000 * tw));
      }
   }
   document.getElementById('line5').innerHTML =  showinfo(0);

   
}



//------------------------------------    ping host  --------------------------------------------------------------

function ping(form){
   var h = form.host.value;
   var p = form.port.value;
   var f = form.file.value;  
   var m = form.method.value;
   var u = form.user.value;
   var x = form.password.value;
   var c = document.getElementById("content_send").value;
   
   var req = new pingrequest(h,p,f,m,u,x,c);

   resetresult(document.getElementById("line4"));   
   resetresult(document.getElementById("line5"));
   resetresult(document.getElementById("line6"));
   
   document.getElementById('cancel').disabled = true;
   document.getElementById('stats').disabled = true;

   appendresult();
   window.status="pinging...";
   req.dorequest( );
   window.status="done!"
 
   return;
}


function pingrequest( host, port, file, method,user, password, content){
   this.h = host;
   this.p = port;
   this.f = file;
   this.m = method;
   this.u = user;
   this.x = password;
   this.c = content;
   
   var xhr = getXmlHttpRequestObject();
  
   id = String(Math.floor(Math.random()*100000000));
   this.getid = function() {  return id   };
   this.dorequest = function(){
      try{
         xhr.open( this.m,"http://" + this.h + ":" + this.p + this.f, true, this.u, this.x);  
         xhr.onreadystatechange = function(){
            if(xhr.readyState==0)  document.getElementById('line4').innerHTML = "uninitiated "+ id ;
            if(xhr.readyState==1)  {document.getElementById( 'line4' ).style.color ="black";document.getElementById('line4').innerHTML = "loading "+ id ;}
            if(xhr.readyState==2)  document.getElementById('line4').innerHTML = "loaded "+ id ;
            if(xhr.readyState==3)  document.getElementById('line4').innerHTML = "interactive "+ id ;
            if(xhr.readyState==4){ 
                document.getElementById('line4').innerHTML = "request completed with status " +xhr.status +" : "+codes(xhr.status); 
                switch(xhr.status){
                  case 12029: // failed
                     document.getElementById('line4').style.color ="brown";
                     break;
                  case 12002: //timeout 
                     document.getElementById( 'line4' ).style.color ="blue";
                     break;
                  case 401: // auth 
                     document.getElementById( 'line4' ).style.color ="red";
                     break;
                  case 200: // success 
                     document.getElementById( 'line4').style.color ="green";
                     break;
                  default:
                     document.getElementById( 'line4' ).style.color ="black";
               }
               document.getElementById('headers').value = xhr.getAllResponseHeaders();
               document.getElementById('content_recv').value = xhr.responseText;
               
            }
                  
         }; 
         if((this.m =="POST")||(this.m=="PUT")) xhr.send(this.c);
         else xhr.send(null);
         

      }catch(error){
         printerror(error);
      }
      //
   }
}

   

//----------------------- others functions ------------------------------------------

function cancelscan(){
   document.getElementById('line4').innerHTML = "wait...cancelling pending requests." ;
   while( req_arr.length > 0 )  req_arr.pop().abort();
   while( tout_arr.length > 0 )  clearTimeout( tout_arr.pop() );
   clearTimeout( cron_to);
   document.getElementById('line4').innerHTML = 'cancelled.';
   document.getElementById('line5').innerHTML =  showinfo(0);
   document.getElementById('line7').innerHTML =  "";

   document.getElementById('cancel').disabled = true;
   document.getElementById('stats').disabled = false;
}


function resetdata(){
   while( req_arr.length > 0 )  req_arr.pop().abort();
   while( tout_arr.length > 0 )  clearTimeout( tout_arr.pop());
   clearTimeout( cron_to);
   resetresult(document.getElementById("line0"));
   resetresult(document.getElementById("line1"));
   resetresult(document.getElementById("networks"));
   resetresult(document.getElementById("line2"));
   resetresult(document.getElementById("line3"));
   resetresult(document.getElementById("line4"));
   resetresult(document.getElementById("line5"));
   resetresult(document.getElementById("line6"));
   resetresult(document.getElementById("line7"));
   
   document.getElementById('cancel').disabled = true;
   document.getElementById('stats').disabled = true;

   req_arr = new Array();
   tout_arr = new Array();  
   stat_arr = new Array();
   req_pend = 0;
   acumtime = 0;
   meantime = 0;
   tot_req = 0;
   starttime = new Time();
   finishtime = new Time();
   time_prev = 0;
   cron_to=0;
   timeelap =0;
}

function resetresult(element){
   while (element.firstChild) {
     element.removeChild(element.firstChild);
   }
}


function appendline( num ){
   var t = document.createElement("div");
   t.id =  num;
   t.innerHTML = "Request " +num;
   document.getElementById("line6").appendChild(t);
}

function appendresult(){
   document.getElementById("line6").innerHTML="Headers and  Content received : ";
   var h = document.createElement("textarea");
   h.id="headers";
   h.rows=20;
   h.cols=50;
   document.getElementById("line6").appendChild(h);

   var c = document.createElement("textarea");
   c.id="content_recv";
   c.rows=20;
   c.cols=60;
   document.getElementById("line6").appendChild(c);
}


function check(f,e){
   for(i=0;i<=document.getElementById(f.id).length -1;i++)   document.getElementById(f.id).elements[i].checked=false;
   e.checked=true;
}


function showinfo(req){
  
   var results="";
   var total=0;

   total+=document.getElementsByName("success").length;
   total+=document.getElementsByName("auth").length;
   total+=document.getElementsByName("failed").length;
   total+=document.getElementsByName("timeout").length;
   total+=document.getElementsByName("default").length;
   
   results = " Requests in queue: " + req_arr.length + ", ";
   results += " loaded and uncompleted: " + req_pend + ". ";  
   results += " Responses: " + total + " with " ;
   results += document.getElementsByName("success").length + " successes, ";
   results += document.getElementsByName("auth").length  + " auth pages, ";  
   results += document.getElementsByName("failed").length + " fails, ";
   results += document.getElementsByName("timeout").length +" timeouts, ";
   results += document.getElementsByName("default").length +" others. ";
   results += "Last # "+ req;
   
   if( req_arr.length ==0 )  document.getElementById('cancel').disabled = true;
   return results;
   
}

function showstats(){
   var stats=" Scan stats\n";
   var scantime = 0;
   var meantime =0;
   var ratio;
   var index = 0;
   scantime = finishtime.getseconds() - starttime.getseconds();
   
   if(scantime <=0) ratio = 0; 
   else ratio = Number( acumtime / scantime ).toFixed(3);

   stats = "\t\t--- Statistics ---\n";

   stats += " Requests total " + tot_req +", in queue " + req_arr.length + ", foreseen time " + time_prev +" secs\n";
   meantime = Number(acumtime / tot_req ).toFixed(3);
   stats += " Scan acumulated time : " + acumtime + " secs \t mean: " + eval(isNaN(meantime)?0:meantime) + " secs per request.\n";
   meantime = Number(scantime / tot_req).toFixed(3);
   stats += " Scan total time : " + scantime + " secs \t\t mean: " + eval(isNaN(meantime)?0:meantime) + " secs per request.\n";
   meantime = Number(ratio / tot_req ).toFixed(3);
   stats += " Ratio Acum / Total : " + ratio +"\n";

// if stat_arr is too big program almost freezes and this feature is not useful. 
// if sum  >  1000 is better say no
   var x=0;
   var sum=0;
   while( x < stat_arr.length ) sum += stat_arr[x++];

   if(  document.getElementById( "graph" ).checked==true ){ 
      var r = confirm("Sure? There is "+ sum +" points in the array of stats ...");
      if(r==true){
          document.getElementById('line7').innerHTML = "<br>Number of pending requests vs time : <br>";
          while( index < stat_arr.length ){
             
             var rpend; 
             var num;
             var numdigita;
             var numdigitb;
             
             rpend = stat_arr[index];
             
             num=index;
             numdigita=(num==0)?1:1+Math.floor(Math.log(num)/Math.LN10);
             numdigitb=(stat_arr.length==0)?1:1+Math.floor(Math.log(stat_arr.length)/Math.LN10);
             for(var i=numdigita;i<numdigitb;i++) num="0"+num; 
            
             document.getElementById('line7').innerHTML += num + "=" ;
             
             while(rpend > 0){ document.getElementById('line7').innerHTML += "x" ; rpend--; }
    
             document.getElementById('line7').innerHTML += "<br>";
                
             index++;
         }
      }else{
         document.getElementById('line7').innerHTML = " Graphics  canceled";
      }   
   } else{
      document.getElementById('line7').innerHTML = "";
   }   
   return stats;

}
function options(scan){

   if( document.getElementById("hidefails").checked==true){
      var f =  document.getElementsByName( "failed");
      for(a=0;a<f.length;a++) f[a].style.display='none';
   }
   else{
      var f =  document.getElementsByName( "failed");
      for(a=0;a<f.length;a++) f[a].style.display='block';
      
   }

   if( document.getElementById("hidetimeouts").checked==true){
      var f =  document.getElementsByName( "timeout");  
      for(a=0;a<f.length;a++) f[a].style.display='none';
   }
   else{
      var f =  document.getElementsByName( "timeout");
      for(a=0;a<f.length;a++) f[a].style.display='block';
   }
   
   if( document.getElementById("sort").checked==true){
       try{
          if( req_arr.length>0) req_arr.sort(sortbyip); // ip 
       }catch(error){
          if( req_arr.length>0)  req_arr.sort(sortbyport);   // port
       }
   }
   else{
   
       if( req_arr.length>0)  req_arr.sort(sortbyid); // random
   }
  
   
}

function getXmlHttpRequestObject(){
   if(window.XMLHttpRequest){
      return new XMLHttpRequest();
   }else if (window.ActiveXObject){
           return new ActiveXObject("Microsoft.XMLHTTP");
   }else{
         alert("XMLHttpRequest object not supported");
         return null;
   }
}

function printerror(error){
   window.status="error detected";   
   document.getElementById( 'line4' ).innerHTML =  "cancel  "+ error;
}


function findpublicip(){
   var xhr = getXmlHttpRequestObject();
   var ip = window.location.host;
   try{
      if(document.getElementById( 'f' )!= undefined){
         xhr.open( "GET","http://ip-address.domaintools.com/myip.xml", true);
         xhr.onreadystatechange = function(){
            if(xhr.readyState==0)  document.getElementById('line4').innerHTML = "uninitiated";
            if(xhr.readyState==1)  document.getElementById('line4').innerHTML = "wait... " ;
            if(xhr.readyState==2)  document.getElementById('line4').innerHTML = "loaded " ;
            if(xhr.readyState==3)  document.getElementById('line4').innerHTML = "interactive " ;
            if(xhr.readyState==4){ 
               var xmlDoc=xhr.responseXML.documentElement;
               var ip = xmlDoc.getElementsByTagName("ip_address")[0].childNodes[0].nodeValue;
               var octets = ip.split('.');
               var num = (16777216 * octets[0]) + (65536 * octets[1]) + (256 * octets[2]) ;
               if(document.getElementById( 'f' ).host != undefined) document.getElementById( 'f' ).host.value = ip;

               if(document.getElementById( 'f' ).hini != undefined) {   
                  document.getElementById( 'f' ).hini.value = Math.floor(num/16777216)%256 + '.' + Math.floor(num/65536)%256 + '.' + Math.floor(num/256)%256 + '.0';
                  document.getElementById( 'f' ).hend.value = Math.floor(num/16777216)%256 + '.' + Math.floor(num/65536)%256 + '.' + Math.floor(num/256)%256 + '.255';
               }
               
               document.getElementById('line4').innerHTML = "done! ";
            }       
         }; 
         xhr.send(null);
      }else{
         document.getElementById( 'line4' ).innerHTML =  "set my public ip address in scan or ping form."; 
      }   
   }catch(e){
      
   }
   return ip;
}

function sortbyid( a,b ){
   return ( a.getid()  - b.getid() );
}


function sortbyip( a,b ){
   return( iptonum( a.getip() ) - iptonum( b.getip()) );
}

function sortbyport( a,b ){
   return ( a.getport() - b.getport()) ;
}

function iptonum(ip) {
   var octets = ip.split('.');
   return (16777216 * octets[0]) + (65536 * octets[1]) + (256 * octets[2]) + Number(octets[3]);
};

function numtoip(number) {
   return Math.floor(number/16777216)%256 + '.' +
          Math.floor(number/65536)%256 + '.' +
          Math.floor(number/256)%256 + '.' +
          Math.floor(number)%256;
};


function  Time(){
   d = new Date();
   this.y = d.getFullYear(); 
   this.m = d.getMonth()+1;
   this.d = d.getDate();
   this.h = d.getHours();
   this.x = d.getMinutes();
   this.s = d.getSeconds();
   
   this.gettime = function(){
   
      return(" " + this.y + "-" + this.m + "-" + this.d + " " + this.h + ":" + (this.x<10?"0"+this.x:this.x) + ":" + (this.s<10?"0"+this.s:this.s) );   
   };
   this.getseconds = function(){
   
      t = 3600*this.h+60*this.x+this.s;
      return( t );// reset at midnight 

   };

}

function codes(num){
var code = new Array;
// http status codes from http://msdn2.microsoft.com/en-us/library/aa384325.aspx
code [100]="The request can be continued.";
code [101]="The server has switched protocols in an upgrade header.";
code [200]="The request completed successfully.";
code [201]="The request has been fulfilled and resulted in the creation of a new resource.";
code [202]="The request has been accepted for processing, but the processing has not been completed.";
code [203]="The returned meta information in the entity-header is not the definitive set available from the origin server.";
code [204]="The server has fulfilled the request, but there is no new information to send back.";
code [205]="The request has been completed, and the client program should reset the document view that caused the request to be sent to allow the user to easily initiate another input action.";
code [206]="The server has fulfilled the partial GET request for the resource.";
code [300]="The server couldn't decide what to return.";
code [301]="The requested resource has been assigned to a new permanent URI (Uniform Resource Identifier), and any future references to this resource should be done using one of the returned URIs.";
code [302]="The requested resource resides temporarily under a different URI (Uniform Resource Identifier).";
code [303]="The response to the request can be found under a different URI (Uniform Resource Identifier) and should be retrieved using a GET HTTP verb on that resource.";
code [304]="The requested resource has not been modified.";
code [305]="The requested resource must be accessed through the proxy given by the location field.";
code [307]="The redirected request keeps the same HTTP verb. HTTP/1.1 behavior.";
code [400]="The request could not be processed by the server due to invalid syntax.";
code [401]="The requested resource requires user authentication.";
code [402]="Not currently implemented in the HTTP protocol.";
code [403]="The server understood the request, but is refusing to fulfill it.";
code [404]="The server has not found anything matching the requested URI (Uniform Resource Identifier).";
code [405]="The HTTP verb used is not allowed.";
code [406]="No responses acceptable to the client were found.";
code [407]="Proxy authentication required.";
code [408]="The server timed out waiting for the request.";
code [409]="The request could not be completed due to a conflict with the current state of the resource. The user should resubmit with more information.";
code [410]="The requested resource is no longer available at the server, and no forwarding address is known.";
code [411]="The server refuses to accept the request without a defined content length.";
code [412]="The precondition given in one or more of the request header fields evaluated to false when it was tested on the server.";
code [413]="The server is refusing to process a request because the request entity is larger than the server is willing or able to process.";
code [414]="The server is refusing to service the request because the request URI (Uniform Resource Identifier) is longer than the server is willing to interpret.";
code [415]="The server is refusing to service the request because the entity of the request is in a format not supported by the requested resource for the requested method.";
code [449]="The request hould be retried after doing the appropriate action.";
code [500]="The server encountered an unexpected condition that prevented it from fulfilling the request.";
code [501]="The server does not support the functionality required to fulfill the request.";
code [502]="The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request.";
code [503]="The service is temporarily overloaded.";
code [504]="The request was timed out waiting for a gateway.";
code [505]="The server does not support, or refuses to support, the HTTP protocol version that was used in the request message.";
// error messages from http://msdn2.microsoft.com/en-us/library/aa385465.aspx
code [12111]="The FTP operation was not completed because the session was aborted.";
code [12112]="Passive mode is not available on the server.";
code [12110]="The requested operation cannot be made on the FTP session handle because an operation is already in progress.";
code [12137]="The requested attribute could not be located.";
code [12132]="An error was detected while receiving data from the Gopher server.";
code [12133]="The end of the data has been reached.";
code [12135]="The type of the locator is not correct for this operation.";
code [12134]="The supplied locator is not valid.";
code [12131]="The request must be made for a file locator.";
code [12136]="The requested operation can be made only against a Gopher+ server, or with a locator that specifies a Gopher+ operation.";
code [12130]="An error was detected while parsing data returned from the Gopher server.";
code [12138]="The locator type is unknown.";
code [12162]="The HTTP cookie was declined by the server.";
code [12161]="The HTTP cookie requires confirmation.";
code [12151]="The server did not return any headers.";
code [12155]="The header could not be added because it already exists.";
code [12150]="The requested header could not be located.";
code [12153]="The supplied header is invalid.";
code [12154]="The request made to HttpQueryInfo is invalid.";
code [12152]="The server response could not be parsed.";
code [12160]="The HTTP request was not redirected.";
code [12156]="The redirection failed because either the scheme changed (for example, HTTP to FTP) or all attempts made to redirect failed (default is five attempts).";
code [12168]="The redirection requires user confirmation.";
code [12047]="The application could not start an asynchronous thread.";
code [12166]="There was an error in the automatic proxy configuration script.";
code [12010]="The length of an option supplied to InternetQueryOption or InternetSetOption is incorrect for the type of option specified.";
code [12022]="A required registry value was located but is an incorrect type or has an invalid value.";
code [12029]="The attempt to connect to the server failed.";
code [12042]="The application is posting and attempting to change multiple lines of text on a server that is not secure.";
code [12044]="The server is requesting client authentication.";
code [12046]="Client authorization is not set up on this computer.";
code [12030]="The connection with the server has been terminated.";
code [12031]="The connection with the server has been reset.";
code [12175]="WinINet failed to perform content decoding on the response. For more information, see the Content Encoding topic.";
code [12049]="Another thread has a password dialog box in progress.";
code [12163]="The Internet connection has been lost.";
code [12003]="An extended error was returned from the server. This is typically a string or buffer containing a verbose error message. Call InternetGetLastResponseInfo to retrieve the error text.";
code [12171]="The function failed due to a security check.";
code [12032]="The function needs to redo the request.";
code [12054]="The requested resource requires Fortezza authentication.";
code [12036]="The request failed because the handle already exists.";
code [12039]="The application is moving from a non-SSL to an SSL connection because of a redirect.";
code [12052]="The data being submitted to an SSL connection is being redirected to a non-SSL connection.";
code [12040]="The application is moving from an SSL to an non-SSL connection because of a redirect.";
code [12027]="The format of the request is invalid.";
code [12019]="The requested operation cannot be carried out because the handle supplied is not in the correct state.";
code [12018]="The type of handle supplied is incorrect for this operation.";
code [12014]="The request to connect and log on to an FTP server could not be completed because the supplied password is incorrect.";
code [12013]="The request to connect and log on to an FTP server could not be completed because the supplied user name is incorrect.";
code [12053]="The request requires a CD-ROM to be inserted in the CD-ROM drive to locate the resource requested.";
code [12004]="An internal error has occurred.";
code [12045]="The function is unfamiliar with the Certificate Authority that generated the server's certificate.";
code [12016]="The requested operation is invalid.";
code [12009]="A request to InternetQueryOption or InternetSetOption specified an invalid option value.";
code [12033]="The request to the proxy was invalid.";
code [12005]="The URL is invalid.";
code [12028]="The requested item could not be located.";
code [12015]="The request to connect and log on to an FTP server failed.";
code [12174]="The MS-Logoff digest header has been returned from the Web site. This header specifically instructs the digest package to purge credentials for the associated realm. This error will only be returned if INTERNET_ERROR_MASK_LOGIN_FAILURE_DISPLAY_ENTITY_BODY has been set.";
code [12041]="The content is not entirely secure. Some of the content being viewed may have come from unsecured servers.";
code [12007]="The server name could not be resolved.";
code [12173]="Not currently implemented.";
code [12034]="A user interface or other blocking operation has been requested.";
code [12025]="An asynchronous request could not be made because a callback function has not been set.";
code [12024]="An asynchronous request could not be made because a zero context value was supplied.";
code [12023]="Direct network access cannot be made at this time.";
code [12172]="Initialization of the WinINet API has not occurred. Indicates that a higher-level function, such as InternetOpen, has not been called yet.";
code [12020]="The request cannot be made via a proxy.";
code [12017]="The operation was canceled, usually because the handle on which the request was operating was closed before the operation completed.";
code [12011]="The requested option cannot be set, only queried.";
code [12001]="No more handles could be generated at this time.";
code [12043]="The application is posting data to a server that is not secure.";
code [12008]="The requested protocol could not be located.";
code [12165]="The designated proxy server cannot be reached.";
code [12048]="The function could not handle the redirection, because the scheme changed (for example, HTTP to FTP).";
code [12021]="A required registry value could not be located.";
code [12026]="The required operation could not be completed because one or more requests are pending.";
code [12050]="The dialog box should be retried.";
code [12038]="SSL certificate common name (host name field) is incorrect—for example, if you entered www.server.com and the common name on the certificate says www.different.com.";
code [12037]="SSL certificate date that was received from the server is bad. The certificate is expired.";
code [12055]="The SSL certificate contains errors.";
code [12056]="SSL certificate was revoked.";
code [12057]="SSL certificate was revoked.";
code [12070]="SSL certificate was revoked.";
code [12169]="SSL certificate is invalid.";
code [12157]="The application experienced an internal error loading the SSL libraries.";
code [12164]="The Web site or server indicated is unreachable.";
code [12012]="WinINet support is being shut down or unloaded.";
code [12159]="The required protocol stack is not loaded and the application cannot start WinSock.";
code [12002]="The request has timed out.";
code [12158]="The function was unable to cache the file.";
code [12167]="The automatic proxy configuration script could not be downloaded. The INTERNET_FLAG_MUST_CACHE_REQUEST flag was set.";
code [12006]="The URL scheme could not be recognized, or is not supported.";
return code[num];
}

