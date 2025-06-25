<template>
  <UiFlex :justify="justify" class="gap-2 min-h-[48px]">
    <UiText size="xs" class="text-gray-600 italic" v-if="!items || items.length == 0">{{empty || 'Chưa có vật phẩm'}}</UiText>
    
    <UAvatarGroup :max="max" :size="size" :ui="{ ring: 'ring-0' }">
      <UAvatar
        v-for="(item, index) in items" :key="index"
        :src="imgSrc(item.image, item.type)"
        :alt="item.name"
        :chip-text="'x'+useMoney().miniMoney(item.amount)"
        :chip-color="amountColor"
        chip-position="bottom-right"
        :ui="{
          chip: {
            base: 'bg-gray-600 dark:bg-gray-700 text-white dark:text-white ring-0 font-bold p-1.5 py-2'
          }
        }"
      />
    </UAvatarGroup>
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
  amountColor: { type: String, default: 'gray' }
})

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
</script>