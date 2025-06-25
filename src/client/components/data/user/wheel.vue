<template>
  <UButton class="color-blue-light bg-anim-light relative pr-10" :size="size" >
    <span class="text-white">{{ authStore.profile.currency.wheel > 99999999 ? miniMoney(authStore.profile.currency.wheel) : toMoney(authStore.profile.currency.wheel) }}</span> 
    <UiIcon name="i-lucide-lab-wheel" size="6" class="absolute right-2"/>
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