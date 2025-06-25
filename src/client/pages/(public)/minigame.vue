<template>
  <div>
    <UiMinibanner title="Minigame" sub="Các trò chơi nhỏ khác" type="minigame" class="mb-4" />

    <DataEmpty text="Minigame này hiện đang bảo trì" v-if="!active" />

    <div v-else>
      <ClientOnly>
        <swiper-container 
          :freeMode="true"
          :spaceBetween="5"
          slidesPerView="auto"
          class="rounded-2xl overflow-hidden mb-4"
        >
          <swiper-slide v-for="(option, index) in items" :key="index" class="!inline-block !w-auto">
            <UiButtonSelect
              @click="select(option.type)"
              :active="!!tab && tab == option.type"
              class="p-4 min-w-[120px] md:min-w-[145px]"
            >
              <UiFlex type="col">
                <UiIcon :name="option.icon" class="h-6 w-6 md:h-8 md:w-8 mb-1" />
                <UiText weight="bold" class="text-white text-xs md:text-sm">{{ option.label }}</UiText>
              </UiFlex>
            </UiButtonSelect>
          </swiper-slide>
        </swiper-container >
      </ClientOnly>

      <MainMinigameWheel v-if="tab === 'wheel'" />
      <MainMinigameDice v-if="tab === 'dice'" />
      <MainMinigameEgg v-if="tab === 'egg'" />
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const configStore = useConfigStore()
const show = ref(configStore.config.menu.minigame)

useSeoMeta({
  title: () => `Minigame - ${configStore.config.name}`,
  ogTitle: () => `Minigame - ${configStore.config.name}`,
  description: () => `Các trò chơi nhỏ khác`,
  ogDescription: () => `Các trò chơi nhỏ khác`,
})

const items = computed(() => {
  const list =  []
  if(!!show.value.wheel) list.push({ label: 'Vòng Quay', type: 'wheel', icon: 'i-mynaui-wheel' })
  if(!!show.value.dice) list.push({ label: 'Xúc Xắc', type: 'dice', icon: 'i-fa6-solid-dice' })
  if(!!show.value.egg) list.push({ label: 'Đập Trứng', type: 'egg', icon: 'i-mdi-egg-easter' })
  return list
})
const tab = ref(route.query.type ? route.query.type : (!!items.value[0] ? items.value[0].type : null))

const select = (type) => {
  navigateTo({ path: route.fullPath, query: { type: type }})
  tab.value = type
}
const active = computed(() => {
  if(items.value.length === 0) return false
  if(!!route.query.type){
    const shop = items.value.find(item => item.type === route.query.type)
    if(!shop) return false
  }
  return true
})

watch(() => route.query.type, (val) => tab.value = val)
</script>