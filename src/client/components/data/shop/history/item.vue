<template>
  <div>
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-auto" />

      <SelectDate time v-model="page.range.start" placeholder="Bắt đầu" size="sm" />
      <SelectDate time v-model="page.range.end" placeholder="Kết thúc" size="sm" />
    </UiFlex>

    <UCard class="bg-gray my-2" :ui="{ 
      body: { padding: 'p-0 sm:p-0' },
      header: { padding: 'px-3 sm:px-3 py-2 sm:py-2' },
      footer: { padding: 'p-2 sm:p-2' },
    }">
      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
        <template #amount-data="{ row }">
          <DataItem :item="{
            name: row.item.item_name,
            image: row.item.item_image,
            type: row.item.type
          }" :amount="row.amount" />
        </template>

        <template #server-data="{ row }">
          <UBadge color="gray" variant="soft">{{ row.server ? `${row.server}` : '...' }}</UBadge>
        </template>

        <template #price-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.price) }}</UiText>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
      </UTable>
    </UCard>

    <UiFlex justify="end">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>
  </div>
</template>

<script setup>
const props = defineProps(['user'])

const { toMoney } = useMoney()

const list = ref([])

const columns = [
  {
    key: 'amount',
    label: 'Mặt hàng',
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

const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  total: 0,
  range: {
    start: null,
    end: null
  },
  user: props.user || null,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.range.start, (val) => {
  if(!!val && !!page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
})
watch(() => page.value.range.end, (val) => {
  if(!!val && !!page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
})

const loading = ref({
  load: true
})

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI(`shop/public/history`, JSON.parse(JSON.stringify(page.value)))

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