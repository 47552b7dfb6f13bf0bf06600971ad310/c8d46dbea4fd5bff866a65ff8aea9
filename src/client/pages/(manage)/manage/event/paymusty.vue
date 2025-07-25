<template>
  <UiContent title="Payment Event" sub="Quản lý mốc thưởng sự kiện nạp tiền">
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>
      <UButton class="ml-auto" icon="i-bx-plus" color="yellow" @click="modal.add = true">Thêm mốc</UButton>
      <UButton color="green" icon="i-bx-cog" @click="openConfig" v-if="!!config">Cấu hình</UButton>
    </UiFlex>
    
    <!-- Table -->
    <UCard class="my-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns"
        :rows="list"
      >
        <template #need-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.need) }}</UiText>
        </template>

        <template #gift-data="{ row }">
          <DataItemList :items="row.gift"  />
        </template>

        <template #display-data="{ row }">
          <UBadge :color="row.display == 1 ? 'green' : 'gray'" variant="soft">{{ row.display == 1 ? 'Hiện' : 'Ẩn' }}</UBadge>
        </template>
        
        <template #updatedAt-data="{ row }">
          {{ useDayJs().displayFull(row.updatedAt) }}
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del"/>
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm :state="stateAdd" @submit="addAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Yêu cầu">
          <UInput v-model="stateAdd.need" type="number" />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateAdd.display" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Yêu cầu">
          <UInput v-model="stateEdit.need" type="number" />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateEdit.display" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!--Modal Gift-->
    <UModal v-model="modal.gift" preventClose :ui="{width: 'sm:max-w-[700px]'}">
      <UForm :state="stateGift" @submit="giftAction" class="bg-card rounded-2xl p-4">
        <SelectItemList class="bg-gray" v-model="stateGift.gift" :types="['coin', 'wheel', 'game_item']" />

        <UiFlex justify="end" class="mt-2 gap-1">
          <UButton color="yellow" type="submit" :loading="loading.gift">Lưu</UButton>
          <UButton color="gray" @click="modal.gift = false" :disabled="loading.gift">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Config -->
    <UModal v-model="modal.config" preventClose>
      <UForm :state="stateConfig" @submit="configAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Bắt đầu">
          <SelectDate v-model="stateConfig.start" placeholder="Chọn ngày" />
        </UFormGroup>

        <UFormGroup label="Kết thúc">
          <SelectDate v-model="stateConfig.end" placeholder="Chọn ngày" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.config">Lưu</UButton>
          <UButton color="gray" @click="modal.config = false" :disabled="loading.config">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
const { toMoney } = useMoney()

// List
const list = ref([])
const config = ref()

// Columns
const columns = [
  {
    key: 'need',
    label: 'Yêu cầu',
    sortable: true
  },{
    key: 'gift',
    label: 'Phần thưởng',
  },{
    key: 'display',
    label: 'Hiển thị',
    sortable: true
  },{
    key: 'updatedAt',
    label: 'Cập nhật',
    sortable: true
  },{
    key: 'actions',
    label: 'Chức năng',
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'need',
    direction: 'asc'
  },
  type: 'paymusty',
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.type, (val) => getList() && (stateAdd.value.type = val))

// State
const stateAdd = ref({
  type: page.value.type,
  need: null,
  display: 1
})
const stateEdit = ref({
  _id: null,
  need: null,
  display: null
})
const stateGift = ref({
  _id: null,
  gift: null
})
const stateConfig = ref({
  _id: null,
  start: null,
  end: null,
})

// Modal
const modal = ref({
  add: false,
  edit: false,
  gift: false,
  config: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  type: page.value.type,
  need: null,
  display: 1
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  gift: false,
  del: false,
  config: false
})

// Actions
const actions = (row) => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      modal.value.edit = true
    }
  },{
    label: 'Sửa phần thưởng',
    icon: 'i-bx-gift',
    click: () => {
      stateGift.value._id = row._id
      stateGift.value.gift = JSON.parse((JSON.stringify(row.gift)))
      modal.value.gift = true
    }
  }],[{
    label: 'Xóa mốc',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]

const openConfig = () => {
  const data = JSON.parse(JSON.stringify(config.value))
  stateConfig.value._id = data._id
  stateConfig.value.start = data.start
  stateConfig.value.end = data.end
  modal.value.config = true
}
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('event/manage/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
    config.value = data.config
  }
  catch (e) {
    loading.value.load = false
  } 
}

const addAction = async () => {
  try {
    loading.value.add = true
    await useAPI('event/manage/add', JSON.parse(JSON.stringify(stateAdd.value)))

    loading.value.add = false
    modal.value.add = false
    getList()
  }
  catch (e) {
    loading.value.add = false
  }
}

const editAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('event/manage/edit', JSON.parse(JSON.stringify(stateEdit.value)))

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const giftAction = async () => {
  try {
    loading.value.gift = true
    await useAPI('event/manage/gift', JSON.parse(JSON.stringify(stateGift.value)))

    loading.value.gift = false
    modal.value.gift = false
    getList()
  }
  catch (e) {
    loading.value.gift = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('event/manage/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

const configAction = async () => {
  try {
    loading.value.config = true
    const data = await useAPI('event/manage/config/edit', JSON.parse(JSON.stringify(stateConfig.value)))
    config.value = data
    loading.value.config = false
    modal.value.config = false
  }
  catch (e) {
    loading.value.config = false
  }
}

getList()
</script>