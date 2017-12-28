/*--------------------
| if your using dev-c++
| you need to link 
| -lws2_32
| to your application
---------------------*/
 
#include <winsock2.h>
#include <iostream>
using namespace std;
 
char IP[20];
int start, end, temp, err, nret;
SOCKET sock;
SOCKADDR_IN Info;
WSADATA wsadata;
   
int main()
{
   err = WSAStartup(MAKEWORD(2, 2), &wsadata);
   if(err != 0)
   {
      cout << "Error with winsock. Will Now Exit." << endl;
      cin.get();
      return 0;
   }
    
   cout << "Target IP: ";
   cin>>IP;
   cout << "Starting Port: ";
   cin>>start;
   cout << "End Port: ";
   cin>>end;
    
   cin.ignore();
    
   cout << endl << endl << "Starting Scan..." << endl << endl;
    
   temp = start;
   while(temp < end)
   {
      sock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
     
      Info.sin_family = AF_INET;
      Info.sin_port = htons(start);
      nret = connect(sock, NULL, NULL);
      if(nret != SOCKET_ERROR)
      {
         cout << "Port " << temp << " - OPEN! " << endl;
      }
      temp++;
      closesocket(sock);
    }
    cout << endl << "Finished With Scan..." << endl;
     
    cin.get();
    return 0;
}