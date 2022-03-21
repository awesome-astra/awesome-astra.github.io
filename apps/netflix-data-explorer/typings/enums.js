"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = exports.DatastoreType = exports.EntityType = void 0;
var EntityType;
(function (EntityType) {
    EntityType[EntityType["KEYSPACE"] = 0] = "KEYSPACE";
})(EntityType = exports.EntityType || (exports.EntityType = {}));
var DatastoreType;
(function (DatastoreType) {
    DatastoreType["CASSANDRA"] = "cassandra";
    DatastoreType["DYNOMITE"] = "dynomite";
})(DatastoreType = exports.DatastoreType || (exports.DatastoreType = {}));
var State;
(function (State) {
    State["LOADING"] = "loading";
    State["SUCCESS"] = "success";
    State["ERROR"] = "error";
})(State = exports.State || (exports.State = {}));
//# sourceMappingURL=enums.js.map