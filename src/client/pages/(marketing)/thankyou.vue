<template>
  <UiFlex type="col" justify="center" class="h-full" @click="start" v-if="authStore.isLogin">
    <UiIcon name="i-bxs-wink-smile" class="mb-4" size="20" color="primary" />
    <UiText color="primary" weight="bold" size="3xl" class="mb-4 px-2">Xin chào, {{ authStore.profile.username }}</UiText>
    <UiText class="mb-4 px-6" align="center">Chào mừng đến với {{ configStore.config.name }}, chúc bạn có những phút giây vui vẻ</UiText>
    <UiIcon color="primary" name="i-bx-loader-alt" class="animate-spin mb-1" size="5" />
    <UiText color="gray" size="sm">Đang chuyển hướng...</UiText>
  </UiFlex>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const authStore = useAuthStore()
const route = useRoute()

definePageMeta({
  layout: false,
  middleware: 'user'
})

useSeoMeta({
  title: () => `Thank You`,
  robots: 'none'
})

useHead({
  script: [
    { children: `fbq('track', 'ThankYou');`}
  ],
})

const start = async () => {
  try {
    if(!!configStore.config.thankyou.link) return location.href = configStore.config.thankyou.link
    else {
      if(!!configStore.config.game.mobile) return location.href = '/'

      await useAPI('game/public/start')
      if(!!runtimeConfig.public.dev) navigateTo('/play')
      else location.href = `http://game.${runtimeConfig.public.domain}/play`
    }
  }
  catch (e) {
    location.href = '/'
  }
}

onMounted(() => {
  setTimeout(() => {
    if(route.query.test) return
    start()
  }, 2000)
})
</script>