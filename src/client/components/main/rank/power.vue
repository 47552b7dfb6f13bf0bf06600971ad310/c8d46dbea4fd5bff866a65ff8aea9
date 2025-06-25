<template>
  <div class="mx-auto">
    <UForm :state="state" :validate="validate" @submit="submit">
      <UFormGroup name="server">
        <UiFlex>
          <SelectGameServer auto v-model="state.server" size="md" class="grow mr-1" />
          <UButton color="yellow" type="submit" size="md" :loading="loading.load">Xem Ngay</UButton>
        </UiFlex>
      </UFormGroup>
    </UForm>

    <UCard class="mb-4" v-if="list3.length > 0">
      <UiFlex justify="center" class="max-w-[400px] w-full mx-auto ">
        <UiFlex 
          v-if="list3[1]"
          justify="end" items="center"
          type="col"
          :style="`background: url(/images/rank/2.png) no-repeat center / 100% 100%; aspect-ratio: 9 / 15;`" 
          class="w-[30%] max-w-[30%] min-w-[30%] grow px-4 pb-[10%] relative top-[10px]"
        >
          <UiText mini align="center" class="max-w-[99%]" size="sm" weight="semibold">{{ list3[1].role_name }}</UiText>
          <UiText mini align="center" class="max-w-[99%]" weight="semibold">{{ useMoney().miniMoney(list3[1].power) }}</UiText>
        </UiFlex>

        <UiFlex 
          v-if="list3[0]"
          justify="end" items="center"
          type="col"
          :style="`background: url(/images/rank/1.png) no-repeat center / 100% 100%; aspect-ratio: 9 / 15;`" 
          class="w-[30%] max-w-[30%] min-w-[30%] grow px-4 pb-[10%] relative top-[-10px]"
        >
          <UiText mini align="center" class="max-w-[99%]" size="sm" weight="semibold">{{ list3[0].role_name }}</UiText>
          <UiText mini align="center" class="max-w-[99%]" weight="semibold">{{ useMoney().miniMoney(list3[0].power) }}</UiText>
        </UiFlex>

        <UiFlex 
          v-if="list3[2]"
          justify="end" items="center"
          type="col"
          :style="`background: url(/images/rank/3.png) no-repeat center / 100% 100%; aspect-ratio: 9 / 15;`" 
          class="w-[30%] max-w-[30%] min-w-[30%] grow px-4 pb-[10%] relative top-[10px]"
        >
          <UiText mini align="center" class="max-w-[99%]" size="sm" weight="semibold">{{ list3[2].role_name }}</UiText>
          <UiText mini align="center" class="max-w-[99%]" weight="semibold">{{ useMoney().miniMoney(list3[2].power) }}</UiText>
        </UiFlex>
      </UiFlex>
    </UCard>

    <UiFlex type="col" class="grow gap-4" v-if="list7.length > 0">
      <UiFlex v-for="(item, index) in list7" :key="index" class="w-full gap-2">
        <UBadge variant="soft" class="px-3">
          <UiText size="sm" class="italic">Hạng {{ item.rank }}</UiText>
        </UBadge>

        <div class="grow">
          <UiText mini size="md" weight="semibold" class="max-w-[70%]">{{ item.role_name }}</UiText>
        </div>

        <UBadge color="gray" variant="soft" class="ml-auto px-3" size="md">{{ useMoney().toMoney(item.power) }}</UBadge>
      </UiFlex>
    </UiFlex>
  </div>
</template>

<script setup>
const loading = ref({
  load: false
})

const list = ref([])

const state = ref({
  server: null
})
watch(() => state.value.server, (val) => !!val && submit())

const validate = (state) => {
  const errors = []
  if (!state.server) errors.push({ path: 'server', message: 'Vui lòng chọn máy chủ' })
  return errors
}

const list3 = computed(() => {
  return list.value.filter((item, index) => index <= 2)
})

const list7 = computed(() => {
  return list.value.filter((item, index) => index > 2)
})

const submit = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/public/rank/power', JSON.parse(JSON.stringify(state.value)))

    loading.value.load = false
    list.value = data
  }
  catch(e){
    loading.value.load = false
  }
}
</script>