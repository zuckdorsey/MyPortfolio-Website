<script setup lang="ts">
import { IconSend, IconCheck } from "@tabler/icons-vue";
import { z } from "zod";
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
const formState = ref<ContactFormData>({
  name: "",
  email: "",
  message: "",
});
const isSubmitting = ref(false);
const isSubmitted = ref(false);
const hasError = ref(false);
const errorMessage = ref("");
const FORMSPARK_URL = "https://submit-form.com/25uytm42L";
const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

const socialLinks = [
  {
    name: "GitHub",
    icon: "i-tabler-brand-github",
    url: "https://github.com/birdfromhell",
    color: "hover:text-gray-900 dark:hover:text-white",
  },
  {
    name: "LinkedIn",
    icon: "i-tabler-brand-linkedin",
    url: "https://linkedin.com/in/ababil-mustaqim-1",
    color: "hover:text-blue-700 dark:hover:text-blue-400",
  },
  {
    name: "Instagram",
    icon: "i-tabler-brand-instagram",
    url: "https://instagram.com/aababiil",
    color: "hover:text-purple-500 dark:hover:text-purple-400",
  },
  {
    name: "Tiktok",
    icon: "i-tabler-brand-tiktok",
    url: "https://www.tiktok.com/@saintsscenery",
    color: "hover:text-black dark:hover:text-white",
  },
  {
    name: "Email",
    icon: "i-tabler-mail",
    url: "mailto:ababilmustaqim@proton.me",
    color: "hover:text-red-500 dark:hover:text-red-400",
  },
];
async function submitForm() {
  try {
    isSubmitting.value = true;
    hasError.value = false;
    schema.parse(formState.value);
    const response = await fetch(FORMSPARK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formState.value),
    });
    if (!response.ok) {
      throw new Error(`Form submission failed with status ${response.status}`);
    }
    isSubmitted.value = true;
    formState.value = { name: "", email: "", message: "" };
  } catch (error) {
    hasError.value = true;
    if (error instanceof z.ZodError) {
      errorMessage.value = error.errors.map((e) => e.message).join(", ");
    } else {
      errorMessage.value = "An unexpected error occurred. Please try again.";
      console.error("Contact form error:", error);
    }
  } finally {
    isSubmitting.value = false;
  }
}
function resetForm() {
  isSubmitted.value = false;
  hasError.value = false;
  errorMessage.value = "";
}
</script>
<template>
  <Section
    anchor="contact"
    kicker="Contact"
    title="Let's work together"
    subtitle="Have a project in mind, or just want to say hello? My inbox is open."
  >
    <div class="grid gap-6 md:grid-cols-5">
      <!-- Intro + socials -->
      <UCard
        class="md:col-span-2"
        :ui="{ body: { padding: 'p-5' }, background: 'bg-emerald-50/60 dark:bg-emerald-950/20', ring: 'ring-1 ring-emerald-100 dark:ring-emerald-900/40', shadow: 'shadow-none' }"
      >
        <div class="flex h-full flex-col justify-between gap-6">
          <div>
            <h3 class="font-display text-lg font-semibold text-sand-900 dark:text-sand-100">
              Get in touch
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-sand-600 dark:text-sand-400">
              I usually reply within a day or two. The form goes straight to my email — or reach me on any of these:
            </p>
          </div>
          <div>
            <h4 class="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-sand-500 dark:text-sand-400">
              Elsewhere
            </h4>
            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="link in socialLinks"
                :key="link.name"
                :to="link.url"
                target="_blank"
                rel="noopener noreferrer"
                variant="soft"
                color="primary"
                size="sm"
                square
                :aria-label="link.name"
                class="transition-transform duration-200 ease-spring hover:-translate-y-0.5 active:scale-95"
              >
                <UIcon :name="link.icon" class="h-5 w-5" aria-hidden="true" />
              </UButton>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Form / success -->
      <UCard class="md:col-span-3" :ui="{ body: { padding: 'p-5' } }">
        <div
          v-if="isSubmitted"
          class="flex flex-col items-center justify-center py-12 text-center"
        >
          <div class="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
            <IconCheck class="h-8 w-8 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          </div>
          <h3 class="font-display text-xl font-semibold text-sand-900 dark:text-sand-100">
            Message sent
          </h3>
          <p class="mt-2 text-sm text-sand-600 dark:text-sand-400">
            Thanks for reaching out — I'll get back to you soon.
          </p>
          <UButton
            variant="outline"
            color="gray"
            @click="resetForm"
            size="sm"
            icon="i-tabler-refresh"
            class="mt-6"
          >
            Send another message
          </UButton>
        </div>

        <form v-else @submit.prevent="submitForm" class="flex flex-col gap-4" novalidate>
          <input
            type="checkbox"
            name="_honeypot"
            style="display: none"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
          />
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="contact-name" class="mb-1.5 block text-xs font-medium text-sand-600 dark:text-sand-400">Name</label>
              <UInput
                id="contact-name"
                v-model="formState.name"
                placeholder="Your name"
                type="text"
                required
                autocomplete="name"
                icon="i-tabler-user"
              />
            </div>
            <div>
              <label for="contact-email" class="mb-1.5 block text-xs font-medium text-sand-600 dark:text-sand-400">Email</label>
              <UInput
                id="contact-email"
                v-model="formState.email"
                placeholder="you@example.com"
                type="email"
                required
                autocomplete="email"
                icon="i-tabler-mail"
              />
            </div>
          </div>
          <div>
            <label for="contact-message" class="mb-1.5 block text-xs font-medium text-sand-600 dark:text-sand-400">Message</label>
            <UTextarea
              id="contact-message"
              v-model="formState.message"
              placeholder="Tell me about your project or question…"
              :rows="4"
              required
              class="resize-none"
            />
          </div>

          <p
            v-if="hasError"
            role="alert"
            class="flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400"
          >
            <UIcon name="i-tabler-alert-circle" class="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            {{ errorMessage }}
          </p>

          <UButton
            type="submit"
            variant="solid"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            class="w-fit transition-transform duration-200 ease-spring hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <IconSend class="mr-2 h-4 w-4" aria-hidden="true" />
            Send message
          </UButton>
        </form>
      </UCard>
    </div>
  </Section>
