<script setup lang="ts">
import type { TimelineItem } from "./Timeline.vue";

type LocaleType = "en" | "id";

const currentLocale: LocaleType = "en";

const { data: rawEducation } = await useAsyncData<any[]>(
  "education",
  async () => {
    return await $fetch<any[]>("/api/education");
  }
);

const items = computed<TimelineItem[]>(() => {
  if (!rawEducation.value) return [];
  return rawEducation.value.map((edu) => ({
    _id: edu._id,
    title: edu.institution,
    url: edu.website || undefined,
    role: edu.degree,
    location: edu.location,
    period: { start: edu.start_date, end: edu.end_date },
    description: edu[`content_${currentLocale}`] ?? edu.content_en ?? "",
  }));
});
</script>

<template>
  <Section
    anchor="education"
    kicker="Background"
    title="Education"
    subtitle="Where I studied and what I focused on."
  >
    <Timeline :items="items" icon="school" />
  </Section>
</template>
