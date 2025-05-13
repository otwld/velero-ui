---
sidebar_position: 1
title: Microsoft
---

# Microsoft Authentication

Velero UI also supports authentication via Microsoft using OAuth 2.0. This guide explains how to configure and enable Microsoft authentication using environment variables.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MICROSOFT_AUTH_ENABLED` | Set to `true` to enable Microsoft authentication. Default is `false`. |
| `MICROSOFT_CLIENT_ID` | The client ID from your Microsoft Azure portal. |
| `MICROSOFT_CLIENT_SECRET` | The client secret from your Microsoft Azure portal. |
| `MICROSOFT_OAUTH_SCOPE` | The scope of OAuth access. Default: `user.read`. |
| `MICROSOFT_REDIRECT_URI` | The redirect URI after authentication. Default: `http://localhost:4200/login`. |
| `MICROSOFT_TENANT` | The Microsoft tenant ID. Use `common` for multi-tenant applications. |

## Steps to Configure Microsoft Authentication

1. **Register an Application in Azure AD**
   - Go to the [Azure Portal](https://portal.azure.com/).
   - Navigate to **Azure Active Directory > App registrations**.
   - Click **New registration**.
   - Set the **Redirect URI** to `http://localhost:4200/login` (or your production URL).
   - Copy the **Application (client) ID** and **Directory (tenant) ID**.

2. **Create a Client Secret**
   - In your registered application, go to **Certificates & secrets**.
   - Click **New client secret**, set an expiration period, and copy the generated secret.

3. **Set Environment Variables**
   - Update your environment variables with the values from Azure AD.
   - Example:
     ```bash
     MICROSOFT_AUTH_ENABLED=true
     MICROSOFT_CLIENT_ID=your-client-id
     MICROSOFT_CLIENT_SECRET=your-client-secret
     MICROSOFT_OAUTH_SCOPE="user.read"
     MICROSOFT_REDIRECT_URI=http://localhost:4200/login
     MICROSOFT_TENANT=common
     ```

4. **Restart Your Application**
   - Restart the Velero UI to apply the changes.

## RBAC

If you are using Azure AD groups for RBAC, ensure that the `user.read` scope is included in your application settings. This allows Velero UI to read the user's group memberships.

Associate users with groups in Azure AD and assign roles in Velero UI based on these groups.

**Setup permissions:**
1. From the API permissions menu, choose **+ Add a permission**
2. Find **User.Read** permission (under Microsoft Graph) and grant it
3. From the Token Configuration menu, choose **+ Add groups claim**
4. Check **"Groups assigned to the application"** and/or **"Security groups assigned to the application"**

**Associate group to application:**
1. From the **Microsoft Entra ID > Enterprise applications** menu, search the App that you created
2. From the Users and groups menu of the app, add any users or groups requiring access to the service.

**Group syntax is** `group_name`, example: `ADMINS`.

Then refer to the [RBAC documentation](../rbac.md) for further configuration.

## Troubleshooting

- Ensure that the redirect URI set in Azure matches `MICROSOFT_REDIRECT_URI`.
- Check if `MICROSOFT_AUTH_ENABLED` is set to `true`.
- Inspect logs for authentication errors.
- Verify that your Microsoft OAuth credentials are correct.

## Conclusion

Once configured, users will be able to sign in to Velero UI using their Microsoft accounts via OAuth 2.0 authentication.

