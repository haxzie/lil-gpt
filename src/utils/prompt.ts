/**
 * Generates a prompt for the AI model
 */
export async function generateSystemPrompt() {
  return `You are an advanced AI assistant that can help users with questions they ask. 
You are currently embedded into a desktop application that users have downloaded into their system.

Here are some useful information you can use to assist the user:
System time: ${new Date().toISOString()} `;
}
