<template>
  <div>
    <UButton 
      v-if="!custom"
      class="color-blue-light bg-anim-light" 
      icon="i-ion-game-controller" 
      :block="block" 
      :size="size || 'lg'" 
      @click="open"
    >
      <UiText mini>{{ text || 'Chơi Ngay' }}</UiText>
    </UButton>

    <slot :open="open"></slot>

    <UModal v-model="modal" preventClose :ui="{ width: 'sm:max-w-[400px]' }">
      <UiContent title="Chơi Ngay" sub="Chọn hệ điều hành của bạn" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square @click="modal = false"></UButton>
        </template>

        <UiFlex justify="center" class="bg-gray-900 cursor-pointer w-full rounded-2xl p-4 gap-2 mb-1" @click="playWeb()" v-if="!configStore.config.game.mobile">
          <UiIcon name="i-bx-world" size="8"></UiIcon>
          <UiText weight="semibold" size="lg">Trình Duyệt Web</UiText>
        </UiFlex>

        <UiFlex justify="between" wrap>
          <UiFlex justify="center" class="bg-green-500 cursor-pointer w-[49%] rounded-2xl p-4 gap-2" @click="download(configStore.config.download.apk, 'android')">
            <UiIcon name="i-bxl-android" size="8"></UiIcon>
            <UiText weight="semibold" size="lg">Android</UiText>
          </UiFlex>

          <UiFlex justify="center" class="bg-black/70 cursor-pointer w-[49%] rounded-2xl p-4 gap-2" @click="download(configStore.config.download.ios, 'ios')">
            <UiIcon name="i-bxl-apple" size="8"></UiIcon>
            <UiText weight="semibold" size="lg">IOS</UiText>
          </UiFlex>
        </UiFlex>
      </UiContent>
    </UModal>

    <UModal v-model="iosPWA" preventClose :ui="{ width: 'sm:max-w-[400px]' }">
      <UiContent title="IPhone và IPad" sub="Hướng dẫn cài đặt trò chơi toàn màn hình" class="bg-card rounded-2xl p-4">
         <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square @click="iosPWA = false"></UButton>
        </template>

        <UiFlex class="flex gap-1 mb-2" wrap>
          1. Nhấn nút 
          <UiIcon name="i-ion-share-outline" color="yellow" size="5" />
          <strong class="text-yellow-500">Chia sẻ</strong> 
        </UiFlex>

        <UiFlex class="flex gap-1" wrap>
          2. Chọn 
          <UiIcon name="i-icon-park-outline-add" color="yellow" size="5" />
          <strong class="text-yellow-500">Thêm vào Màn hình chính</strong> 
        </UiFlex>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const authStore = useAuthStore()

const loading = ref(false)
const modal = ref(false)
const iosPWA = ref(false)

const open = () => {
  modal.value = true
}

const download = async (url, type) => {
  if(type == 'ios' && !configStore.config.game.mobile) return iosPWA.value = true
  if(type == 'android' && !configStore.config.game.mobile && !!configStore.installPrompt && !url){
    await configStore.installPrompt.prompt()
    configStore.setInstallPrompt(null)
  }

  if(!url) return useNotify().error('Chúng tôi đang cập nhật link tải, vui lòng quay lại sau')
  const link = document.createElement('a')
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const playWeb = async () => {
  try {
    if(!authStore.isLogin) return authStore.setModal(true)

    loading.value = true
    await useAPI('game/public/start')

    loading.value = false
    if(!!runtimeConfig.public.dev) navigateTo('/play')
    else location.href = `http://game.${runtimeConfig.public.domain}/play`
  }
  catch (e) {
    loading.value = false
  }
}
</script>