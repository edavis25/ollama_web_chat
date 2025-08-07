import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useDarkMode() {
  const isDark = ref(document.documentElement.classList.contains('dark'));
  let observer = null;

  const update = () => {
    isDark.value = document.documentElement.classList.contains('dark');
  };

  onMounted(() => {
    observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    update();
  });

  onBeforeUnmount(() => {
    if (observer) observer.disconnect();
  });

  return { isDark };
}
