<template>
  <UiFlex class="
    fixed bottom-[-2px] left-[50%] -translate-x-[50%]
    w-auto max-w-full 
    overflow-hidden 
    z-50 
    box-blue py-2.5 px-6 rounded-t-2xl 
    shadow-2xl gap-4
  " justify="center">
    <NuxtLink :to="item.to" v-for="(item, index) in items" :key="index">
      <UiFlex type="col" justify="center" items="center" class="gap-1">
        <UiIcon :name="item.icon" size="6" />
        <UiText class="text-[10px] sm:text-xs" mini>{{ item.label }}</UiText>
      </UiFlex>
    </NuxtLink>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()
const show = ref(configStore.config.menu)

const items = computed(() => {
  const list =  []

  // Action
  if(!!show.value.action.payment){
    list.push({ label: 'Nạp Xu', to: '/payment', icon: 'bxs-credit-card' })
  }

  if(!!show.value.action.giftcode){
    list.push({ label: 'Giftcode', to: '/giftcode', icon: 'bxs-gift' })
  }

  // Shop
  if(!!show.value.shop.pack || !!show.value.shop.item || !!show.value.shop.recharge){
    list.push({ label: 'Cửa Hàng', to: '/shop', icon: 'bxs-shopping-bag' })
  }

  // Event
  if(!!show.value.event.referral || !!show.value.event.login || !!show.value.event.pay || !!show.value.event.spend || !!show.value.event.paymusty || !!show.value.event.paydays){
    list.push({ label: 'Sự Kiện', to: '/event', icon: 'bxs-calendar' })
  }

  // Mini Game
  if(!!show.value.minigame.wheel || !!show.value.minigame.dice){
    list.push({ label: 'MGame', to: '/minigame', icon: 'bxs-game' })
  }

  // Rank
  if(!!show.value.rank.level || !!show.value.rank.power){
    list.push({ label: 'Xếp Hạng', to: '/rank', icon: 'bxs-bar-chart-alt-2' })
  }

  return list
})
</script>