<template>
  <UButton class="color-blue-light bg-anim-light relative pr-10" :size="size" >
    <span class="text-white">{{ authStore.profile.currency.diamond > 99999999 ? miniMoney(authStore.profile.currency.diamond) : toMoney(authStore.profile.currency.diamond) }}</span> 
    <UiIcon name="i-ic-sharp-diamond" size="6" class="absolute right-2"/>
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