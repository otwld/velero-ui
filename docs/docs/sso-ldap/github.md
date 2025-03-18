---
sidebar_position: 1
title: Github
---

# GitHub Authentication

Velero UI also supports authentication via GitHub using OAuth 2.0. This guide explains how to configure and enable GitHub authentication using environment variables.

## Environment Variables

To enable GitHub authentication, set the following environment variables:

| Variable | Description |
|----------|-------------|
| `GITHUB_AUTH_ENABLED` | Set to `true` to enable GitHub authentication. Default is `false`. |
| `GITHUB_CLIENT_ID` | The client ID from your GitHub Developer Settings. |
| `GITHUB_CLIENT_SECRET` | The client secret from your GitHub Developer Settings. |
| `GITHUB_OAUTH_SCOPE` | The scope of OAuth access. Default: `openid email profile`. |
| `GITHUB_REDIRECT_URI` | The redirect URI after authentication. Default: `http://localhost:4200/login`. |

## Steps to Configure GitHub Authentication

1. **Create a GitHub OAuth App**
   - Go to the [GitHub Developer Settings](https://github.com/settings/developers).
   - Click **New OAuth App**.
   - Set the **Homepage URL** and **Authorization callback URL** to `http://localhost:4200/login` (or your production URL).
   - Copy the **Client ID** and **Client Secret**.

2. **Set Environment Variables**
   - Update your environment variables with the values from GitHub.
   - Example:
     ```bash
     GITHUB_AUTH_ENABLED=true
     GITHUB_CLIENT_ID=your-client-id
     GITHUB_CLIENT_SECRET=your-client-secret
     GITHUB_OAUTH_SCOPE="openid email profile"
     GITHUB_REDIRECT_URI=http://localhost:4200/login
     ```

3. **Restart Your Application**
   - Restart the Velero UI to apply the changes.

## Troubleshooting

- Ensure that the redirect URI set in GitHub Developer Settings matches `GITHUB_REDIRECT_URI`.
- Check if `GITHUB_AUTH_ENABLED` is set to `true`.
- Inspect logs for authentication errors.
- Verify that your GitHub OAuth credentials are correct.

## Conclusion

Once configured, users will be able to sign in to Velero UI using their GitHub accounts via OAuth 2.0 authentication.


