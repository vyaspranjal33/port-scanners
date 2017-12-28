<%@ Page Language="C#" AutoEventWireUp="false"
Inherits="MultiThreadedWebApp.PortScanner" Src="portscanner.aspx.cs" %>
<script language="c#" runat="server">
protected void scan(Object sender, EventArgs e) {
if ( Scan( urls.Text ) ) {
info.Text = "Scan result:";
ScanForm.Visible = false;
ResultList.DataSource = ScanResults;
ResultList.DataBind();
}
}
</script>
<html>
<head>
<title>Multi-threaded Port Scanner</title>
<style>.BodyText { font-family: verdana; font-size: 12px; color: 333333; } </style>
</head>
<body>
<asp:label id="info" class="BodyText" text="ip/host to scan, one url per entry."
runat="server" /><br />
<asp:Repeater id="ResultList" runat="server">
<HeaderTemplate>
<table class="BodyText" border="0" cellpadding="3" cellspacing="3">
<tr>
<td><b>Status</b></td>
<td><b>IP</b></td>
<td><b>Port</b></td>
<td><b>Responsed / Timed out</b></td>
</tr>
</HeaderTemplate>
<ItemTemplate>
<tr>
<td><%# DataBinder.Eval(Container.DataItem, "status") %></td>
<td><%# DataBinder.Eval(Container.DataItem, "ip") %></td>
<td><%# DataBinder.Eval(Container.DataItem, "port") %></td>
<td><%# DataBinder.Eval(Container.DataItem, "timeSpent") %></td>
</tr>
</ItemTemplate>
<FooterTemplate>
</table>
</FooterTemplate>
</asp:Repeater>
<form id="ScanForm" runat = "server" >
<table class="BodyText">
<tr>
<td valign="top">urls:</td>
<td><asp:textbox class="BodyText" text="" id="urls" rows="10" columns="50" textmode="MultiLine" runat="server" /></td>
</tr>
<tr><td align="right" colspan="2">
<asp:button class="BodyText" text="scan!" type="submit" onclick="scan" runat="server" ID="Button1"/>
</td></tr>
</table>
</form>
</body>
</html>