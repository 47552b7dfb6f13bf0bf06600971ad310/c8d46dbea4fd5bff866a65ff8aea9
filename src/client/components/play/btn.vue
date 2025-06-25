<template>
  <div>
    <UButton 
      class="color-blue-light bg-anim-light" 
      icon="i-ion-game-controller" 
      :block="block" 
      :size="size || 'lg'" 
      @click="modal = true"
    >
      {{ text || 'Chơi Ngay' }}
    </UButton>

    <UModal v-model="modal" :ui="{ width: 'sm:max-w-[400px]' }">
      <UiContent title="Chơi Ngay" sub="Chọn hệ điều hành của bạn" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square @click="modal = false"></UButton>
        </template>

        <UiFlex justify="center" class="bg-gray-900 cursor-pointer w-full rounded-2xl p-4 gap-2 mb-1" @click="playWeb()" v-if="!configStore.config.game.mobile">
          <UiIcon name="i-bx-world" size="8"></UiIcon>
          <UiText weight="semibold" size="lg">Trình Duyệt Web</UiText>
        </UiFlex>

        <UiFlex justify="between" wrap>
          <UiFlex justify="center" class="bg-green-500 cursor-pointer w-[49%] rounded-2xl p-4 gap-2" @click="download(config.download.apk)">
            <UiIcon name="i-bxl-android" size="8"></UiIcon>
            <UiText weight="semibold" size="lg">Android</UiText>
          </UiFlex>

          <UiFlex justify="center" class="bg-black/70 cursor-pointer w-[49%] rounded-2xl p-4 gap-2" @click="download(config.download.ios)">
            <UiIcon name="i-bxl-apple" size="8"></UiIcon>
            <UiText weight="semibold" size="lg">IOS</UiText>
          </UiFlex>
        </UiFlex>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const props = defineProps(['block', 'text', 'size'])

const loading = ref(false)
const modal = ref(false)

const authStore = useAuthStore()
const configStore = useConfigStore()
const config = computed(() => configStore.config)

const download = (link) => {
  if(!link) return useNotify().error('Chúng tôi đang cập nhật link tải, vui lòng quay lại sau')
  window.open(link, '_blank'); 
}

const playWeb = async () => {
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