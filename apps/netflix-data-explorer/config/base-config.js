"use strict";
/**
 * This configuration file is loaded at app startup.
 *
 * You can override any of these settings by adding a TS file in the `./overrides` directory.
 * Using the CLI will generate a new named override file (e.g. `my-custom-config.ts`). You can
 * then start the app with the following env variable set `DATA_EXPLORER_CONFIG_NAME=my-custom-config`.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLUSTER_NAME_PATTERN_DYNOMITE = exports.CLUSTER_NAME_PATTERN_REDIS = exports.CLUSTER_NAME_PATTERN_CASSANDRA = exports.CLUSTER_REDIRECT_HOST = exports.CASSANDRA_ALLOW_TRUNCATE_TABLE = exports.CASSANDRA_ALLOW_DROP_TABLE = exports.CASSANDRA_METRICS_SUPPORT = exports.CASSANDRA_ENVIRONMENTS_ALLOWING_DESTRUCTIVE_OPERATIONS = exports.CASSANDRA_REQUIRE_METRICS_FOR_DESTRUCTIVE_OPERATIONS = exports.CASSANDRA_METRICS_PROVIDER = exports.CASSANDRA_BASE_AUTH_PROVIDER_PASSWORD = exports.CASSANDRA_BASE_AUTH_PROVIDER_USERNAME = exports.CASSANDRA_CLIENT_OPTIONS_PROVIDER = exports.USER_CACHE_TIMEOUT = exports.USER_CACHE_PROVIDER = exports.ENTITY_ACCESS_CONTROL_SERVICE_PROVIDER = exports.ENTITY_ACCESS_CONTROL_LOADER = exports.DISCOVERY_PROVIDER_ENVIRONMENT_REDIS_HOST = exports.DISCOVERY_PROVIDER_ENVIRONMENT_CASSANDRA_HOST = exports.DISCOVERY_PROVIDER_FILESYSTEM_SOURCE = exports.DISCOVERY_PROVIDER = exports.CLUSTER_ACCESS_CONTROL_ENABLED = exports.CLUSTER_ACCESS_CONTROL_SERVICE_PROVIDER = exports.LOGGER_PROVIDER = exports.MAX_FILE_UPLOAD = exports.ENV_VAR_REGION = exports.ENV_VAR_ENV = exports.ENV_VAR_APP_CLUSTER = exports.ENV_VAR_APP_NAME = exports.REQUEST_HEADER_EMAIL = exports.REQUEST_HEADER_ACCESS_TOKEN = exports.REQUEST_HEADER_CLIENT_CERT_VERIFY = exports.REQUEST_HEADER_CLIENT_CERT = exports.REQUEST_HEADER_CLIENT_APP = exports.REQUIRE_AUTHENTICATION = exports.RESTRICTED_CLUSTERS = exports.UNRESTRICTED_CLUSTERS = exports.ALL_ENTITY_MEMBERS = exports.ALL_CLUSTERS_MEMBERS = exports.ADMIN_USERS = exports.ADMIN_GROUPS = exports.CASSANDRA_PORT = exports.DYNOMITE_REDIS_PORT = exports.REDIS_PORT = exports.DYNOMITE_PORT = exports.REGIONS = exports.ENVIRONMENTS = exports.SUPPORTED_DATASTORE_TYPES = exports.APP_PORT = exports.APP_NAME = void 0;
exports.ASTRA_SECURE_BUNDLE_NAME = exports.ASTRA_APPLICATION_TOKEN = void 0;
exports.APP_NAME = 'nf-data-explorer-2';
exports.APP_PORT = 3000;
/**
 * The list of supported datastores. Support for a datastore can be removed by simply removing it
 * from this list. This will avoid setting up REST routes and displaying UI components for that
 * datastore type.
 */
exports.SUPPORTED_DATASTORE_TYPES = ['dynomite', 'cassandra'];
//
// Define the list of AWS regions and environments (accounts) this application is deployed in.
//
exports.ENVIRONMENTS = ['local'];
exports.REGIONS = ['local'];
exports.DYNOMITE_PORT = 8102;
exports.REDIS_PORT = 6379;
exports.DYNOMITE_REDIS_PORT = exports.REDIS_PORT; // currently dynomite or redis is supported, but not both
exports.CASSANDRA_PORT = 9042;
// ////////////////////////////////////////////////////////////////////////////////////////////////
//
// Access Control
//  Settings controlling user/group/cluster access control.
//
// ////////////////////////////////////////////////////////////////////////////////////////////////
exports.ADMIN_GROUPS = new Array();
exports.ADMIN_USERS = new Array();
/**
 * These users/groups have access to all clusters regardless of what ACL
 * information is returned by the configured ACL provider.
 */
