<script setup lang="ts">
import { IconChevronDown } from "@tabler/icons-vue";

const isExpanded = ref(false);
const toggleContent = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <Section
    anchor="about"
    kicker="About"
    title="A bit about me"
  >
    <div class="flex max-w-prose flex-col gap-4 text-[0.95rem] leading-relaxed text-sand-600 dark:text-sand-400">
      <p>
        I'm a backend developer with a strong interest in robotics and cybersecurity. I build scalable, efficient backend architectures with Python, Node.js, and PHP — working across frameworks like Express.js, Laravel, and Django. My focus is on RESTful APIs, databases, and modular, maintainable code.
      </p>

      <div v-if="isExpanded" class="flex flex-col gap-4" :class="{ 'animate-fadeIn': isExpanded }">
        <p>
          Outside of backend work, I build robotics projects — microcontrollers, sensors, and automation. I'm especially interested in where software meets hardware: navigation logic, serial communication between devices, real-time sensor data. That's where code meets the real world and logic is genuinely tested.
        </p>
        <p>
          I'm also a cybersecurity enthusiast who values secure, resilient software. I explore secure coding practices — encryption, token-based authentication, system hardening — and share experiments on GitHub. For me it's not just about building features, but building systems that are reliable and secure.
        </p>
      </div>
    </div>

    <div>
      <button
        @click="toggleContent"
        :aria-expanded="isExpanded"
        class="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-emerald-600 transition-colors duration-200 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
      >
        <span>{{ isExpanded ? "Show less" : "Read more" }}</span>
        <IconChevronDown
          class="h-4 w-4 transition-transform duration-200"
          :class="{ 'rotate-180': isExpanded }"
          aria-hidden="true"
        />
      </button>
    </div>
  </Section>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .animate-fadeIn {
    animation: none;
  }
}
</style>
