import { useMemo } from "react";
import { types, applySnapshot } from "mobx-state-tree";
import { CountdownModel } from "./models/CountdownModel";

let store;

const Store = types
  .model({
    countdownModel: CountdownModel
  })
  .actions((self) => {
    let timer;
    function start() {}

    function update() {}

    function stop() {}

    return { start, stop, update };
  });

export function initializeStore(snapshot = null, allData = []) {
  const _store = store ?? Store.create({ countdownModel: { allData } });

  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here, check `pages/ssg.js` and `pages/ssr.js` for more details
  if (snapshot) {
    applySnapshot(_store, snapshot);
  }
  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return store;
}

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
