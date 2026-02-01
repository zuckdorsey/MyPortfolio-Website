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
  <div class="container mx-auto px-4 py-6">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Resume</h1>

      <UButton
        v-if="hasResume"
        :to="resumeLink"
        download="Ababil-CV.pdf"
        target="_blank"
        color="primary"
        variant="solid"
        class="mt-4 md:mt-0"
      >
        <i class="i-tabler-file-download mr-2"></i>
        Download Resume
      </UButton>
      <p
        v-else
        class="mt-4 md:mt-0 text-sm text-gray-500 text-center md:text-right"
      >
        Resume belum tersedia.
      </p>
    </div>

    <UCard v-if="hasResume" class="w-full">
      <embed
        :src="resumeFile"
        type="application/pdf"
        class="w-full min-h-[80vh]"
      />
    </UCard>
    <UCard v-else class="w-full">
      <p class="text-sm text-gray-500">
        URL resume belum dikonfigurasi. Setel `NUXT_PUBLIC_RESUME_URL` ke tautan
        Google Drive publik untuk menampilkan CV.
      </p>
    </UCard>
  </div>
</template>
