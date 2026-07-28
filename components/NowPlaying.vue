<script setup lang="ts">
import {
  IconLink,
  IconMusic,
  IconPlayerPlay,
  IconPlayerPause,
  IconVolume,
  IconExternalLink,
  IconRefresh,
} from "@tabler/icons-vue";

interface SpotifyNowPlaying {
  isPlaying: boolean;
  songUrl: string;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  progress: number;
  duration: number;
}

const nowPlaying = ref<SpotifyNowPlaying | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const localProgress = ref(0);
const lastFetchTime = ref(Date.now());
const isHovering = ref(false);

function formatDuration(ms: number) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

const progressPercentage = computed(() => {
  if (!nowPlaying.value) return 0;
  if (nowPlaying.value.isPlaying) {
    return (localProgress.value / nowPlaying.value.duration) * 100;
  } else {
    return (nowPlaying.value.progress / nowPlaying.value.duration) * 100;
  }
});

const currentProgress = computed(() => {
  if (!nowPlaying.value) return 0;
  if (nowPlaying.value.isPlaying) {
    return localProgress.value;
  } else {
    return nowPlaying.value.progress;
  }
});

async function fetchNowPlaying() {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await $fetch("/api/spotify");
    lastFetchTime.value = Date.now();
    nowPlaying.value = response as SpotifyNowPlaying;
    if (nowPlaying.value) {
      localProgress.value = nowPlaying.value.progress;
    }
  } catch (err) {
    console.error("Error fetching Spotify data:", err);
    error.value = "Failed to load Spotify data";
  } finally {
    isLoading.value = false;
  }
}

let progressInterval: NodeJS.Timeout;
function startProgressUpdater() {
  clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if (nowPlaying.value && nowPlaying.value.isPlaying) {
      const elapsed = Date.now() - lastFetchTime.value;
      localProgress.value = Math.min(
        nowPlaying.value.progress + elapsed,
        nowPlaying.value.duration
      );
      if (localProgress.value >= nowPlaying.value.duration) {
        fetchNowPlaying();
      }
    }
  }, 1000);
}

