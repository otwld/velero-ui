---
sidebar_position: 4
title: 🌍 Environment Variables
---

## Overview

Velero UI provides a range of environment variables that allow you to customize and configure
various aspects of the application. This page serves as a comprehensive reference for all available
environment variables, including their types, default values, and descriptions.

## App/Backend

The following environment variables are used by `apps/velero-ui-api` to provide Velero UI startup
configuration.

### API (backend)

#### `NODE_ENV`

- **Type**: `string` (enum: `development`, `production`)
- **Default**:
  - **App Default**: `development`
  - **Docker Default**: `production`
- **Description**: Specifies the environment in which the application is running. Use `development` for local development and `production` for live deployments.

#### `LOG_LEVEL`

- **Type**: `string` (enum: `debug`, `info`, `error`)
- **Default**: `info`
- **Description**: Sets the log level for the backend API, allowing you to control the verbosity of logs. Options include `debug`, `info`, and `error`.

#### `PORT`

- **Type**: `number`
- **Default**: `3000`
- **Description**: Defines the port on which the API will be exposed. You can change this to avoid conflicts with other services.

#### `VELERO_NAMESPACE`

- **Type**: `string`
- **Default**: `velero`
- **Description**: Specifies the Kubernetes namespace in which Velero is deployed. This is important for managing backups and restores.

#### `AUTH_SECRET_PASSPHRASE`

- **Type**: `string`
- **Default**: `this is not a secret passphrase`
- **Description**: A secret passphrase used for signing and verifying JWT tokens. Ensure this is kept secure to prevent unauthorized access.

#### `AUTH_SESSION_DURATION`

- **Type**: `string`
- **Default**: `1h`
- **Description**: Indicates the duration of a user session, used for generating JWT tokens. Adjust this value to control session length.

#### `KUBE_CONFIG_PATH`

- **Type**: `string`
- **Default**:
  - **Development Default**: `-`
  - **Docker Default**: `-`
  - **Kubernetes Default**: Provided by Cluster Role Binding
- **Description**: Specifies the path to the Kubernetes configuration file. This file is needed to connect to the Kubernetes cluster.

#### `KUBE_CONTEXT`

- **Type**: `string`
- **Default**:
  - **Development Default**: Uses the default context from Kube Config.
  - **Docker Default**: Uses the default context from Kube Config.
  - **Kubernetes Default**: Provided by Cluster Role Binding
- **Description**: Defines the context to use from the Kube Config for cluster interactions. Ensure the correct context is set for the desired cluster.

### APP (frontend)

#### `GRAFANA_URL`

- **Type**: `string`
- **Description**: URL link to your Grafana Dashboard for monitoring and visualization purposes.

#### `VITE_PORT` (development only)

- **Type**: `number`
- **Default**: `4200`
- **Description**: The port on which the frontend application is exposed during development. This can be adjusted if needed.

#### `VITE_API_URL` (development only)

- **Type**: `string`
- **Default**: `http://localhost:${PORT}/api`
- **Description**: The base URL for the API that the frontend application will interact with during development.

### Authentication

#### `BASIC_AUTH_ENABLED`

- **Type**: `bool`
- **Default**: `true`
- **Description**: Enables basic authentication for the application. If set to `false`, the login form will be hidden.

#### `BASIC_AUTH_USERNAME`

- **Type**: `string`
- **Default**: `admin`
- **Description**: Specifies the username for basic authentication. Change this as needed for security.

#### `BASIC_AUTH_PASSWORD`

- **Type**: `string`
- **Default**: `admin`
- **Description**: Specifies the password for basic authentication. Ensure this is secure and not easily guessable.

### Federated Authentication

#### `GOOGLE_AUTH_ENABLED`

- **Type**: `bool`
- **Default**: `false`
- **Description**: Enables Google authentication for users. When enabled, users can log in using their Google accounts.

#### `GOOGLE_CLIENT_ID`

