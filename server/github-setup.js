import { Octokit } from '@octokit/rest'

let connectionSettings;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

// Create the repository
async function createRepository() {
  try {
    const octokit = await getUncachableGitHubClient();
    
    const response = await octokit.rest.repos.createForAuthenticatedUser({
      name: 'brightside-ai-lead-generation',
      description: 'Complete B2B Lead Generation Audit Platform - 9-step audit, website analysis, PDF reports, and proven email templates',
      private: false,
      auto_init: false
    });
    
    console.log('Repository created successfully!');
    console.log('Repository URL:', response.data.html_url);
    console.log('Clone URL:', response.data.clone_url);
    return response.data;
  } catch (error) {
    console.error('Error creating repository:', error.message);
    throw error;
  }
}

// Get user info
async function getUserInfo() {
  try {
    const octokit = await getUncachableGitHubClient();
    const response = await octokit.rest.users.getAuthenticated();
    return response.data;
  } catch (error) {
    console.error('Error getting user info:', error.message);
    throw error;
  }
}

createRepository().catch(console.error);