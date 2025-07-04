<template>
  <div>
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>

      <SelectDate time v-model="page.range.start" placeholder="Bắt đầu" size="sm" class="ml-auto" />
      <SelectDate time v-model="page.range.end" placeholder="Kết thúc" size="sm" />
    </UiFlex>
    
    <!-- Table -->
    <UCard class="bg-gray my-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns"
        :rows="list"
      >
        <template #pack-data="{ row }">
          <UiText weight="semibold">{{ row.pack ? `${row.pack.name}` : '...' }}</UiText>
        </template>

        <template #amount-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.amount) }}</UiText>
        </template>

        <template #server-data="{ row }">
          <UBadge variant="soft" color="gray">{{ row.server ? `${row.server}` : '...' }}</UBadge>
        </template>

        <template #price-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.price) }}</UiText>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="end">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>
  </div>
</template>

<script setup>
const props = defineProps(['user'])

const { toMoney } = useMoney()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'pack',
    label: 'Gói',
  },{
    key: 'amount',
    label: 'Số lượng',
    sortable: true
  },{
    key: 'server',
    label: 'Máy chủ',
  },{
    key: 'price',
    label: 'Giá mua',
    sortable: true
  },{
    key: 'createdAt',
    label: 'Ngày mua',
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
  total: 0,
  user: props.user || null,
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

// Loading
const loading = ref({
  load: true
})

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('shop/public/pack/history', JSON.parse(JSON.stringify(page.value)))

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
