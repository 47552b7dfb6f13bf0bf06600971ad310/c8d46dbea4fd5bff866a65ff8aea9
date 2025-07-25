<template>
  <UiContent title="History Send Item" sub="Lịch sử gửi vật phẩm cho người chơi">
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />

      <UForm :state="page" @submit="page.current = 1, getList()">
        <UInput size="sm" v-model="page.to" placeholder="Tìm kiếm người nhận" />
      </UForm>

      <UForm :state="page" @submit="page.current = 1, getList()" class="mr-auto">
        <UInput size="sm" v-model="page.from" placeholder="Tìm kiếm người gửi" />
      </UForm>

      <SelectDate time v-model="page.range.start" placeholder="Bắt đầu" size="sm" />
      <SelectDate time v-model="page.range.end" placeholder="Kết thúc" size="sm" />
    </UiFlex>
    
    <!-- Table -->
    <UCard class="my-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns"
        :rows="list"
      >
        <template #from-data="{ row }">
          <UButton size="2xs" color="gray" @click="viewUser(row.from._id)">{{ row.from.username }}</UButton>
        </template>

        <template #to-data="{ row }">
          <UButton size="2xs" color="gray" @click="viewUser(row.to._id)">{{ row.to.username }}</UButton>
        </template>

        <template #server-data="{ row }">
          <UBadge color="gray">{{ row.server ? `${row.server}` : '...' }}</UBadge>
        </template>

        <template #gift-data="{ row }">
          <DataItemList :items="row.gift" class="max-w-[400px]" empty="..." />
        </template>

        <template #reason-data="{ row }">
          <div class="whitespace-normal" v-html="row.reason" />
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!--Modal User Info-->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[900px]'}">
      <ManageUserInfo :user="stateUser" />
    </UModal>    
  </UiContent>
</template>

<script setup>
const { toMoney } = useMoney()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'from',
    label: 'Người gửi',
  },{
    key: 'to',
    label: 'Người nhận',
  },{
    key: 'server',
    label: 'Máy chủ',
  },{
    key: 'gift',
    label: 'Vật phẩm',
  },{
    key: 'reason',
    label: 'Lý do',
    sortable: true
  },{
    key: 'createdAt',
    label: 'Ngày gửi',
    sortable: true
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  range: {
    start: null,
    end: null
  },
  from: null,
  to: null,
  total: 0,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.user, (val) => !val && getList())
watch(() => page.value.range.start, (val) => {
  if(!!val && !!page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
})
watch(() => page.value.range.end, (val) => {
  if(!!val && !!page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
})

// State
const stateUser = ref(undefined)

// Modal
const modal = ref({
  user: false
})

// Loading
const loading = ref({
  load: true
})

// View User
const viewUser = (_id) => {
  modal.value.user = true
  stateUser.value = _id
}

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('log/send-item', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

getList()
</script>
