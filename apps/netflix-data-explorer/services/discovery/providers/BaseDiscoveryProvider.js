"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class BaseDiscoveryProvider extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.clusterList = [];
        this.environmentList = [];
        this.regionList = [];
    }
    /**
     * Initiates loading of the clusters. Users of this API should listen for the
     * 'loaded-*' events since clusters may be loaded incrementally or on a timer/interval.
     * If clusters fail to load at any point, an 'error' event will be fired. It is the callers
     * responsibility to handle this error appropriately.
     */
    start() {
        throw new Error('Implementors must implement start()');
    }
    /**
     * Fetches the current list of clusters. Note, clusters could be empty until
     * they are loaded. Clusters are loaded asynchonously. See the 'load'
     * method.
     */
    get clusters() {
        return this.clusterList;
    }
    /**
     * Sets the list of discovered clusters. Will notify listeners by emitting a 'loaded-clusters' event.
     * @param clusters The array of clusters.
     */
    set clusters(clusters) {
        this.clusterList = clusters;
        this.emit('loaded-clusters', this.clusterList);
    }
    /**
     * Sets an error condition. Will notify listeners by emitting an 'error' event.
     * @param err The error.
     */
    set error(err) {
        this.lastError = err;
        if (err) {
            this.emit('error', this.lastError);
        }
    }
    /**
     * Fetches the list of environments.
     * @returns Returns the list of discovered environments.
     */
    get environments() {
        return this.environmentList;
    }
    /**
     * Sets the list of environments. Notifies listeners by emitting a 'loaded-environments' event.
     * @param environments The array of discovered environments.
     */
    set environments(environments) {
        this.environmentList = environments;
        this.emit('loaded-environments', this.environmentList);
    }
    /**
     * Fetches the list of discovered regions.
     */
    get regions() {
        return this.regionList;
    }
    /**
     * Sets the list of discovered regions. Notifies listeners by emitting a 'loaded-regions' event.
     * @param regions The array of discovered regions.
     */
    set regions(regions) {
        this.regionList = regions;
        this.emit('loaded-regions', this.regionList);
    }
}
exports.default = BaseDiscoveryProvider;
//# sourceMappingURL=BaseDiscoveryProvider.js.map