Imports System.Net.Sockets

Public Class ScannerForm

    ' Used to carry information from our fibers
    Public Class PortState
        Public Property PortNumber As Integer
        Public Property IsOpen As Boolean

        Public Sub New(open As Boolean, port As Integer)
            Me.IsOpen = open
            Me.PortNumber = port
        End Sub

        Public Overrides Function ToString() As String
            Return String.Format("Port {0} is {1}.", PortNumber, If(IsOpen, "open", "closed"))
        End Function
    End Class

    Private scanningState As Boolean
    Private cancelToken As Threading.CancellationTokenSource

    Private Sub buttonStart_Click(sender As Object, e As EventArgs) Handles buttonStart.Click

        If Not Scanning Then
            If valueStartPort.Value > valueStopPort.Value Then
                MessageBox.Show("Start port number must be less than stop port number.", "Error",
                                MessageBoxButtons.OK, MessageBoxIcon.Error)
                Return
            End If

            boxPositive.Items.Clear()
            boxNegative.Items.Clear()

            Scanning = True
            ScanningProcess(valueHostname.Text, valueStartPort.Value, valueStopPort.Value, valueFiberCount.Value)
        Else
            ' Cancel the scan
            cancelToken.Cancel()
        End If

    End Sub

    Private Async Sub ScanningProcess(host As String, first As Integer, last As Integer, fibers As Integer)

        cancelToken = New Threading.CancellationTokenSource

        Try
            ' Go through all the ports
            For chunkPort = first To last Step fibers

                ' Ask multiple ports all at the same time
                Dim results = Await Task.WhenAll( _
                                From port In Enumerable.Range(chunkPort, fibers)
                                Where port <= last
                                Select IsOpen(host, port))

                If cancelToken.IsCancellationRequested Then
                    Throw New TaskCanceledException
                End If

                ' Print the result
                For Each result In results
                    If result.IsOpen Then
                        boxPositive.Items.Add(result.ToString)
                    Else
                        boxNegative.Items.Add(result.ToString)
                    End If
                Next

                ' Scroll to the end
                boxNegative.SelectedIndex = boxNegative.Items.Count - 1
                boxPositive.SelectedIndex = boxPositive.Items.Count - 1
            Next

        Catch cancel As TaskCanceledException
            ' We were cancelled
        End Try

        ' We're done in any case
        Scanning = False

    End Sub

    Private Async Function IsOpen(host As String, port As Integer) As Task(Of PortState)

        Dim Client As New TcpClient()

        Try
            Debug.Print("Checking port " & port)

            ' Wait for the client to connect
            Await Client.ConnectAsync(host, port)
            Return New PortState(True, port)

        Catch ex As SocketException
            ' No dice
            Return New PortState(False, port)
        Catch ex As ObjectDisposedException
            Return New PortState(False, port)
        Finally
            Client.Close()
        End Try

    End Function

    Public Property Scanning As Boolean
        Get
            Return scanningState
        End Get
        Set(value As Boolean)
            buttonStart.Text = If(value, "&Stop", "&Start")
            scanningState = value
        End Set
    End Property

    Private Sub buttonExit_Click(sender As Object, e As EventArgs) Handles buttonExit.Click
        If Scanning Then
            cancelToken.Cancel()
        End If

        Me.Close()
    End Sub
End Class