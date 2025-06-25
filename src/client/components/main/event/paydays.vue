<template>
  <div :class="{ 'HideScroll max-h-[60vh] overflow-y-auto p-0.5' : !!scroll }">
    <DataEmpty v-if="!!loading || list.length == 0" :loading="loading" text="Chưa có mốc thưởng ở sự kiện này" class="min-h-[300px]"></DataEmpty>
    
    <div class="@container grid grid-cols-12 gap-2" v-else>
      <UCard v-for="(row, index) in list" :key="index" class="bg-gray @4xl:col-span-3 @xl:col-span-4 col-span-6 ring-1">
        <UiFlex type="col">
          <UiText mini weight="semibold" class="text-sm md:text-lg line-clamp-1 mb-4 max-w-[90%]">
            Ngày {{ toMoney(row.need) }}
          </UiText>

          <DataItemListMini :max="2" :items="row.gift" justify="center" />

          <UiText size="xs" weight="semibold" class="line-clamp-1 my-4" color="gray">{{ row.gift.length }} Vật Phẩm</UiText>

          <UButton :color="statusFormat[row.status].color" :disabled="row.status != 0" @click="openReceive(row)" class="px-4 md:px-6 max-w-full">
            {{ statusShow(row.status, row.need) }}
          </UButton>
        </UiFlex>
      </UCard>
    </div>

    <UModal v-model="modal.receive" prevent-close>
      <DataEventReceive :event="stateReceive" @done="doneReceive" @close="modal.receive = false" class="p-4" />
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps({
  scroll: Boolean
})
const authStore = useAuthStore()
const { toMoney, miniMoney } = useMoney()
watch(() => authStore.isLogin, () => getList())

const loading = ref(true)
const modal = ref({ receive: false })

watch(() => modal.value.receive, (val) => !val && (stateReceive.value = null))

const config = ref({
  start: null,
  end: null,
  display: 0
})

const list = ref([])
const statistical = ref(undefined)

const type = ref('paydays')
watch(() => type.value, () => getList())

const statusFormat = {
  '-3': { color: 'rose', label: 'Lỗi' },
  '-2': { color: 'gray', label: 'Chưa đăng nhập' },
  '-1': { color: 'gray', label: 'Chưa đạt' },
  '0': { color: 'primary', label: 'Nhận ngay' },
  '1': { color: 'green', label: 'Đã nhận' },
}

const statusShow = (number, need) => {
  if(number != -1 || !authStore.isLogin) return statusFormat[number].label
  const arrType = type.value.split('.')

  if(arrType.length > 1){
    let info = JSON.parse(JSON.stringify(statistical.value)) 
    arrType.forEach(i => {
      
      info =  info[i]
    })

    return `${miniMoney(info)} / ${miniMoney(need)}`
  }
  else {
    return `${miniMoney(statistical.value[type.value])} / ${miniMoney(need)}`
  }
}

// Receive
const stateReceive = ref(null)

const openReceive = (row) => {
  stateReceive.value = row
  modal.value.receive = true
}

const doneReceive = () => {
  modal.value.receive = false
  getList()
}

const getStatistical = async () => {
  try {
    if(!authStore.isLogin) throw true
    const data = await useAPI('user/public/statistical', { user: authStore.profile._id })
    statistical.value = data
  }
  catch(e){
    statistical.value = null
  }
}

const getList = async () => {
  try {
    loading.value = true
    getStatistical()
    const get = await useAPI('event/public/list', { type: type.value })

    list.value = get.list
    config.value = Object.assign(config.value, get.config)
    loading.value = false
  }
  catch(e){
    list.value = []
    loading.value = false
  }
}

getList()
</script>