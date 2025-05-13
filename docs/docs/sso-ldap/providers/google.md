---
sidebar_position: 1
title: Google
---

# Google Authentication

Velero UI supports authentication via Google using OAuth 2.0. This guide explains how to configure and enable Google authentication using environment variables.

## Environment Variables

To enable Google authentication, set the following environment variables:

| Variable | Description |
|----------|-------------|
| `GOOGLE_AUTH_ENABLED` | Set to `true` to enable Google authentication. Default is `false`. |
| `GOOGLE_CLIENT_ID` | The client ID from your Google Developer Console. |
| `GOOGLE_CLIENT_SECRET` | The client secret from your Google Developer Console. |
| `GOOGLE_OAUTH_SCOPE` | The scope of OAuth access. Default: `openid email profile`. |
| `GOOGLE_REDIRECT_URI` | The redirect URI after authentication. Default: `http://localhost:4200/login`. |

## Steps to Configure Google Authentication

1. **Create a Google OAuth App**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Navigate to **APIs & Services > Credentials**.
   - Click **Create Credentials** and select **OAuth Client ID**.
   - Choose **Web Application** as the application type.
   - Set the **Authorized redirect URIs** to `http://localhost:4200/login` (or your production URL).
   - Copy the **Client ID** and **Client Secret**.

2. **Set Environment Variables**
   - Update your environment variables with the values from Google.
   - Example:
     ```bash
     GOOGLE_AUTH_ENABLED=true
     GOOGLE_CLIENT_ID=your-client-id
     GOOGLE_CLIENT_SECRET=your-client-secret
     GOOGLE_OAUTH_SCOPE="openid email profile"
     GOOGLE_REDIRECT_URI=http://localhost:4200/login
     ```

3. **Restart Your Application**
   - Restart the Velero UI to apply the changes.

## RBAC

If you are using Google Groups for RBAC, ensure that [Cloud Identity API](https://cloud.google.com/identity/docs/set-up-cloud-identity-admin) is enabled in your Google Cloud project. This allows Velero UI to read the user's group memberships.

Add the special scope `https://www.googleapis.com/auth/cloud-identity.groups` to your `GOOGLE_OAUTH_SCOPE` environment variable.

**Setup permissions:**
1. From Google Cloud Console, navigate to **Google Auth API > Data Access**.
2. Click on **Add or remove scopes** and search for **Cloud Identity Groups API**.
3. Select the **auth/cloud-identity.groups.readonly** scope.

**Group syntax is** `group_name`, example: `admin`.

Then refer to the [RBAC documentation](../rbac.md) for further configuration.


## Troubleshooting

- Ensure that the redirect URI set in Google Cloud matches `GOOGLE_REDIRECT_URI`.
- Check if `GOOGLE_AUTH_ENABLED` is set to `true`.
- Inspect logs for authentication errors.
- Verify that your Google OAuth credentials are correct.

## Conclusion

Once configured, users will be able to sign in to Velero UI using their Google accounts via OAuth 2.0 authentication.