let refreshInterval: NodeJS.Timeout;
onMounted(() => {
  fetchNowPlaying().then(() => {
    startProgressUpdater();
  });
  refreshInterval = setInterval(() => {
    fetchNowPlaying();
  }, 30000);

  // Pause timers when tab is not visible to avoid wasted polling
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

function handleVisibilityChange() {
  if (document.hidden) {
    clearInterval(refreshInterval);
    clearInterval(progressInterval);
  } else {
    // Resume: fetch fresh data and restart timers
    fetchNowPlaying().then(() => {
      startProgressUpdater();
    });
    refreshInterval = setInterval(() => {
      fetchNowPlaying();
    }, 30000);
  }
}

onBeforeUnmount(() => {
  if (refreshInterval) clearInterval(refreshInterval);
  if (progressInterval) clearInterval(progressInterval);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>
<template>
  <Section
    anchor="now-playing"
    kicker="Listening"
    title="Now playing"
    subtitle="What I'm listening to on Spotify, live."
  >
    <UCard
      class="spotify-card relative overflow-hidden"
      :ui="{
        body: { padding: 'p-0' },
        background: 'bg-white dark:bg-sand-900',
        ring: 'ring-1 ring-sand-200 dark:ring-sand-800',
      }"
    >
      <!-- Loading skeleton -->
      <template v-if="isLoading">
        <div class="flex items-center gap-4 p-4 sm:p-5">
          <Skeleton variant="custom" class="h-24 w-24 flex-shrink-0 rounded-xl sm:h-32 sm:w-32" />
          <div class="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton variant="line" class="h-4 w-2/3" />
            <Skeleton variant="line" class="h-3 w-1/2" />
            <Skeleton variant="line" class="h-3 w-1/3" />
            <Skeleton variant="custom" class="mt-2 h-2 w-full rounded-full" />
          </div>
        </div>
      </template>

      <!-- Error State -->
      <template v-else-if="error">
        <div class="flex flex-col items-center justify-center gap-3 p-6 sm:p-8">
          <div class="error-icon rounded-full bg-red-50 p-3 dark:bg-red-950/30">
            <IconVolume class="h-7 w-7 text-red-500 sm:h-8 sm:w-8" aria-hidden="true" />
          </div>
          <p class="text-center text-sm font-medium text-sand-700 dark:text-sand-300">Couldn't load Spotify. Try again.</p>
          <UButton
            size="sm"
            @click="fetchNowPlaying"
            icon="i-tabler-refresh"
            variant="soft"
            class="mt-1"
          >
            Try again
          </UButton>
        </div>
      </template>

      <!-- Not Playing State -->
      <template v-else-if="nowPlaying && !nowPlaying.isPlaying">
        <div class="flex flex-col items-center justify-center gap-3 p-6 sm:p-8">
          <div class="silent-icon rounded-full bg-sand-100 p-3 dark:bg-sand-800">
            <IconVolume class="h-7 w-7 text-sand-500 sm:h-8 sm:w-8" aria-hidden="true" />
          </div>
          <p class="max-w-xs px-2 text-center text-sm text-sand-600 dark:text-sand-400">
            Not playing anything right now.
          </p>
          <UButton
            size="xs"
            to="https://open.spotify.com/"
            target="_blank"
            variant="ghost"
            color="gray"
            class="mt-1 text-xs"
          >
            Open Spotify
            <template #trailing>
              <IconExternalLink class="h-3 w-3" aria-hidden="true" />
            </template>
          </UButton>
        </div>
      </template>

      <!-- Playing State -->
      <template v-else-if="nowPlaying">
        <div class="relative">
          <!-- Background album art (blurred) -->
          <div class="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
            <NuxtImg
              :src="nowPlaying.albumImageUrl"
              alt=""
              class="h-full w-full scale-110 object-cover opacity-20 blur-2xl"
              format="webp"
              loading="lazy"
              width="256"
              height="256"
            />
            <div class="absolute inset-0 bg-gradient-to-b from-white to-white/95 dark:from-sand-900/80 dark:to-sand-900/95"></div>
          </div>

          <!-- Content -->
          <div class="relative z-10 flex flex-col p-0 sm:flex-row">
            <!-- Album Art -->
            <div class="group relative h-36 w-full flex-shrink-0 sm:h-32 sm:w-32">
              <NuxtImg
                :src="nowPlaying.albumImageUrl"
                :alt="`Album art for ${nowPlaying.album}`"
                class="h-full w-full object-cover shadow-md transition-transform duration-300 group-hover:scale-[1.02] sm:rounded-l-2xl"
                width="128"
                height="128"
                format="webp"
              />

              <!-- Play indicator overlay -->
              <div v-if="nowPlaying.isPlaying" class="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 group-hover:bg-black/30">
                <div class="music-equalizer" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>

            <!-- Song Info -->
            <div class="flex min-w-0 flex-1 flex-col justify-between p-4">
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="flex items-center" aria-hidden="true">
                    <IconPlayerPlay
                      v-if="nowPlaying.isPlaying"
                      class="h-4 w-4 animate-pulse text-emerald-500"
                    />
                    <IconPlayerPause v-else class="h-4 w-4 text-sand-500" />
                  </span>
                  <a
                    :href="nowPlaying.songUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-1 truncate text-sm font-semibold text-sand-900 transition-colors duration-200 hover:text-emerald-600 dark:text-sand-100 dark:hover:text-emerald-400 sm:text-base"
                  >
                    {{ nowPlaying.title }}
                    <IconExternalLink class="inline-block h-3 w-3 flex-shrink-0 opacity-50" aria-hidden="true" />
                  </a>
                </div>
                <p class="truncate text-xs text-sand-600 dark:text-sand-400 sm:text-sm">
                  {{ nowPlaying.artist }}
                </p>
                <p class="truncate text-xs text-sand-500 dark:text-sand-500">
                  {{ nowPlaying.album }}
                </p>
              </div>

              <div class="mt-2">
                <!-- Progress bar -->
                <div
                  class="h-1.5 w-full overflow-hidden rounded-full bg-sand-200/80 backdrop-blur-sm dark:bg-sand-700/70"
                  role="progressbar"
                  :aria-valuenow="Math.round(progressPercentage)"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label="Track progress"
                >
                  <div
                    class="h-full rounded-full bg-emerald-500 transition-all duration-150 ease-out"
                    :style="{ width: `${progressPercentage}%` }"
                  />
                </div>

                <!-- Time display -->
                <div class="tnum mt-1 flex justify-between font-mono text-[10px] text-sand-500 sm:text-xs">
                  <span>{{ formatDuration(currentProgress) }}</span>
                  <span>{{ formatDuration(nowPlaying.duration) }}</span>
                </div>
              </div>
            </div>

            <!-- Spotify Logo -->
            <a
              href="https://open.spotify.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="absolute right-3 top-3 opacity-50 transition-opacity duration-300 hover:opacity-100"
              aria-label="Open in Spotify"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                />
              </svg>
            </a>
          </div>
        </div>
      </template>
    </UCard>
  </Section>
</template>

<style scoped>
/* Animated equalizer bars (accent-tinted) shown while playing. */
.music-equalizer {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  height: 16px;
}
.music-equalizer span {
  display: block;
  width: 2px;
  border-radius: 1px;
  background: #fff;
  opacity: 0.9;
  animation: eq 1.2s infinite ease-in-out;
}
.music-equalizer span:nth-child(1) { height: 60%; animation-delay: 0s; }
.music-equalizer span:nth-child(2) { height: 100%; animation-delay: 0.3s; }
.music-equalizer span:nth-child(3) { height: 75%; animation-delay: 0.6s; }

@keyframes eq {
  0%, 100% { height: 15%; }
  50% { height: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .music-equalizer span { animation: none; }
}
</style>