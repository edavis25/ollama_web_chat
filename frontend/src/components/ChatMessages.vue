<template>
  <div class="flex flex-col gap-4 max-h-full">
    <div
      v-for="(msg, idx) in messages"
      :key="idx"
      :class="`
        max-w-2xl px-4 py-3 rounded-xl break-words
        ${msg.role === 'user'
          ? 'self-end bg-blue-900 text-blue-200'
          : 'self-start bg-green-900 text-green-200'
       }`"
    >
      <span class="whitespace-pre-line">{{ msg.content }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({ messages: Array });
</script>