</template>
<style scoped>
.input-focused {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
}
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.success-checkmark {
  width: 80px;
  height: 80px;
  position: relative;
}
.success-checkmark .check-icon {
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 50%;
  box-sizing: content-box;
  border: 4px solid rgb(var(--color-green-500));
}
.success-checkmark .check-icon::before {
  top: 3px;
  left: -2px;
  width: 30px;
  transform-origin: 100% 50%;
  border-radius: 100px 0 0 100px;
}
.success-checkmark .check-icon::after {
  top: 0;
  left: 30px;
  width: 60px;
  transform-origin: 0 50%;
  border-radius: 0 100px 100px 0;
  animation: rotate-circle 4.25s ease-in;
}
.success-checkmark .check-icon::before,
.success-checkmark .check-icon::after {
  content: "";
  height: 100px;
  position: absolute;
  background: transparent;
  transform: rotate(-45deg);
}
.success-checkmark .check-icon .icon-line {
  height: 5px;
  background-color: rgb(var(--color-green-500));
  display: block;
  border-radius: 2px;
  position: absolute;
  z-index: 10;
}
.success-checkmark .check-icon .icon-line.line-tip {
  top: 46px;
  left: 14px;
  width: 25px;
  transform: rotate(45deg);
  animation: icon-line-tip 0.75s;
}
.success-checkmark .check-icon .icon-line.line-long {
  top: 38px;
  right: 8px;
  width: 47px;
  transform: rotate(-45deg);
  animation: icon-line-long 0.75s;
}
.success-checkmark .check-icon .icon-circle {
  top: -4px;
  left: -4px;
  z-index: 10;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: absolute;
  box-sizing: content-box;
  border: 4px solid rgba(76, 175, 80, 0.5);
}
.success-checkmark .check-icon .icon-fix {
  top: 8px;
  width: 5px;
  left: 26px;
  z-index: 1;
  height: 85px;
  position: absolute;
  transform: rotate(-45deg);
  background-color: transparent;
}
@keyframes rotate-circle {
  0% {
    transform: rotate(-45deg);
  }
  5% {
    transform: rotate(-45deg);
  }
  12% {
    transform: rotate(-405deg);
  }
  100% {
    transform: rotate(-405deg);
  }
}
@keyframes icon-line-tip {
  0% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  54% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }
  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }
  100% {
    width: 25px;
    left: 14px;
    top: 46px;
  }
}
@keyframes icon-line-long {
  0% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  84% {
    width: 55px;
    right: 0px;
    top: 35px;
  }
  100% {
    width: 47px;
    right: 8px;
    top: 38px;
  }
}
</style>
