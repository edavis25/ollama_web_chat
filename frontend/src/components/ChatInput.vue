<template>
  <form
    class="flex items-end gap-0 px-0 py-0 w-full"
    @submit.prevent="$emit('send', modelValue)"
  >
    <div class="relative flex-1 w-full">
      <textarea
        ref="textarea"
        :value="modelValue"
        class="
          flex-1 w-full rounded p-3 pr-12 transition overflow-y-auto max-h-40 resize-none
          placeholder-gray-400 text-base focus:outline-none focus:ring-2 border
          dark:bg-zinc-800 dark:text-zinc-100 dark:border dark:border-zinc-700
        "
        placeholder="Type your message..."
        :disabled="disabled"
        rows="1"
        @input="onInput"
        @keydown.enter.exact.prevent="$emit('send', modelValue)"
      />
      <button
        type="submit"
        class="
          flex items-center justify-center absolute p-1 top-1/2 right-3 -translate-y-1/2
          text-blue-500 cursor-pointer hover:text-blue-600
          dark:text-blue-600 dark:hover:text-blue-700 disabled:text-zinc-500
        "
        :disabled="disabled || !modelValue.trim()"
        tabindex="-1"
        style="pointer-events:auto;"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue';

const props = defineProps({
  disabled: Boolean,
  modelValue: String
});

const emit = defineEmits(['send', 'update:modelValue']);

const textarea = ref(null);

function onInput(e) {
  emit('update:modelValue', e.target.value);
  resize();
}

function focusTextarea() {
  nextTick(() => {
    if (textarea.value) textarea.value.focus();
  });
}

function resize() {
  nextTick(() => {
    if (textarea.value) {
      if (!props.modelValue) {
        textarea.value.style.height = '44px';
        textarea.value.rows = 1;
        textarea.value.style.overflowY = 'hidden';
        return;
      }
      textarea.value.style.height = 'auto';
      const maxHeight = 160; // 40 * 4px = 160px, matches max-h-40
      textarea.value.style.height = textarea.value.scrollHeight + 'px';
      if (textarea.value.scrollHeight > maxHeight) {
        textarea.value.style.height = maxHeight + 'px';
        textarea.value.style.overflowY = 'auto';
      } else {
        textarea.value.style.overflowY = 'hidden';
      }
    }
  });
}

// ensure textarea resizes and refocuses when modelValue is cleared externally
watch(() => props.modelValue, (val, oldVal) => {
  if (val === '') {
    resize();
    focusTextarea();
  }
});
</script>
