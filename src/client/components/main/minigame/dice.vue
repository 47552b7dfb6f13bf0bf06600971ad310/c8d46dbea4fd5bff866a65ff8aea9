<template>
  <div>
    <UiFlex justify="between" class="gap-2 mb-8">
      <UiTitle name="Xí Ngầu" icon="i-game-icons-rolling-dices" />
      <DataUserCoin v-if="!!authStore.isLogin" />
    </UiFlex>

    <DataMinigameDiceBox :rolling="rolling" :dices="dices" class="mb-8" />
    <DataMinigameDiceJar :jar="jar" class="mb-8" />

    <div class="grid grid-cols-12 gap-2 md:gap-6">
      <UiFlex class="col-span-6 gap-0 md:gap-2 relative" justify="center" v-for="i in 6" :key="i" >
        <UiIcon :name="`i-bxs-dice-${i}`" class="min-h-10 min-w-10 rounded-full !text-white"/>
        <UiFlex class="relative grow">
          <UButton color="gray" icon="i-bx-minus" class="absolute left-0.5 z-[2]" @click="minusFast(i)"></UButton>
          <UInput size="md" class="grow " :ui="{ padding: { md: 'pl-[45px]' }}" :model-value="miniMoney(state[`dice${i}`])" readonly disabled></UInput>
          <UButton color="gray" icon="i-bx-plus" class="absolute right-0.5 z-[2]" @click="plusFast(i)"></UButton>
        </UiFlex>
      </UiFlex>
    </div>

    <UiFlex class="mt-6 gap-1">
      <USelectMenu 
        v-model="fastCoin" 
        :options="[10000, 100000, 1000000, 10000000, 100000000]"
        class="mr-auto"
        size="sm"
      >
        <template #label>{{ miniMoney(fastCoin) }}</template>
        <template #option="{ option }">{{ miniMoney(option) }}</template>
      </USelectMenu>

      <UButtonGroup v-if="coinPlay > 0" >
        <UButton icon="i-game-icons-two-coins" color="rose"></UButton>
        <UButton color="gray">- {{ miniMoney(coinPlay) }}</UButton>
      </UButtonGroup>

      <UButton 
        color="yellow"  
        :loading="loading" 
        @click="start"
      >{{ !loading ? 'Quay Ngay' : '' }}</UButton>
    </UiFlex>

    <div class="mt-8" v-if="!!authStore.isLogin && !!history">
      <UiTitle name="Lịch Sử Chơi" icon="i-material-symbols-history" class="mb-4" />
      <DataMinigameDiceHistory :reload="reload" />
    </div>
  </div>
</template>

<script setup>
const { toMoney, miniMoney } = useMoney()

const authStore = useAuthStore()
watch(() => authStore.isLogin, (val) => !!val && getConfig())

const props = defineProps({
  history: { type: Boolean, default: true }
})

const modal = ref({
  limit: false
})

const loading = ref(false)
const reload = ref(0)
const rolling = ref(false)
const fastCoin = ref(10000)
const dices = ref([0,0,0])
const jar = ref(0)

const state = ref({
  dice1: null,
  dice2: null,
  dice3: null,
  dice4: null,
  dice5: null,
  dice6: null
})

const coinPlay = computed(() => {
  let coin = 0
  for (let i = 1; i < 7; i++){
    coin = coin + (state.value[`dice${i}`] || 0)
  }
  return coin
})

const minusFast = (i) => {
  state.value[`dice${i}`] = state.value[`dice${i}`] - fastCoin.value
  if(state.value[`dice${i}`] < 0) state.value[`dice${i}`] = 0
}

const plusFast = (i) => {
  state.value[`dice${i}`] = state.value[`dice${i}`] + fastCoin.value
}

const onRolling = (data) => {
  rolling.value = true

  setTimeout(() => {
    rolling.value = false
    setTimeout(() => {
      dices.value = data.dices
      jar.value = data.jar
      setTimeout(() => {
        reload.value++
        loading.value = false
      }, 1050)
    }, 50)
  }, 2000)
}

const start = async () => {
  try {
    if(!authStore.isLogin) return useNotify().error('Vui lòng đăng nhập trước để chơi')
    if(coinPlay.value <= 0) return useNotify().error('Vui lòng đặt cược trước')
    loading.value = true
    const data = await useAPI('minigame/dice/public/rolling', JSON.parse(JSON.stringify(state.value)))
    onRolling(data)
  }
  catch (e) {
    loading.value = false
  }
}

const getConfig = async () => {
  const data = await useAPI('minigame/dice/public/get')
  jar.value = data.jar?.now || 0
}

getConfig()
</script>