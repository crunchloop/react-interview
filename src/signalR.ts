import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

const startConnection = async (): Promise<HubConnection> => {
  const connection = new HubConnectionBuilder()
    .withUrl('https://localhost:44355/notificationHub')
    .withAutomaticReconnect()
    .build();

  await connection.start();
  console.log('SignalR Connection started');

  return connection;
};

export default startConnection;