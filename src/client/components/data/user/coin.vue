<template>
  <UButton color="gray" class="relative pr-10" :size="size" >
    <span class="text-white" v-if="authStore.profile.currency.coin == 0">Nạp Ngay</span>
    <span class="text-white" v-else>
      <UiNumber :num="authStore.profile.currency.coin">
        <template #default="{ display }">
          {{ display > 9999999 ? miniMoney(display) : toMoney(display) }}
        </template>
      </UiNumber>
    </span> 
    <UiIcon name="i-game-icons-two-coins" size="6" class="absolute right-2"/>
  </UButton>
</template>

<script setup>
const { toMoney, miniMoney } = useMoney()
const props = defineProps({
  size: {
    type: String,
    default: 'lg'
  }
})
const authStore = useAuthStore()
</script>