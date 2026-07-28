<script setup lang="ts">
import { computed } from "vue";

definePageMeta({});

useHead({
  title: "Resume - Ababil Mustaqim | Backend Developer CV Download",
  meta: [
    {
      name: "description",
      content:
        "Download CV/Resume Ababil Mustaqim - Backend Developer dengan pengalaman Python, Django, Node.js, dan teknologi modern. Format PDF tersedia untuk download.",
    },
    {
      name: "keywords",
      content:
        "ababil mustaqim cv, ababil mustaqim resume, backend developer cv, python developer resume, django developer cv, download cv, curriculum vitae",
    },
    {
      property: "og:title",
      content: "Resume - Ababil Mustaqim | Backend Developer CV",
    },
    {
      property: "og:description",
      content:
        "Download CV/Resume Ababil Mustaqim - Backend Developer dengan pengalaman Python, Django, Node.js, dan teknologi modern.",
    },
    { name: "robots", content: "index, follow" },
  ],
});

const runtimeConfig = useRuntimeConfig();
const resumeFile = computed(
  () => runtimeConfig.public.resumeUrl?.trim() ?? ""
);
const hasResume = computed(() => resumeFile.value.length > 0);
const resumeLink = computed(() => (hasResume.value ? resumeFile.value : undefined));
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-5 py-10 sm:px-6">
    <NuxtLink
      to="/"
      class="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
    >
      ← Back home
    </NuxtLink>

    <div class="mt-6 mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <h1 class="font-display text-3xl font-semibold tracking-tight text-sand-900 dark:text-sand-100">
        Resume
      </h1>

      <UButton
        v-if="hasResume"
        :to="resumeLink"
        download="Ababil-CV.pdf"
        target="_blank"
        color="primary"
        variant="solid"
        icon="i-tabler-file-download"
      >
        Download resume
      </UButton>
      <p v-else class="text-sm text-sand-500 dark:text-sand-400">
        Resume isn't available yet.
      </p>
    </div>

    <UCard v-if="hasResume" class="w-full" :ui="{ body: { padding: 'p-0' } }">
      <embed
        :src="resumeFile"
        type="application/pdf"
        title="Ababil Mustaqim's resume (PDF)"
        class="min-h-[80vh] w-full rounded-b-2xl"
      />
    </UCard>
    <UCard v-else class="w-full">
      <p class="text-sm text-sand-500 dark:text-sand-400">
        The resume URL isn't configured. Set <code class="rounded bg-sand-100 px-1.5 py-0.5 font-mono text-xs dark:bg-sand-800">NUXT_PUBLIC_RESUME_URL</code> to a public PDF link to show it here.
      </p>
    </UCard>
  </div>
</template>
