<template>
  <UiFlex>
    <UChip color="rose" :show="count > 0" :text="count">
      <UButton icon="i-wpf-online" square size="lg" color="gray" @click="isOpen = true"></UButton>
    </UChip>

    <USlideover v-model="isOpen" class="safe-area-top" :ui="{
      width: 'w-screen max-w-[330px]'
    }">
      <SocketNav v-if="!!isOpen" class="h-full" has-close @close="isOpen = false"/>
    </USlideover>
  </UiFlex>
</template>

<script setup>
const socketStore = useSocketStore()

const isOpen = ref(false)

const count = computed(() => {
  return socketStore.notify.single.new
})

watch(() => socketStore.slideModal, (val) => !!val && (isOpen.value = true))
watch(() => isOpen.value, (val) => {
  if(!val){
    socketStore.setSlideModal(false)
    socketStore.changeTab('chat-global')
  }
})
</script>