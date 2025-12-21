<template>
  <div class="min-h-screen bg-[#0B0E14] flex justify-center items-center relative overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
    </div>
    
    <div class="w-full max-w-md px-4 relative z-10">
      <slot />
    </div>
  </div>
</template>