exports.ALL_CLUSTERS_MEMBERS = new Array();
/**
 * These users/groups have access to all entities on a cluster, regardless of
 * what ACL entity information is returned by the configured ACL provider
 */
exports.ALL_ENTITY_MEMBERS = [...exports.ALL_CLUSTERS_MEMBERS];
/**
 * These clusters allow access by all users. These are considered a special case
 * and must have a specific business reason to belong here.
 */
exports.UNRESTRICTED_CLUSTERS = new Array();
/**
 * This is denylist of cluster names that should never appear in the list of available clusters.
 */
exports.RESTRICTED_CLUSTERS = new Array();
// ////////////////////////////////////////////////////////////////////////////////////////////////
//
// Request Headers
//  These are the names of request headers that are expected to contain user identifiable information.
//
// ////////////////////////////////////////////////////////////////////////////////////////////////
exports.REQUIRE_AUTHENTICATION = false;
exports.REQUEST_HEADER_CLIENT_APP = 'oidc_claim_client_id';
exports.REQUEST_HEADER_CLIENT_CERT = 'sslclientcert';
exports.REQUEST_HEADER_CLIENT_CERT_VERIFY = 'sslclientverify';
exports.REQUEST_HEADER_ACCESS_TOKEN = 'oidc_access_token';
exports.REQUEST_HEADER_EMAIL = 'oidc_claim_email';
// ////////////////////////////////////////////////////////////////////////////////////////////////
//
// Environment Variables
//  These are the names of environment variables that are expected to be set on startup.
//
// ////////////////////////////////////////////////////////////////////////////////////////////////
exports.ENV_VAR_APP_NAME = 'APP_NAME';
exports.ENV_VAR_APP_CLUSTER = 'CLUSTER_NAME';
exports.ENV_VAR_ENV = 'ENVIRONMENT';
exports.ENV_VAR_REGION = 'REGION';
// ////////////////////////////////////////////////////////////////////////////////////////////////
//
// App Settings
//   Other app level settings
//
// ////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * The maximum supported file upload in MB. Used when inserting/updating blob columns.
 */
exports.MAX_FILE_UPLOAD = 10 * 1024 * 1024;
// ////////////////////////////////////////////////////////////////////////////////////////////////
//
// Service Providers
//   These are the provider class names that will be loaded on startup.
//
// ////////////////////////////////////////////////////////////////////////////////////////////////
/** The provider used for adding custom transports to the server-side Winston logger */
exports.LOGGER_PROVIDER = 'BaseLoggerProvider';
/** The provider to use for fetching access control information for clusters. */
exports.CLUSTER_ACCESS_CONTROL_SERVICE_PROVIDER = 'DefaultClusterAccessControlProvider';
/** Controls whether or not cluster access control is enforced or not. Defaults to true. */
exports.CLUSTER_ACCESS_CONTROL_ENABLED = true;
/** The provider to use for discovering available clusters. */
exports.DISCOVERY_PROVIDER = 'EnvironmentDiscoveryProvider';
/**
 * If using a `FileSystemDiscoveryProvider`, this property contains the path to the
 * JSON file that is expected to contain the list of discovered clusters and instances.
 * File name is expected to be found in the `data` directory in the project root.
 */
exports.DISCOVERY_PROVIDER_FILESYSTEM_SOURCE = 'discovery.json';
/**
 * If using an `EnvironmentDiscoveryProvider`, these are the environment variables that
 * will point to the Cassandra and Redis hosts.
 */
exports.DISCOVERY_PROVIDER_ENVIRONMENT_CASSANDRA_HOST = 'CASSANDRA_HOST';
exports.DISCOVERY_PROVIDER_ENVIRONMENT_REDIS_HOST = 'REDIS_HOST';
/**
 * The provider to use for fetching entity access control information
 * (e.g. fetching ownership information for C* keyspaces).
 */
