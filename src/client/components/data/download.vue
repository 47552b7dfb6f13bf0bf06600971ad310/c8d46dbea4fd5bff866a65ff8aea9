<template>
  <UiFlex class="box-green rounded-2xl overflow-hidden gap-2 py-2 px-1">
    <UiFlex class="inline-flex h-[90%] w-[20%] md:w-[30%] ml-2">
      <UiImg src="/images/icon/download.png" w="1" h="1" img-size="200px" class="w-full" />
    </UiFlex>

    <div>
      <UiText class="text-xs md:text-base mb-1">Chơi Nhanh</UiText>
      <UiFlex class="gap-2">
        <UiIcon name="i-bx-world" class="cursor-pointer w-6 h-6 md:w-8 md:h-8" v-if="!configStore.config.game.mobile" @click="start()"/>
        <UiIcon name="i-bxl-android" class="cursor-pointer w-6 h-6 md:w-8 md:h-8" @click="download(configStore.config.download.apk)"/>
        <UiIcon name="i-bxl-apple" class="cursor-pointer w-6 h-6 md:w-8 md:h-8" @click="download(configStore.config.download.ios)" />
      </UiFlex>
    </div>
  </UiFlex>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const authStore = useAuthStore()

const download = (url) => {
  if(!url) return useNotify().error('Link tải chưa sẵn sàng, vui lòng quay lại sau')

  const link = document.createElement('a')
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const start = async () => {
  try {
    if(!authStore.isLogin) return authStore.setModal(true)
    await useAPI('game/public/start')
    if(!!runtimeConfig.public.dev) navigateTo('/play')
    else location.href = `http://game.${runtimeConfig.public.domain}/play`
  }
  catch (e) {
  }
}
</script>