<template>
  <UCard class="relative @container rounded-2xl overflow-hidden" :ui="{ body: { padding: 'p-0 sm:p-0'} }">
    <UiFlex items="start">
      <UiImg :src="config.og_image" w="16" h="9" img-size="700px" class="bg-card @3xl:max-w-[55%] @3xl:min-w-[55%] @3xl:w-[55%] w-full" />

      <div class="@3xl:p-6 p-4 @3xl:relative absolute bottom-0 bg-gray-blur backdrop-blur-sm w-full">
        <UiText weight="bold" class="line-clamp-3 mb-0.5 text-base @xl:text-xl @3xl:text-3xl @3xl:text-gray-300">
          {{ config.name }}
        </UiText>
        
        <UiText color="gray" class="line-clamp-1 @xl:line-clamp-3 italic text-xs @xl:text-sm @2xl:text-base @3xl:text-lg">
          {{ config.description }}
        </UiText>
      </div>
    </UiFlex>

    <PlayBtn class="absolute top-1 right-1 @xl:bottom-1 @3xl:top-auto"></PlayBtn>
  </UCard>
</template>

<script setup>
const configStore = useConfigStore()
const config = computed(() => configStore.config)
</script>