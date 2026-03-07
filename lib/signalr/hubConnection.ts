import * as signalR from '@microsoft/signalr';

let connection: signalR.HubConnection | null = null;

export function getHubConnection(): signalR.HubConnection {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(process.env.NEXT_PUBLIC_SIGNALR_HUB_URL || 'http://localhost:5155/hubs/news')
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();
  }
  return connection;
}

export async function startConnection(): Promise<void> {
  const conn = getHubConnection();
  if (conn.state === signalR.HubConnectionState.Disconnected) {
    await conn.start();
  }
}
