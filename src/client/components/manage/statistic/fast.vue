<template>
  <div>
    <UiFlex class="mb-2">
      <UTabs class="w-full sm:w-auto" v-model="tab" :items="[
        { label: 'Hôm nay' }, 
        { label: 'Hôm qua' }, 
        { label: 'Tháng này' }, 
        { label: 'Tháng trước' }, 
        { label: 'Tổng' }
      ]" />
    </UiFlex>
    
    <div class="grid grid-cols-12 gap-2">
      <UCard class="lg:col-span-4 sm:col-span-12 col-span-12" :ui="{ body: { padding: 'px-4 md:px-8 py-6 md:py-8' } }">
        <UiFlex justify="between">
          <UAvatar icon="i-bx-money-withdraw" size="2xl" class="mr-4" />
          <UiFlex type="col" items="end">
            <UiText color="gray" align="right">Doanh Thu</UiText>
            <USkeleton v-if="!!loading" class="w-28 h-7 md:h-8 xl:h-9" />
            <UiText v-else color="primary" align="right" weight="bold" class="text-xl md:text-2xl xl:text-3xl">{{ toMoney(data.payment) }}</UiText>
          </UiFlex>
        </UiFlex>
      </UCard>

      <UCard class="lg:col-span-4 sm:col-span-12 col-span-12" :ui="{ body: { padding: 'px-4 md:px-8 py-6 md:py-8' } }">
        <UiFlex justify="between">
          <UAvatar icon="i-bx-cart-alt" size="2xl" class="mr-4" />
          <UiFlex type="col" items="end">
            <UiText color="gray" align="right">Chi Tiêu</UiText>
            <USkeleton v-if="!!loading" class="w-28 h-7 md:h-8 xl:h-9" />
            <UiText v-else color="rose" align="right" weight="bold" class="text-xl md:text-2xl xl:text-3xl">- {{ toMoney(data.spend) }}</UiText>
          </UiFlex>
        </UiFlex>
      </UCard>

      <UCard class="lg:col-span-4 sm:col-span-12 col-span-12" :ui="{ body: { padding: 'px-4 md:px-8 py-6 md:py-8' } }">
        <UiFlex justify="between">
          <UAvatar icon="i-bxs-dollar-circle" size="2xl" class="mr-4" />
          <UiFlex type="col" items="end">
            <UiText color="gray" align="right">Lợi Nhuận</UiText>
            <USkeleton v-if="!!loading" class="w-28 h-7 md:h-8 xl:h-9" />
            <UiText v-else color="green" align="right" weight="bold" class="text-xl md:text-2xl xl:text-3xl">+ {{ toMoney(data.payment - data.spend) }}</UiText>
          </UiFlex>
        </UiFlex>
      </UCard>

      <UCard class="lg:col-span-4 sm:col-span-6 col-span-12" :ui="{ body: { padding: 'px-4 md:px-8 py-6 md:py-8' } }">
        <UiFlex justify="between">
          <UAvatar icon="i-bxs-face" size="2xl" class="mr-4" />
          <UiFlex type="col" items="end">
            <UiText color="gray" align="right">Đăng Nhập</UiText>
            <USkeleton v-if="!!loading" class="w-28 h-7 md:h-8 xl:h-9" />
            <UiText v-else color="primary" align="right" weight="bold" class="text-xl md:text-2xl xl:text-3xl">{{ toMoney(data.signin) }}</UiText>
          </UiFlex>
        </UiFlex>
      </UCard>

      <UCard class="lg:col-span-4 sm:col-span-6 col-span-12" :ui="{ body: { padding: 'px-4 md:px-8 py-6 md:py-8' } }">
        <UiFlex justify="between">
          <UAvatar icon="i-bxs-user-plus" size="2xl" class="mr-4" />
          <UiFlex type="col" items="end">
            <UiText color="gray" align="right">Đăng Ký</UiText>
            <USkeleton v-if="!!loading" class="w-28 h-7 md:h-8 xl:h-9" />
            <UiText v-else color="primary" align="right" weight="bold" class="text-xl md:text-2xl xl:text-3xl">{{ toMoney(data.signup) }}</UiText>
          </UiFlex>
        </UiFlex>
      </UCard>

      <UCard class="lg:col-span-4 sm:col-span-6 col-span-12" :ui="{ body: { padding: 'px-4 md:px-8 py-6 md:py-8' } }">
        <UiFlex justify="between">
          <UAvatar icon="i-bxs-user-account" size="2xl" class="mr-4" />
          <UiFlex type="col" items="end">
            <UiText color="gray" align="right">Trực tuyến</UiText>
            <USkeleton v-if="!!loading" class="w-28 h-7 md:h-8 xl:h-9" />
            <UiText v-else color="primary" align="right" weight="bold" class="text-xl md:text-2xl xl:text-3xl">{{ toMoney(socketStore.online) }}</UiText>
          </UiFlex>
        </UiFlex>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const { toMoney } = useMoney()
const socketStore = useSocketStore()

const loading = ref(false)
const tab = ref(0)
const data = ref({
  payment: 0,
  spend: 0,
  signin: 0,
  signup: 0
})

watch(tab, () => getData())

const type = computed(() => {
  if(tab.value == 0) return 'today'
  if(tab.value == 1) return 'yesterday'
  if(tab.value == 2) return 'month'
  if(tab.value == 3) return 'lastmonth'
  if(tab.value == 4) return 'total'
})

const getData = async () => {
  try {
    loading.value = true
    const get = await useAPI('statistic/fast', { 
      type: type.value
    })

    data.value = get
    loading.value = false
  }
  catch {
    return
  }
}

getData()
</script>