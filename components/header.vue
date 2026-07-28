<script setup lang="ts">
import { IconMapPinFilled } from "@tabler/icons-vue";

const socials = [
  {
    name: "GitHub",
    icon: "i-tabler-brand-github",
    to: "https://github.com/birdfromhell",
  },
  {
    name: "LinkedIn",
    icon: "i-tabler-brand-linkedin",
    to: "https://www.linkedin.com/in/ababil-mustaqim/",
  },
  {
    name: "Email",
    icon: "i-tabler-mail",
    to: "mailto:ababilmustaqim@proton.me",
  },
  {
    name: "Quora",
    icon: "fa6-brands:quora",
    to: "https://id.quora.com/profile/Ababil-Mustaqim-1",
  },
  {
    name: "Resume",
    icon: "i-tabler-file-text",
    to: "/resume",
  },
];
</script>

<template>
  <header
    id="me"
    aria-labelledby="me-heading"
    class="flex items-start justify-between gap-6 sm:items-center"
  >
    <div class="flex min-w-0 flex-col gap-4">
      <div class="flex flex-col gap-2">
        <h1
          id="me-heading"
          class="font-display text-4xl font-semibold leading-[1.05] tracking-tightest text-sand-900 dark:text-sand-50 sm:text-5xl"
        >
          Ababil Mustaqim
        </h1>
        <p class="max-w-md text-base font-medium text-sand-600 dark:text-sand-300">
          Backend software engineer, with a soft spot for robotics and AI.
        </p>
        <p
          class="inline-flex items-center gap-1.5 font-mono text-xs text-sand-500 dark:text-sand-400"
        >
          <IconMapPinFilled class="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          Bandung, Indonesia
        </p>
      </div>

      <nav aria-label="Social links" class="flex flex-row items-center gap-2">
        <UButton
          v-for="s in socials"
          :key="s.name"
          :icon="s.icon"
          :to="s.to"
          :target="s.to.startsWith('http') || s.to.startsWith('mailto') ? '_blank' : undefined"
          :rel="s.to.startsWith('http') ? 'noopener noreferrer' : undefined"
          color="primary"
          variant="soft"
          size="sm"
          square
          :aria-label="s.name"
          class="transition-transform duration-200 ease-spring hover:-translate-y-0.5 active:scale-95"
        />
      </nav>

      <Settings />
    </div>

    <ClientOnly>
      <ConfettisButton>
        <template v-slot:default="{ onLaunchConfettis }">
          <button
            type="button"
            aria-label="Launch confetti"
            class="group relative shrink-0 cursor-pointer rounded-3xl focus-visible:outline-none"
            @click="onLaunchConfettis()"
          >
            <NuxtImg
              src="/photo.jpeg"
              alt="Portrait of Ababil Mustaqim"
              class="h-24 w-24 rounded-3xl object-cover ring-1 ring-sand-200 transition-all duration-300 ease-spring group-hover:scale-[1.03] group-hover:shadow-lift group-hover:ring-emerald-300 dark:ring-sand-700 dark:group-hover:ring-emerald-700 sm:h-40 sm:w-40"
              width="160"
              height="160"
              format="webp"
              preload
              :placeholder="[40, 40, 75, 5]"
            />
          </button>
        </template>
      </ConfettisButton>
    </ClientOnly>
  </header>
</template>
