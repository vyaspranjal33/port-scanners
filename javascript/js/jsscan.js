//
//                                  This code is under GPL license
//                             See :http://www.gnu.org/copyleft/gpl.html
//
//                           (c) 2009 Nestor Garcia , at hipernes@users.sourceforge.net
//

var req_arr = new Array();
var tout_arr = new Array();

function init(){
   BrowserDetect.init();
}


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




function scanhosts(){

   resetdata();
   
   //  values for scan ----------------------------------------------

   var x = document.createElement("form");
   x.id="f";
   document.getElementById("line0").appendChild(x);
  
   var y = document.createElement("input");
   y.type="text";
   y.id="hini";
   y.size=15;
   x.innerHTML="From host: ";
   x.appendChild(y);

   y = document.createElement("input");
   y.type="text";
   y.id="hend";
   y.size=15;
   x.innerHTML=x.innerHTML+"to host: ";
   x.appendChild(y);
   
   y = document.createElement("input");
   y.type="text";
   y.id="port";
   y.size=5;
   x.innerHTML=x.innerHTML+"at port: ";
   x.appendChild(y);
   
   y = document.createElement("input");
   y.type="text";
   y.id="timeout";
   y.size=5;
   x.innerHTML=x.innerHTML+" timeout: ";
   x.appendChild(y);
   
   document.getElementById("hini").value=window.location.host;
   document.getElementById("hend").value=window.location.host;
   document.getElementById("port").value=80;
   document.getElementById("timeout").value=5000;

   y = document.createElement("input");
   y.type="button";
   y.value="scan!";
   y.onclick=function (){ initscanhosts(document.getElementById("f")); };
   x.appendChild(y);
   
   //options -------------------------------------------------------
 
   x = document.createElement("form");
   x.id="o";
   document.getElementById("line2").appendChild(x);
   x.innerHTML="Scan timing: ";

   y = document.createElement("input");
   y.type="radio";
   y.id="fixedtype";
   y.defaultChecked=true;
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+"Fixed";


   y = document.createElement("input");
   y.type="text";
   y.id="timeinterval";
   y.size=2;
   x.innerHTML =  x.innerHTML+" with time interval (secs):"  ;
   x.appendChild(y); 

   y = document.createElement("input");
   y.type="radio";
   y.id="randomtype";
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+" Random";

  
   y = document.createElement("input");
   y.type="text";
   y.id="timewindow";
   y.size=4;
   x.innerHTML =  x.innerHTML+" with time window (secs):"  ;
   x.appendChild(y); 

   x.innerHTML=x.innerHTML+" Options:";
   y = document.createElement("input");
   y.type="checkbox";
   y.id="sort";
   y.defaultChecked=true;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+" sorted scan ";
  
   document.getElementById("timeinterval").value=3;
   document.getElementById("timewindow").value=500;
   document.getElementById("sort").onchange=function(){sorted();};   
   document.getElementById("fixedtype").onfocus=function(){fixedscan();};
   document.getElementById("randomtype").onfocus=function(){randomscan();};
   document.getElementById("timeinterval").onfocus=function(){fixedscan();};
   document.getElementById("timewindow").onfocus=function(){randomscan();};
   
  
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
   y.size=5;
   x.innerHTML="From port: ";
   x.appendChild(y);
   
   y = document.createElement("input");
   y.type="text";
   y.id="pend";
   y.size=5;
   x.innerHTML=x.innerHTML+" to port: ";
   x.appendChild(y);
   
   y = document.createElement("input");
   y.type="text";
   y.id="host";
   y.size=15;
   x.innerHTML=x.innerHTML+"at host: ";
   x.appendChild(y);
  
   y = document.createElement("input");
   y.type="text";
   y.id="timeout";
   y.size=5;
   x.innerHTML=x.innerHTML+" timeout: ";
   x.appendChild(y);

   document.getElementById("pini").value="75";
   document.getElementById("pend").value="85";
   document.getElementById("host").value=window.location.host
   document.getElementById("timeout").value="1000";
   
 
   y = document.createElement("input");
   y.type="button";
   y.value="scan!";
   y.onclick=function (){ initscanports(document.getElementById("f")); } ;
   x.appendChild(y);
   
    //options -------------------------------------------------------
 
   x = document.createElement("form");
   x.id="o";
   document.getElementById("line2").appendChild(x);
   x.innerHTML="Scan timing: ";

   y = document.createElement("input");
   y.type="radio";
   y.id="fixedtype";
   y.defaultChecked=true;
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+"Fixed";


   y = document.createElement("input");
   y.type="text";
   y.id="timeinterval";
   y.value="3"
   y.size=2;
   x.innerHTML =  x.innerHTML+" with time interval (secs):"  ;
   x.appendChild(y); 

   y = document.createElement("input");
   y.type="radio";
   y.id="randomtype";
   x.appendChild(y); 
   x.innerHTML=x.innerHTML+" Random";

  
   y = document.createElement("input");
   y.type="text";
   y.id="timewindow";
   y.value="500"
   y.size=4;
   x.innerHTML =  x.innerHTML+" with time window (secs):"  ;
   x.appendChild(y); 

   x.innerHTML=x.innerHTML+" Options:";
   y = document.createElement("input");
   y.type="checkbox";
   y.id="sort";
   y.defaultChecked=true;
   x.appendChild(y);  
   x.innerHTML=x.innerHTML+"sorted scan ";
   
   document.getElementById("timeinterval").value=3;
   document.getElementById("timewindow").value=500;
   document.getElementById("sort").onchange=function(){sorted();};   
   document.getElementById("fixedtype").onfocus=function(){fixedscan();};
   document.getElementById("randomtype").onfocus=function(){randomscan();};
   document.getElementById("timeinterval").onfocus=function(){fixedscan();};
   document.getElementById("timewindow").onfocus=function(){randomscan();};
 
   
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
   y.size=15;
   x.innerHTML="Host: ";
   x.appendChild(y);
   
   y = document.createElement("input");
   y.type="text";
   y.id="port";
   y.size=5;
   x.innerHTML=x.innerHTML+" port: ";
   x.appendChild(y);
   
   y = document.createElement("input");
   y.type="text";
   y.id="timeout";
   y.size=5;
   x.innerHTML=x.innerHTML+" timeout: ";
   x.appendChild(y);


   document.getElementById("host").value=window.location.host;
   document.getElementById("port").value="80";
   document.getElementById("timeout").value="5000";
  
  
   y = document.createElement("input");
   y.type="button";
   y.value="ping!";
   y.onclick=function (){ping(document.getElementById("f"));};
   x.appendChild(y);  

}



