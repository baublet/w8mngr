import React from "react";

type UIEvents = {
  foodLogAdded: undefined;
  activityLogAdded: undefined;
};

const notReadyMessage =
  "Not ready! Make sure you wrap your component in the EventProvider";
export const EventContext = React.createContext<
  ReturnType<ReturnType<typeof eventService>>
>({
  fire: () => new Error(notReadyMessage),
  unsubscribe: () => new Error(notReadyMessage),
  subscribe: () => new Error(notReadyMessage),
});

export function EventProvider({ children }: React.PropsWithChildren<{}>) {
  const getEventService = window.w8mngrServiceContainer.get(eventService);
  const service = getEventService();
  return (
    <EventContext.Provider value={service}>{children}</EventContext.Provider>
  );
}

export function useEvents() {
  return React.useContext(EventContext);
}

/**
 * A general-purpose event service for UI events
 */
export function eventService() {
  const listeners = new Map<keyof UIEvents, Map<string, Function>>();

  return () => ({
    fire: <T extends keyof UIEvents>(event: T, payload?: UIEvents[T]) => {
      let listenerMap: Map<string, Function> | undefined = listeners.get(event);
      if (!listenerMap) {
        return;
      }
      listenerMap.forEach((listener) => listener(payload));
    },
    subscribe: <T extends keyof UIEvents>(
      event: T,
      eventKey: string,
      listener: UIEvents[T] extends undefined
        ? () => void
        : (args: UIEvents[T]) => void,
    ) => {
      let listenerMap: Map<string, Function> | undefined = listeners.get(event);
      if (!listenerMap) {
        listenerMap = new Map<string, Function>();
      }
      listenerMap.set(eventKey, listener);
      listeners.set(event, listenerMap);
    },
    unsubscribe: <T extends keyof UIEvents>(event: T, eventKey: string) => {
      let listenerMap: Map<string, Function> | undefined = listeners.get(event);
      if (!listenerMap) {
        return;
      }
      listenerMap.delete(eventKey);
    },
  });
}
