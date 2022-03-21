importScripts("/precache-manifest.8177ceca0d9c079424e87341b6f1cc8a.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

/* global workbox */
workbox.routing.registerRoute('/logo.png', () => {
  console.log('service worker serving logo');
});

workbox.routing.registerRoute(
  new RegExp('/REST/datastores/cassandra/clusters$'),
  workbox.strategies.staleWhileRevalidate(),
);

workbox.routing.registerRoute(
  new RegExp('/REST/datastores/cassandra/clusters/.+/keyspaces$'),
  workbox.strategies.staleWhileRevalidate(),
);

workbox.routing.registerRoute(
  new RegExp('/REST/datastores/cassandra/clusters/.+/schema$'),
  workbox.strategies.staleWhileRevalidate(),
);

workbox.core.skipWaiting();
workbox.core.clientsClaim();