//------------------------------------    scans  --------------------------------------------------------------

function initscanhosts(f){
   var t = f.timeout.value;
   var i,j,k;
   var req;

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
   
 
   window.status="scanning...";
   
  
   for(k=i;k<=j;k++){
      req = new pingrequest( numtoip(k), f.port.value, t);
      appendline( req.getid() );
      req_arr.push(req);
   }
   launchrequests();
   window.status="done!";
}



function initscanports(f){
   var j = new Number(f.pend.value);
   var k = new Number(f.pini.value);
   var t = f.timeout.value;


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
  
   window.status="scanning...";
    
   for(i=k;i <= j;i++){
      var req = new pingrequest( f.host.value,i,t);
      appendline( req.getid() );
      req_arr.push(req);
   }
   launchrequests();
   window.status="done!";

}

function launchrequests(){
   tw = Number(document.getElementById('timewindow').value);
   ti = Number(document.getElementById('timeinterval').value);

   if( isNaN(tw) ) tw = 500;
   if( isNaN(ti) ) ti = 3;

   sorted();

   if( document.getElementById('fixedtype').checked == true ){ 
      for( k=0 ; k< req_arr.length ; k++){
         tout_arr[k] = setTimeout("if(req_arr.length > 0) req_arr.shift().dorequest();", 1000 * ti * k);
      }
   }else{
      for( k=0 ; k< req_arr.length ; k++){
         tout_arr[k] = setTimeout("if(req_arr.length > 0) req_arr.shift().dorequest();", Math.floor(Math.random() * 1000 * tw));
      }
   }
   
}

//------------------------------------    ping host  --------------------------------------------------------------

function ping(form){
   var h = form.host.value;
   var p = form.port.value;
   var t = form.timeout.value;
   
   if ( f.host.value.length ==0 ) {
      alert("host name or ip address not valid.");
      return;
   }
   var matchport = f.port.value.match(/^\d+$/);
   if (!matchport) {
      alert("port not valid");
      return;
   }
  
   
   resetresult(document.getElementById("line4"));   
   resetresult(document.getElementById("line5"));
   resetresult(document.getElementById("line6"));
   resetresult(document.getElementById("line7"));
  
   window.status="pinging...";
   var  req = new pingrequest( f.host.value,p,t);
   appendline( req.getid() );
   req.dorequest();
   window.status="done!"
 
   return;
}

function pingrequest( host, port, timeout){
   var src ;
   var h = host;
   var p = port;
   var timeout = (timeout == null)?100:timeout;
   var id = String(Math.floor(Math.random()*10000000000));
   this.getid = function() {  return id   };
   this.getip = function() { return  h };
   this.getport = function() { return p };
 
 
   this.dorequest = function() {

      var img = new Image();
	
      img.onerror = function () {
         if (!img) return;
         img = undefined;
         callback( host, port, 'up',id);
      };
      img.onload = img.onerror;

      switch(port){
         case 21:  src = 'ftp://' + this.id() + '@' + host + '/'; break;//ftp
         case 25:  src = 'mailto://' + this.getid() + '@' + host ; break;//smtp **
         case 70:  src = 'gopher://' + host + '/'; break;//gopher
         case 119: src = 'news://' + host + '/'; break;//nntp **
         case 443: src = 'https://' + host + '/' + this.getid() + '.jpg';
         default:  src = 'http://' + host + ':' + port + '/' + this.getid() + '.jpg';// getid is here to prevent cache seekings;
      }
      // ports 19,70,110,143 always return up in IE
      // ** if outlook is the default mail client and default newsreader in  IE the request does not return anything
      img.src = src;
      setTimeout(function () {
         if (!img) return;
         img = undefined;
         callback( host, port, 'down',id);
      }, timeout);
   };
}

function callback(host, port, message,id){
   document.getElementById( id ).innerHTML += ": Host "+host+" at port "+port+" is "+message;
   if(message=="up")    document.getElementById( id ).style.color ="red";
   else    document.getElementById( id ).style.color ="blue";
}

   

//----------------------- others functions ------------------------------------------

function fixedscan(){

   document.getElementById('randomtype').checked=false;
   document.getElementById('fixedtype').checked=true;
}
function randomscan(){

   document.getElementById('randomtype').checked=true;
   document.getElementById('fixedtype').checked=false;
} 
   
   


function resetdata(){
  
   resetresult(document.getElementById("line0"));
   resetresult(document.getElementById("line1"));
   resetresult(document.getElementById("networks"));
   resetresult(document.getElementById("line2"));
   resetresult(document.getElementById("line3"));
   resetresult(document.getElementById("line4"));
   resetresult(document.getElementById("line5"));
   resetresult(document.getElementById("line6"));
   resetresult(document.getElementById("line7"));
   
   
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



function printerror(error){
   window.status="error detected";   
   document.getElementById( 'line4' ).innerHTML =  "cancel  "+ error;
}


function sorted(){

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

