<template>
  <header class=" 
    fixed safe-area-top
    top-0 left-0 z-50 
    w-full
    bg-gray-1000 
    flex items-center
    h-[var(--header-size)] max-h-[var(--header-size)]
    px-4
    md:gap-1 gap-0.5
  ">
    <LayoutPublicNavSlide class="flex xl:hidden" />
    
    <NuxtLink to="/">
      <UiLogo class="hidden sm:flex sm:ml-2 xl:ml-0"/>
    </NuxtLink>

    <UiFlex class="ml-auto gap-1">
      <AuthSign v-if="!authStore.isLogin"  />
      <LazyAuthHeader v-else />
      <SocketNavSlide class="flex lg:hidden" />
    </UiFlex>
  </header>
</template>

<script setup>
const authStore = useAuthStore()
</script>