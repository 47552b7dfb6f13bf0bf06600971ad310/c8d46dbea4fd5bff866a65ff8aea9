<template>
  <UiFlex class="box-blue rounded-2xl overflow-hidden gap-2 py-2 px-1">
    <UiFlex class="inline-flex h-[90%] w-[20%] md:w-[30%] ml-2">
      <UiImg src="/images/icon/support.png" w="1" h="1" img-size="200px" class="w-full" />
    </UiFlex>

    <div>
      <UiText class="text-xs md:text-base mb-1">Mạng Xã Hội</UiText>
      <UiFlex class="gap-2">
        <UiImg 
          class="max-w-[25px] max-h-[25px] md:max-w-[30px] md:max-h-[30px] cursor-pointer rounded-full"
          :src="`/images/social/facebook.png`"
          w="1" h="1"
          imgW="90" imgH="90"
          alt="facebook"
          @click="open(configStore.config.social.facebook)"
        ></UiImg>

        <UiImg 
          class="max-w-[25px] max-h-[25px] md:max-w-[30px] md:max-h-[30px] cursor-pointer rounded-full"
          :src="`/images/social/messenger.png`"
          w="1" h="1"
          imgW="90" imgH="90"
          alt="messenger"
          @click="open(configStore.config.social.messenger)"
        ></UiImg>

        <UiImg 
          class="max-w-[25px] max-h-[25px] md:max-w-[30px] md:max-h-[30px] cursor-pointer rounded-full"
          :src="`/images/social/zalo.png`"
          w="1" h="1"
          imgW="90" imgH="90"
          alt="zalo"
          @click="open(configStore.config.social.zalo)"
        ></UiImg>
      </UiFlex>
    </div>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()

const open = (link) => {
  if(!link) return useNotify().error('Kênh hỗ trợ chưa sẵn sàng, vui lòng quay lại sau')
  useTo().openNewTab(link)
}
</script>