exports.ENTITY_ACCESS_CONTROL_LOADER = 'DefaultEntityAccessControlLoader';
exports.ENTITY_ACCESS_CONTROL_SERVICE_PROVIDER = 'DefaultEntityAccessControlServiceProvider';
/**
 * The provider to use for fetching user group information.
 * @see IUserCacheProvider
 */
exports.USER_CACHE_PROVIDER = 'DefaultUserCacheProvider';
/**
 * The TTL value in ms that should be used for user cache entries (contains the mapping
 * of user emails -> user groups). Once an entry expires, the loader will be used to fetch
 * user groups on demand.
 */
exports.USER_CACHE_TIMEOUT = 5 * 60 * 1000;
// ////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cassandra
//   C* specific properties
//
// ////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * The provider to use to specify client options.
 *
 * There is a default base implementation of ICassandraClientOptionsProvider,
 * LocalCassandraClientOptionsProvider, but you can provide your own by creating
 * your own class that implements that interface.
 */
exports.CASSANDRA_CLIENT_OPTIONS_PROVIDER = 'LocalCassandraClientOptionsProvider';
// C* credentials
// Only recommended for local testing. Don't use in production. Default installations
// of C * have authentication enabled and the username / password is `cassandra`.
exports.CASSANDRA_BASE_AUTH_PROVIDER_USERNAME = 'cassandra';
exports.CASSANDRA_BASE_AUTH_PROVIDER_PASSWORD = 'cassandra';
/**
 * The provider to use for loading metrics such as table/keyspace sizes that may be side-loaded from
 * another service.
 */
exports.CASSANDRA_METRICS_PROVIDER = 'CustomCassandraMetricsProvider';
// ////////////////////////////////////////////////////////////////////////////////////////////////
//
// App Settings
//   Other app level settings
//
// ////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * For operations like `DROP TABLE`, require that metrics must be available prior to allowing deletions.
 * Requires `CASSANDRA_METRICS_SUPPORT` to be true and `CASSANDRA_METRICS_PROVIDER` configuration to be specified.
 */
exports.CASSANDRA_REQUIRE_METRICS_FOR_DESTRUCTIVE_OPERATIONS = false;
/**
 * Destructive operations like `DROP` and `TRUNCATE` will only be allowed in the following environments.
 */
exports.CASSANDRA_ENVIRONMENTS_ALLOWING_DESTRUCTIVE_OPERATIONS = ['local'];
/**
 * Enables the retrieval and display of metrics. Note: requires `CASSANDRA_METRICS_PROVIDER` to be set.
 */
exports.CASSANDRA_METRICS_SUPPORT = false;
/**
 * Allow users to drop tables. Sensitive production environments may want to disable this.
 */
exports.CASSANDRA_ALLOW_DROP_TABLE = true;
/**
 * Allow users to truncate tables. Sensitive production environments may want to disable this.
 */
exports.CASSANDRA_ALLOW_TRUNCATE_TABLE = true;
/**
 * The Data Explorer app is expected to be deployed in each cloud provider's account and region where
 * your datastore clusters are deployed. When a user switches accounts/regions, the user will be
 * redirected to the Data Explorer instance running in that region (so all calls can be made region local).
 *
 * This field will alllow you to build your own host name pattern where variables wil be replaced at runtime.
 *
 * Supported variables:
 *  * appName - The app or host name (e.g. `data-explorer`).
 *  * regionName - The cloud provider region (e.g. `us-east-1`).
 *  * accountName - The name of the cloud provider account (e.g. `test` or `prod`).
 *
 * Note: Do not add any addition path params as this will likely break routing.
 */
exports.CLUSTER_REDIRECT_HOST = 'https://:appName-:regionName.:accountName.acme.net';
/**
 * The patterns to use to filter the pool of available clusters to just those of that
 * data store type. Useful if custom naming conventions are used to identify the type
 * of your cluster (e.g. CASSANDRA_ORDERS or REDIS_SESSIONS). Currently not used by
 * OSS providers.
 */
exports.CLUSTER_NAME_PATTERN_CASSANDRA = '.*';
exports.CLUSTER_NAME_PATTERN_REDIS = '.*';
exports.CLUSTER_NAME_PATTERN_DYNOMITE = '.*';
/**
 * DataStax Astra DB connection information
 */
exports.ASTRA_APPLICATION_TOKEN = '';
exports.ASTRA_SECURE_BUNDLE_NAME = '';
//# sourceMappingURL=base-config.js.map