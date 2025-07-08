import { useEffect, useState } from 'react';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

export const useWebsocketProvider = ({
  room,
  endpoint = 'ws://localhost:1234',
}: {
  room: string;
  endpoint?: string;
}) => {
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  useEffect(() => {
    const doc = new Y.Doc();
    
    const websocketProvider = new WebsocketProvider(
      endpoint,
      room,
      doc,
      {
        connect: true,
      }
    );

    setProvider(websocketProvider);

    return () => {
      websocketProvider.destroy();
      doc.destroy();
    };
  }, [room, endpoint]);

  return provider;
};