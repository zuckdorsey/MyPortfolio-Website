<script setup lang="ts">
import type { TimelineItem } from "./Timeline.vue";

type LocaleType = "en" | "id";

const currentLocale: LocaleType = "en";

const { data: rawExperiences } = await useAsyncData<any[]>(
  "experiences",
  async () => {
    return await $fetch<any[]>("/api/experiences");
  }
);

const typeLabel: Record<string, string> = {
  apprenticeship: "Apprenticeship",
  internship: "Internship",
  job: "Full-time",
  freelance: "Freelance",
  contract: "Contract",
};

const items = computed<TimelineItem[]>(() => {
  if (!rawExperiences.value) return [];
  return rawExperiences.value.map((exp) => ({
    _id: exp._id,
    title: exp.company,
    url: exp.company_url || undefined,
    role: exp.position,
    badge: exp.type ? typeLabel[exp.type] ?? exp.type : undefined,
    period: { start: exp.start_date, end: exp.end_date },
    description: exp[`content_${currentLocale}`] ?? exp.content_en ?? "",
    technologies: exp.technologies || [],
  }));
});
</script>

<template>
  <Section
    anchor="experience"
    kicker="Career"
    title="Experience"
    subtitle="Where I've worked and what I built there."
  >
    <Timeline :items="items" icon="briefcase" :show-tech="true" />
  </Section>
</template>
