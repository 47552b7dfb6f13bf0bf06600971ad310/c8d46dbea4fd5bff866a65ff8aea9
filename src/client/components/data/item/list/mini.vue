<template>
  <UiFlex :justify="justify" class="gap-2 min-h-[48px]">
    <UiText size="xs" class="text-gray-600 italic" v-if="!items || items.length == 0">{{empty || 'Chưa có vật phẩm'}}</UiText>
    
    <UAvatarGroup :max="max" :size="size" :ui="{ ring: 'ring-0' }" class="cursor-pointer" @click="onView">
      <UAvatar
        v-for="(data, index) in items" :key="index"
        :src="imgSrc(data.item?.item_image, data.item?.type)"
        :alt="data.item?.item_name"
        :chip-text="'x'+useMoney().miniMoney(data.amount)"
        :chip-color="amountColor"
        chip-position="bottom-right"
        :ui="{
          chip: {
            base: 'bg-gray-600 dark:bg-gray-700 text-white dark:text-white ring-0 font-bold p-1.5 py-2'
          }
        }"
      />
    </UAvatarGroup>

    <UModal v-model="modal">
      <UiContent title="Thông Tin" sub="Danh sách chi tiết các vật phẩm" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal = false"></UButton>
        </template>

        <div class="bg-gray ring-1 ring-gray-800 rounded-2xl p-4">
          <DataItemList :items="items" class="justify-center"/>
        </div>
      </UiContent>
    </UModal>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()

const props = defineProps({
  items: Array,
  empty: String,
  justify: String,
  max: { type: Number, default: 5 },
  size: { type: String, default: 'lg' },
  amountColor: { type: String, default: 'gray' },
  noView: { type: Boolean, default: false }
})

const modal = ref(false)

const typeFormat = {
  'game_recharge': 'recharge',
  'game_item': 'item',
  'coin': 'coin',
  'wheel': 'wheel',

  'empty-gift': 'empty-gift',
  'wheel_lose': 'wheel_lose'
}

const imgSrc = (src, type) => {
  if(!!src){
    const imagePath = configStore.config.game.image
    return !imagePath ? src : `${imagePath}/${src}`
  }
  else {
    if(!!type) return `/images/icon/${typeFormat[type]}.png`
    return null
  }
}

const onView = () => {
  if(!!props.noView) return
  modal.value = true
}
</script>