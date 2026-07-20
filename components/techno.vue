<template>
  <ClientOnly>
    <div
      v-if="technoData"
      :class="{
        [littleClassesDisplay]: size === 'little',
        [bigClassesDisplay]: size === 'big',
        'flex flex-row items-center justify-center gap-1': size === 'medium',
      }"
    >
      <p v-if="size == 'little'" class="mr-2 text-xs">• {{ techno }}</p>
      <p
        v-else-if="size == 'big'"
        class="text-xs font-bold text-stone-800 dark:text-neutral-400"
      >
        {{ techno }}
      </p>
      <UIcon
        :name="technoData.icon || 'i-tabler-code'"
        class="w-6 h-6"
        :class="{ 'mx-auto': size === 'big' }"
      />
    </div>
  </ClientOnly>
</template>
<script setup lang="ts">
interface ContentSkill {
  _id?: string;
  _path?: string;
  title: string;
  type: string;
  url: string;
  icon: string;
}
const props = defineProps<{
  techno: string;
  size: "little" | "medium" | "big";
}>();
const technoData = ref<ContentSkill>({
  title: props.techno,
  icon: "i-tabler-code",
  type: "other",
  url: "#",
});
const littleClassesDisplay = "rounded-md flex flex-row items-center text-xs";
const bigClassesDisplay =
  "flex flex-col items-center justify-evenly text-xs text-center w-full h-full";
</script>
