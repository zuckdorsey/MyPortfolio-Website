<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed({
    get() {
        return colorMode.value === 'dark';
    },
    set() {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
    }
});

function rickRoll() {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
}
</script>

<template>
    <div class="flex flex-row items-center gap-1">
        <UButton
            @click="isDark = !isDark"
            variant="ghost"
            color="gray"
            :icon="isDark ? 'i-tabler-moon' : 'i-tabler-sun'"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            :aria-pressed="isDark"
            class="transition-transform duration-200 ease-spring hover:-translate-y-0.5 active:scale-95"
        />
        <UButton
            @click="rickRoll()"
            variant="ghost"
            color="gray"
            icon="i-tabler-info-circle"
            aria-label="A little surprise"
            class="transition-transform duration-200 ease-spring hover:-translate-y-0.5 active:scale-95"
        />
    </div>
</template>
