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
    <div class="flex flex-row gap-2 items-center">
        <UButton
            @click="isDark = !isDark"
            variant="ghost"
            :icon="isDark ? 'i-tabler-moon' : 'i-tabler-sun'"
            aria-label="Dark mode"
            aria-current-value="true"
        />
        <UButton
            @click="rickRoll()"
            variant="ghost"
            icon="i-tabler-info-circle"
            aria-label="Infos"
            aria-current-value="true"
        />
    </div>
</template>
