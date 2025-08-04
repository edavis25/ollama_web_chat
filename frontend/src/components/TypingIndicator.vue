<template>
  <div class="flex items-center">
    <span class="dot bg-zinc-400 animate-typing"></span>
    <span class="dot bg-zinc-400 animate-typing [animation-delay:.2s]"></span>
    <span class="dot bg-zinc-400 animate-typing [animation-delay:.4s]"></span>
  </div>
</template>

<style scoped>
.dot {
  @apply w-2 h-2 mx-0.5 rounded-full inline-block;
}
@keyframes typing {
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  40% {
    opacity: 1;
    transform: scale(1.3);
  }
}
.animate-typing {
  animation: typing 1.4s infinite both;
}
</style>