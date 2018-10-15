#import "GCDAsyncSocket.h"

#define PORT 5002

@implementation ViewController
{
    GCDAsyncSocket *asyncSocket;
    NSMutableArray *availableHosts;
}

- (IBAction)startScan
{
    NSArray *ipAddressList = @[@"192.168.1.1",@"192.168.1.2",@"192.168.1.3",@"192.168.1.4",@"192.168.1.5",@"192.168.1.6",@"192.168.1.7"];

    dispatch_queue_t mainQueue = dispatch_get_main_queue();

    asyncSocket = [[GCDAsyncSocket alloc] initWithDelegate:self delegateQueue:mainQueue];
    NSError *error = nil;

    for (int i = 1; i < ipAddressList.count; i++) {
        NSString *scanHostIP = ipAddressList[i];
        [asyncSocket connectToHost:scanHostIP onPort:PORT withTimeout:1 error:&error];
    }
}

- (void)socket:(GCDAsyncSocket *)sock didConnectToHost:(NSString *)host port:(UInt16)port
{
    NSLog(@"Found open port %d on %@", port, host);
    [availableBeds addObject:host];
    [sock setDelegate:nil];
    [sock disconnect];
    [sock setDelegate:self];

}

- (void)socketDidDisconnect:(GCDAsyncSocket *)sock withError:(NSError *)err
{
    NSLog(@"Disconnected: %@", err ? err : @"");
}