- **Type**: `string`
- **Description**: Sets the client ID for Google OAuth authentication, required for user verification.

#### `GOOGLE_CLIENT_SECRET`

- **Type**: `string`
- **Description**: Sets the client secret for Google OAuth authentication, essential for securing the authentication process.

#### `GOOGLE_OAUTH_SCOPE`

- **Type**: `string`
- **Default**: `openid email profile`
- **Description**: Defines the scopes for Google OAuth authentication, specifying the permissions requested from the user.

#### `GOOGLE_REDIRECT_URI`

- **Type**: `string`
- **Default**: `${BASE_URL}/login`
- **Description**: The URI to which Google redirects users after authentication. This should be configured to match your application's routes.

#### `GITHUB_AUTH_ENABLED`

- **Type**: `bool`
- **Default**: `false`
- **Description**: Enables GitHub authentication for users. When activated, users can log in with their GitHub accounts.

#### `GITHUB_CLIENT_ID`

- **Type**: `string`
- **Description**: Sets the client ID for GitHub OAuth authentication, necessary for user verification.

#### `GITHUB_CLIENT_SECRET`

- **Type**: `string`
- **Description**: Sets the client secret for GitHub OAuth authentication, crucial for securing the authentication process.

#### `GITHUB_OAUTH_SCOPE`

- **Type**: `string`
- **Default**: `openid email profile`
- **Description**: Specifies the scopes for GitHub OAuth authentication, detailing the permissions requested from the user.

#### `GITHUB_REDIRECT_URI`

- **Type**: `string`
- **Default**: `${BASE_URL}/login`
- **Description**: The URI to which GitHub redirects users after authentication, which should align with your application's routes.

#### `GITLAB_AUTH_ENABLED`

- **Type**: `bool`
- **Default**: `false`
- **Description**: Enables GitLab authentication for users, allowing them to log in with their GitLab accounts when activated.

#### `GITLAB_CLIENT_ID`

- **Type**: `string`
- **Description**: Sets the client ID for GitLab OAuth authentication, essential for user verification.

#### `GITLAB_CLIENT_SECRET`

- **Type**: `string`
- **Description**: Sets the client secret for GitLab OAuth authentication, necessary for securing the authentication process.

#### `GITLAB_OAUTH_SCOPE`

- **Type**: `string`
- **Default**: `read_user`
- **Description**: Specifies the scope for GitLab OAuth authentication, detailing the permissions requested from the user.

#### `GITLAB_REDIRECT_URI`

- **Type**: `string`
- **Default**: `${BASE_URL}/login`
- **Description**: The URI to which GitLab redirects users after authentication, which should align with your application's routes.

#### `GITLAB_BASE_URL`

- **Type**: `string`
- **Default**: `https://gitlab.com/`
- **Description**: Sets the base URL for GitLab. This can be modified if using a self-hosted GitLab instance.

#### `MICROSOFT_AUTH_ENABLED`

- **Type**: `bool`
- **Default**: `false`
- **Description**: Enables Microsoft authentication for users. When activated, users can log in using their Microsoft accounts.

#### `MICROSOFT_CLIENT_ID`

- **Type**: `string`
- **Description**: Sets the client ID for Microsoft OAuth authentication, required for user verification.

#### `MICROSOFT_CLIENT_SECRET`

- **Type**: `string`
- **Description**: Sets the client secret for Microsoft OAuth authentication, crucial for securing the authentication process.

#### `MICROSOFT_OAUTH_SCOPE`

- **Type**: `string`
- **Default**: `user.read`
- **Description**: Defines the scope for Microsoft OAuth authentication, specifying the permissions requested from the user.

#### `MICROSOFT_REDIRECT_URI`

- **Type**: `string`
- **Default**: `${BASE_URL}/login`
- **Description**: The URI to which Microsoft redirects users after authentication. Ensure it matches your application's routes.

#### `MICROSOFT_TENANT`

