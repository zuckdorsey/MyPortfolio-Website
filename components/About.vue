<script setup lang="ts">
import { IconLink, IconChevronDown, IconChevronUp } from "@tabler/icons-vue";
const isExpanded = ref(false);
const toggleContent = () => {
  isExpanded.value = !isExpanded.value;
};
</script>
<template>
  <section class="flex flex-col gap-3">
    <a href="#about">
      <div class="flex flex-row gap-1 items-center group relative">
        <IconLink
          class="absolute transform -translate-x-5 transition duration-200 opacity-0 w-4 h-4 group-hover:opacity-100"
        />
        <h2 class="text-xl font-bold hover:cursor-pointer">
          About Me
        </h2>
      </div>
    </a>
    <p class="text-pretty text-sm text-neutral-600 dark:text-neutral-400">
      Hi! I'm a backend developer with a strong interest in robotics and cybersecurity. I have experience building scalable and efficient backend architectures using Python, Node.js, and PHP, and I work with frameworks like Express.js, Laravel, and Django. My focus is on developing RESTful APIs, managing databases, and writing modular, maintainable code.
    </p>
    <div v-if="isExpanded" class="animate-fadeIn">
      <p
        class="text-pretty text-sm text-neutral-600 dark:text-neutral-400 mb-3"
      >
        Outside of backend development, I actively work on robotics projects, especially those involving microcontrollers, sensors, and automation systems. I'm particularly interested in integrating software with hardware—such as programming navigation logic, implementing serial communication between devices, and handling real-time sensor data. For me, robotics is where code meets the real world and logic is truly tested.
      </p>
      <p class="text-pretty text-sm text-neutral-600 dark:text-neutral-400">
        I'm also a cybersecurity enthusiast who values writing secure, resilient software. I explore secure coding practices, including encryption, token-based authentication, and system hardening to improve application security. I regularly share personal projects and experiments on GitHub as part of my learning journey and to contribute to the developer community. For me, software development is not just about building features—it's about building systems that are both reliable and secure.
      </p>
    </div>
    <div class="flex justify-center mt-4">
      <button
        @click="toggleContent"
        class="group relative inline-flex items-center gap-2 px-6 py-2 overflow-hidden rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-primary-500/10 via-primary-500/20 to-primary-500/10 hover:from-primary-500/20 hover:via-primary-500/30 hover:to-primary-500/20 dark:from-primary-500/20 dark:via-primary-500/30 dark:to-primary-500/20 dark:hover:from-primary-500/30 dark:hover:via-primary-500/40 dark:hover:to-primary-500/30 text-primary-600 dark:text-primary-400 text-sm font-medium"
      >
        <span v-if="isExpanded">
          <IconChevronUp class="w-4 h-4 animate-bounce-mini" />
        </span>
        <span v-else>
          <IconChevronDown class="w-4 h-4 animate-bounce-mini" />
        </span>
        <span class="relative">
          {{ isExpanded ? "Show less" : "Read more" }}
        </span>
        <span
          class="absolute inset-0 -z-10 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-transparent via-primary-500/10 to-transparent dark:via-primary-500/20"
        ></span>
      </button>
    </div>
  </section>
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
.animate-bounce-mini {
  animation: bounce-mini 2s infinite ease-in-out;
}
@keyframes bounce-mini {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}
</style>
