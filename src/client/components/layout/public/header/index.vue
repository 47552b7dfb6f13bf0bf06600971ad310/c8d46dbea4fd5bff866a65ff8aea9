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
    <LayoutPublicNavSlide class="hidden sm:flex xl:hidden" />
    
    <NuxtLink to="/" class="sm:ml-3 xl:ml-0">
      <UiLogo/>
    </NuxtLink>

    <UiFlex class="ml-auto gap-1">
      <AuthSign v-if="!authStore.isLogin"  />
      <LazyAuthHeader v-else />
      <SocketNavSlide class="flex lg:hidden" v-if="!authStore.isLogin" />
    </UiFlex>

    <Transition name="slide-right-left">
      <UiFlex class="absolute right-0" style="top: calc(var(--header-size) - 0.5px)" v-if="route.name != 'index'">
        <PlayBtn :custom="true" class="lg:hidden" >
          <template #default="{ open }">
            <UButton 
              class="color-blue-light bg-anim-light !text-white rounded-r-none" 
              color="gray"
              icon="i-ion-game-controller" 
              size="md"
              @click="open"
            >
              Chơi Ngay
            </UButton>
          </template>
        </PlayBtn>
      </UiFlex>
    </Transition>
  </header>
</template>

<script setup>
const authStore = useAuthStore()
const route = useRoute()
</script>