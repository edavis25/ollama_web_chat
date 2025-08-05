import fs from 'fs';
import path from 'path';

const promptPath = path.join(process.cwd(), '', 'system_prompt.txt');

export function formatPrompt({ model, messages }) {
  const formatter = resolveFormatter(model);
  const systemPrompt = getSystemPrompt();
  const prompt = formatter({
    system: systemPrompt,
    messages
  });
  console.log(prompt);
  return prompt;
}

function formatAlpacaPrompt({ system, messages }) {
  let prompt = '';
  if (system) {
    prompt += system.trim() + '\n\n';
  }
  prompt += 'Below is a conversation between a human and an AI assistant.\n\n';

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role === 'user') {
      prompt += '### Instruction:\n' + msg.content.trim() + '\n';
      // Check if next message is assistant
      if (messages[i + 1] && messages[i + 1].role === 'assistant') {
        prompt += '### Response:\n' + messages[i + 1].content.trim() + '\n\n';
        i++; // skip next, already handled
      } else {
        // Last user message, leave empty response for model
        prompt += '### Response:\n';
      }
    }
  }

  return prompt;
}

function formatOpenAIPrompt({ system, messages }) {
  const formatted = [];
  if (system && system.trim()) {
    formatted.push({ role: 'system', content: system.trim() });
  }

  for (const msg of messages) {
    if (msg.role === 'user' || msg.role === 'assistant') {
      formatted.push({ role: msg.role, content: msg.content });
    }
  }

  return formatted;
}

function formatChatMLPrompt({ system, messages }) {
  let prompt = '';
  if (system && system.trim()) {
    prompt += '[[system]]\n' + system.trim() + '[[/system]]\n';
  }
  for (const msg of messages) {
    if (msg.role === 'user') {
      prompt += '[[user]]\n' + msg.content.trim() + '[[/user]]\n';
    } else if (msg.role === 'assistant') {
      prompt += '[[assistant]]\n' + msg.content.trim() + '[[/assistant]]\n';
    }
  }

  // End with [[assistant]]\n for model to complete
  prompt += '[[assistant]]\n';
  return prompt;
}

function resolveFormatter(model) {
  switch (model.toLowerCase()) {
    case 'alpaca':
    case 'mythomax13b:latest':
      return formatAlpacaPrompt;
    case 'chatml':
    case 'nous-hermes2:latest':
      return formatChatMLPrompt;
    case 'openai':
    default:
      return formatOpenAIPrompt;
  }
}

function getSystemPrompt() {
  try {
    return fs.readFileSync(promptPath, 'utf8');
  } catch (e) {
    console.error(e)
    return '';
  }
}
