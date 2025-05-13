---
sidebar_position: 1
title: Generic Oauth2
---
# Generic OAuth Authentication

Velero UI supports authentication via a custom OAuth provider. This section explains how to configure and enable OAuth authentication using environment variables.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OAUTH_AUTH_ENABLED` | Set to `true` to enable OAuth authentication. Default is `false`. |
| `OAUTH_NAME` | The display name of the OAuth provider. |
| `OAUTH_AUTHORIZATION_URL` | The authorization endpoint URL for OAuth authentication. |
| `OAUTH_USER_INFO_URL` | The user information endpoint to fetch authenticated user details. |
| `OAUTH_TOKEN_URL` | The token endpoint URL to exchange authorization codes for access tokens. |
| `OAUTH_CLIENT_ID` | The client ID provided by your OAuth provider. |
| `OAUTH_CLIENT_SECRET` | The client secret provided by your OAuth provider. |
| `OAUTH_OAUTH_SCOPE` | The scope of OAuth access. Default: `openid profile email`. |
| `OAUTH_REDIRECT_URI` | The redirect URI after authentication. Default: `http://localhost:4200/login`. |

## Steps to Configure Generic OAuth Authentication

1. **Register an Application with Your OAuth Provider**
   - Navigate to your OAuth provider’s developer portal.
   - Register a new application.
   - Set the **Redirect URI** to `http://localhost:4200/login` (or your production URL).
   - Copy the **Client ID** and **Client Secret**.

2. **Obtain OAuth Endpoints**
   - Locate the authorization, token, and user info URLs from your OAuth provider’s documentation.

3. **Set Environment Variables**
   - Update your environment variables with the values from your OAuth provider.
   - Example:
     ```bash
     OAUTH_AUTH_ENABLED=true
     OAUTH_NAME="Your OAuth Provider"
     OAUTH_AUTHORIZATION_URL="https://your-provider.com/oauth/authorize"
     OAUTH_USER_INFO_URL="https://your-provider.com/oauth/userinfo"
     OAUTH_TOKEN_URL="https://your-provider.com/oauth/token"
     OAUTH_CLIENT_ID=your-client-id
     OAUTH_CLIENT_SECRET=your-client-secret
     OAUTH_OAUTH_SCOPE="openid profile email"
     OAUTH_REDIRECT_URI=http://localhost:4200/login
     OAUTH_GROUP_CLAIM=groups
     ```

4. **Restart Your Application**
   - Restart the Velero UI to apply the changes.

## RBAC

If you are using groups or roles for RBAC, ensure that the OAuth provider supports group claims in the user info response. This allows Velero UI to read the user's group memberships.

You can define the group claim with the `OAUTH_GROUP_CLAIM` environment variable. The default is `groups`.

**Group syntax is** `group_name`, example: `admin`.

Then refer to the [RBAC documentation](../rbac.md) for further configuration.

## Troubleshooting

- Ensure that the redirect URI set in the OAuth provider matches `OAUTH_REDIRECT_URI`.
- Check if `OAUTH_AUTH_ENABLED` is set to `true`.
- Inspect logs for authentication errors.
- Verify that your OAuth credentials and URLs are correct.

## Conclusion

Once configured, users will be able to sign in to Velero UI using the specified OAuth provider for authentication.

