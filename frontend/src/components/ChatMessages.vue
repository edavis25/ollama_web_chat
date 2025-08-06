<template>
  <div class="flex flex-col gap-4 max-h-full">
    <div
      v-for="(msg, idx) in messages"
      :key="idx"
      :class="`
        py-2 break-words
        ${msg.role === 'user'
          ? 'self-end px-4 bg-indigo-100 text-indigo-900 rounded-3xl dark:bg-zinc-700 dark:text-zinc-100'
          : 'self-start'
       }`"
    >
      <MarkdownRenderer :markdown="msg.content" />
    </div>
  </div>
</template>

<script setup>
import MarkdownRenderer from './MarkdownRenderer.vue';

defineProps({ messages: Array });
</script>