- **Type**: `string`
- **Default**: `common`
- **Description**: Specifies the tenant for Microsoft OAuth authentication, which can be set to a specific tenant for better control.

#### `OAUTH_AUTH_ENABLED`

- **Type**: `bool`
- **Default**: `false`
- **Description**: Enables OAuth2 authentication for users. When activated, users can log in using various OAuth2 providers.

#### `OAUTH_CLIENT_ID`

- **Type**: `string`
- **Description**: Sets the client ID for OAuth2 authentication, necessary for user verification.

#### `OAUTH_CLIENT_SECRET`

- **Type**: `string`
- **Description**: Sets the client secret for OAuth2 authentication, crucial for securing the authentication process.

#### `OAUTH_OAUTH_SCOPE`

- **Type**: `string`
- **Default**: `openid profile email`
- **Description**: Defines the scopes for OAuth2 authentication, specifying the permissions requested from the user.

#### `OAUTH_REDIRECT_URI`

- **Type**: `string`
- **Default**: `${BASE_URL}/login`
- **Description**: The URI to which the OAuth2 provider redirects users after authentication. Ensure it matches your application's routes.

#### `OAUTH_AUTHORIZATION_URL`

- **Type**: `string`
- **Description**: Sets the authorization URL for OAuth2 authentication, directing users to the provider's login page.

#### `OAUTH_USER_INFO_URL`

- **Type**: `string`
- **Description**: Specifies the user info URL for OAuth2 authentication, used to retrieve user profile information after authentication.

#### `OAUTH_TOKEN_URL`

- **Type**: `string`
- **Description**: Sets the token URL for OAuth2 authentication, used to exchange the authorization code for access tokens.

#### `OAUTH_NAME`

- **Type**: `string`
- **Default**: `SSO`
- **Description**: Defines the name for the OAuth2 provider. This name may be displayed in the user interface for clarity.

### LDAP

#### `LDAP_ENABLED`

- **Type**: `bool`
- **Default**: `false`
- **Description**: This variable determines whether LDAP authentication is enabled. When set to `true`, the application will attempt to authenticate users via LDAP. If set to `false`, LDAP authentication will be disabled, and alternative authentication methods may be used instead.

#### `LDAP_URL`

- **Type**: `string`
- **Default**: `ldap://`
- **Description**: This variable specifies the URL of the LDAP server to connect to. It should include the protocol (e.g., `ldap://` or `ldaps://` for secure connections), the hostname, and optionally the port number. Proper configuration is essential for the application to successfully communicate with the LDAP server.

#### `LDAP_BIND_DN`

- **Type**: `string`
- **Description**: This variable holds the Distinguished Name (DN) of the user account used to bind to the LDAP directory. This account must have the necessary permissions to perform search and authentication operations within the directory.

#### `LDAP_BIND_CREDENTIALS`

- **Type**: `string`
- **Description**: This variable contains the password or credentials for the LDAP user specified in `LDAP_BIND_DN`. It is crucial for the application to securely authenticate to the LDAP server and perform user lookups.

#### `LDAP_SEARCH_BASE`

- **Type**: `string`
- **Description**: This variable defines the base DN from which the LDAP search queries will start. It should represent the root of the user entries in the LDAP directory and is important for limiting the search scope to relevant entries.

#### `LDAP_SEARCH_FILTER`

- **Type**: `string`
- **Default**: `(uid={{username}})`
- **Description**: This variable specifies the filter used to search for user entries in the LDAP directory. The default filter `(uid={{username}})` looks for entries with a matching `uid` attribute based on the provided username. This filter can be customized to match other attributes as needed.

#### `LDAP_SEARCH_ATTRIBUTES`

- **Type**: `string`
- **Description**: This variable defines which attributes should be retrieved from the LDAP entries during a search. Multiple attributes can be specified, separated by commas. This allows the application to obtain only the necessary data for user authentication and profile management, improving efficiency and security.


