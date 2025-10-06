<template>
  <UiFlex justify="center" class="w-full h-full fixed top-0 left-0 bg-card">
    <div class="p-6 max-w-[500px]">
        <UiText weight="bold" class="text-md md:text-xl mb-4">
            Chào mừng đến với <span class="text-primary">{{ configStore.config.name }}</span>, tham gia ngay cùng chúng tôi
        </UiText>

        <AuthSignIn @done="start" @up="tabItem = 1" v-if="tabItem == 0" />
        <AuthSignUp @done="start" @in="tabItem = 0" v-if="tabItem == 1" />
    </div>
  </UiFlex>
</template>

<script setup>
definePageMeta({
  layout: 'ads',
})

const configStore = useConfigStore()
const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const authStore = useAuthStore()

const modal = ref(false)
const tabItem = ref(0) 

const start = async () => {
  try {
    await useAPI('game/public/start')

    if(!!runtimeConfig.public.dev) navigateTo('/play/apk')
    else location.href = `http://game.${runtimeConfig.public.domain}/play/apk`
  }
  catch (e) {
    start()
  }
}

onMounted(() => {
  if(!!authStore.isLogin) return start()
  else modal.value = true
})
</script>