---
sidebar_position: 1
title: Gitlab
---

# GitLab Authentication

Velero UI also supports authentication via GitLab using OAuth 2.0. This guide explains how to configure and enable GitLab authentication using environment variables.

## Environment Variables

To enable GitLab authentication, set the following environment variables:

| Variable | Description |
|----------|-------------|
| `GITLAB_AUTH_ENABLED` | Set to `true` to enable GitLab authentication. Default is `false`. |
| `GITLAB_CLIENT_ID` | The client ID from your GitLab application settings. |
| `GITLAB_CLIENT_SECRET` | The client secret from your GitLab application settings. |
| `GITLAB_OAUTH_SCOPE` | The scope of OAuth access. Default: `read_user`. |
| `GITLAB_REDIRECT_URI` | The redirect URI after authentication. Default: `http://localhost:4200/login`. |
| `GITLAB_BASE_URL` | The base URL of your GitLab instance (use `https://gitlab.com` for the official GitLab service). |

## Steps to Configure GitLab Authentication

1. **Create a GitLab OAuth App**
   - Go to your GitLab instance and navigate to **User Settings > Applications**.
   - Click **New Application**.
   - Set the **Redirect URI** to `http://localhost:4200/login` (or your production URL).
   - Select the **Scopes** required (`read_user` is the default).
   - Copy the **Application ID** (Client ID) and **Secret** (Client Secret).

2. **Set Environment Variables**
   - Update your environment variables with the values from GitLab.
   - Example:
     ```bash
     GITLAB_AUTH_ENABLED=true
     GITLAB_CLIENT_ID=your-client-id
     GITLAB_CLIENT_SECRET=your-client-secret
     GITLAB_OAUTH_SCOPE="read_user"
     GITLAB_REDIRECT_URI=http://localhost:4200/login
     GITLAB_BASE_URL=https://gitlab.com
     ```

3. **Restart Your Application**
   - Restart the Velero UI to apply the changes.

## Troubleshooting

- Ensure that the redirect URI set in GitLab matches `GITLAB_REDIRECT_URI`.
- Check if `GITLAB_AUTH_ENABLED` is set to `true`.
- Inspect logs for authentication errors.
- Verify that your GitLab OAuth credentials are correct.
- If using a self-hosted GitLab instance, set `GITLAB_BASE_URL` accordingly.

## Conclusion

Once configured, users will be able to sign in to Velero UI using their GitLab accounts via OAuth 2.0 authentication.


