/*
    Port scanner code in c
*/
#include "stdio.h"
#include "sys/socket.h"
#include "errno.h"
#include "netdb.h"
#include "string.h"
#include "stdlib.h"
#define MAX_INT 32767
int main(int argc , char **argv)
{
    struct hostent *host;
    int err, i , sock ,start , end;
    char hostname[MAX_INT];
    struct sockaddr_in sa;
    char port 
    //Get the hostname to scan
    printf("Enter hostname or IP : ");
    gets(hostname);
     
    //Get start port number
    printf("\nEnter start port number : ");
    //To Handle the Input
    int data;
    data = scanf("%d",&amp;start);
    if(start == EOF){
    printf("Invalid Port Number");
    exit();
    }     
    //Get end port number
    printf("Enter end port number : ");
    int data2 = scanf("%d" , &amp;end);
    if(data2 == EOF){
    printf("Invaid Port Number");
    exit();
    }
    //Initialise the sockaddr_in structure
    strncpy((char*)&amp;sa , "" , sizeof sa);
    sa.sin_family = AF_INET;
     
    //direct ip address, use it
    if(isdigit(hostname[0]))
    {
        printf("Doing inet_addr...");
        sa.sin_addr.s_addr = inet_addr(hostname);
        printf("Done\n");
    }
    //Resolve hostname to ip address
    else if( (host = gethostbyname(hostname)) != 0)
    {
        printf("Doing gethostbyname...");
        strncpy((char*)&amp;sa.sin_addr , (char*)host-&gt;h_addr , sizeof sa.sin_addr);
        printf("Done\n");
    }
    else
    {
        herror(hostname);
        exit(2);
    }
     
    //Start the port scan loop
    printf("Starting the portscan loop : \n");
    for( i = start ; i &lt;= end ; i++) 
    {
        //Fill in the port number
        sa.sin_port = htons(i);
        //Create a socket of type internet
        sock = socket(AF_INET , SOCK_STREAM , 0);
         
        //Check whether socket created fine or not
        if(sock &lt; 0) 
        {
            perror("\nSocket");
            exit(1);
        }
        //Connect using that socket and sockaddr structure
        err = connect(sock , (struct sockaddr*)&amp;sa , sizeof sa);
         
        //not connected
        if( err &lt; 0 )
        {
            //printf("%s %-5d %s\r" , hostname , i, strerror(errno));
            fflush(stdout);
        }
        //connected
        else
        {
            printf("%-5d open\n",  i);
        }
        close(sock);
    }
     
    printf("\r");
    fflush(stdout);
    return(0);
} 