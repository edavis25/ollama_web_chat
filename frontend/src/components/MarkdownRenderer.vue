<template>
  <span class="markdown" v-html="marked(markdown)" />
</template>

<script setup>
import { marked } from 'marked';

defineProps({ markdown: String });
</script>

<style scoped>
.markdown {
  display: inline-block;
  max-width: 100%;
}

.markdown > :deep(pre) {
  background: #F3F4F6; /** gray-100 */
  color: #1e293b;
  font-family: monospace;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
  max-width: 100%;
}

.dark .markdown > :deep(pre) {
  background: #3F3F46; /** zinc-700 */
  color: #F4F4F5; /** zinc-100 */
}
</style>