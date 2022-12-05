import {
  StompConfig,
  Client,
  IStompSocket,
  messageCallbackType,
  StompHeaders,
  StompSubscription,
} from "@stomp/stompjs";
import {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import SockJS from "sockjs-client";

type SubscibeProps = (
  destination: string,
  callback: messageCallbackType,
  headers: StompHeaders
) => void;

export type StompSessionSubscriptionType = {
  destination: string;
  callback: messageCallbackType;
  headers: StompHeaders;
  subscription?: StompSubscription;
};

type StompServiceProps = {
  url: string;
  children: ReactNode;
  username?: string;
  stompClientOptions?: any;
} & StompConfig;

type StompSessionProviderContextType = {
  client: Client | null;
  username: string;
  subscribe: SubscibeProps;
};

export const StompContext = createContext<StompSessionProviderContextType>(
  {} as StompSessionProviderContextType
);

export const StompSessionProvider: FC<StompServiceProps> = ({
  url,
  children,
  username,
  stompClientOptions,
  ...stompOptions
}) => {
  if (stompClientOptions) {
    stompOptions = stompClientOptions;
  }
  const [client, setClient] = useState<Client | null>(null);
  const subscriptionRequests = useRef(new Map());

  useEffect(() => {
    const _client = new Client(stompOptions);
    if (username) {
      if (!stompOptions.brokerURL && !stompOptions.webSocketFactory) {
        // This function should return a WebSocket or a similar (e.g. SockJS) object
        _client.webSocketFactory = function () {
          const parsedUrl = new URL(url, window?.location?.href);
          if (
            parsedUrl.protocol === "http:" ||
            parsedUrl.protocol === "https:"
          ) {
            return new SockJS(url) as IStompSocket;
          } else if (
            parsedUrl.protocol === "ws:" ||
            parsedUrl.protocol === "wss:"
          ) {
            return new WebSocket(url) as IStompSocket;
          } else throw new Error("Protocol not supported");
        };
      }
      _client.onConnect = function (frame) {
        if (stompOptions.onConnect) {
          stompOptions.onConnect(frame);
        }

        subscriptionRequests.current.forEach((value) => {
          value.subscription = _client.subscribe(
            value.destination,
            value.callback,
            value.headers
          );
        });
        setClient(_client);
      };
      _client.onWebSocketClose = function (event) {
        if (stompOptions.onWebSocketClose) stompOptions.onWebSocketClose(event);

        setClient(null);
      };

      if (!stompOptions.onStompError) {
        _client.onStompError = function (frame) {
          throw frame;
        };
      }

      _client.activate();
    } else {
      _client?.deactivate();
      setClient(null);
    }
    return () => {
      _client?.deactivate();
    };
  }, [url, username, ...Object.values(stompOptions)]);

  const subscribe = (
    destination: string,
    callback: messageCallbackType,
    headers: StompHeaders = {}
  ) => {
    const subscriptionId = Math.random().toString(36).substr(2, 9);
    const subscriptionRequest: StompSessionSubscriptionType = {
      destination,
      callback,
      headers,
    };

    subscriptionRequests.current.set(subscriptionId, subscriptionRequest);

    if (client && client.connected) {
      subscriptionRequest.subscription = client.subscribe(
        destination,
        callback,
        headers
      );
    }

    return () => {
      const subscriptionData = subscriptionRequests.current.get(subscriptionId);

      if (subscriptionData.subscription) {
        subscriptionData.subscription.unsubscribe();
      }

      subscriptionRequests.current.delete(subscriptionId);
    };
  };
  return (
    <StompContext.Provider
      value={{ client, subscribe, username: username || "" }}
    >
      {children}
    </StompContext.Provider>
  );
};
