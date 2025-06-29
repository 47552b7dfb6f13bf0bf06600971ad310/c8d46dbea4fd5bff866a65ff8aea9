<template>
  <UiContent title="Level" sub="Quản lý cấp độ tài khoản">
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-auto"/>
      <UButton color="yellow" icon="i-bx-plus" @click="modal.add = true">Thêm mới</UButton>
    </UiFlex>
    
    <!-- Table -->
    <UCard class="my-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #number-data="{ row }">
          <UBadge color="primary" variant="soft">{{ `Cấp ${row.number}` }}</UBadge>
        </template>

        <template #bonus-data="{ row }">
          {{ row.bonus }}%
        </template>

        <template #bonus_wheel-data="{ row }">
          {{ useMoney().toMoney(row.bonus_wheel) }}đ / 1 vòng
        </template>

        <template #discount-data="{ row }">
          {{ row.discount }}%
        </template>

        <template #bonus_presentee_pay-data="{ row }">
          {{ row.bonus_presentee_pay }}%
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
        <UFormGroup label="Cấp độ">
          <UInput v-model="stateAdd.number" type="number" />
        </UFormGroup>

        <UFormGroup label="Nạp thưởng xu (%)">
          <UInput v-model="stateAdd.bonus" type="number" />
        </UFormGroup>

        <UFormGroup label="Nạp thưởng vòng quay (VNĐ)">
          <UInput v-model="stateAdd.bonus_wheel" type="number" />
        </UFormGroup>

        <UFormGroup label="Giảm giá cửa hàng (%)">
          <UInput v-model="stateAdd.discount" type="number" />
        </UFormGroup>

        <UFormGroup label="Bạn bè nạp thưởng cống hiến (%)">
          <UInput v-model="stateAdd.bonus_presentee_pay" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Info -->
    <UModal v-model="modal.editInfo" preventClose>
      <UForm :state="stateEditInfo" @submit="editInfoAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Cấp độ">
          <UInput v-model="stateEditInfo.number" type="number" />
        </UFormGroup>

        <UFormGroup label="Nạp thưởng xu (%)">
          <UInput v-model="stateEditInfo.bonus" type="number" />
        </UFormGroup>

        <UFormGroup label="Nạp thưởng vòng quay (VNĐ)">
          <UInput v-model="stateEditInfo.bonus_wheel" type="number" />
        </UFormGroup>

        <UFormGroup label="Giảm giá cửa hàng (%)">
          <UInput v-model="stateEditInfo.discount" type="number" />
        </UFormGroup>

        <UFormGroup label="Bạn bè nạp thưởng cống hiến (%)">
          <UInput v-model="stateEditInfo.bonus_presentee_pay" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.editInfo">Sửa</UButton>
          <UButton color="gray" @click="modal.editInfo = false" :disabled="loading.editInfo">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Need -->
    <UModal v-model="modal.editNeed" preventClose>
      <UForm :state="stateEditNeed" @submit="editNeedAction" class="bg-card rounded-2xl p-4">
        <ManageLevelEditNeed v-model:need="stateEditNeed.need" />

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.editNeed">Sửa</UButton>
          <UButton color="gray" @click="modal.editNeed = false" :disabled="loading.editNeed">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Limit -->
    <UModal v-model="modal.editLimit" preventClose>
      <UForm :state="stateEditLimit" @submit="editLimitAction" class="bg-card rounded-2xl p-4">
        <ManageLevelEditLimit v-model:limit="stateEditLimit.limit" />

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.editLimit">Sửa</UButton>
          <UButton color="gray" @click="modal.editLimit = false" :disabled="loading.editLimit">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'number',
    label: 'Cấp độ',
    sortable: true
  },{
    key: 'bonus',
    label: 'Nạp thưởng xu',
    sortable: true
  },{
    key: 'bonus_wheel',
    label: 'Nạp thưởng vòng quay',
    sortable: true
  },{
    key: 'discount',
    label: 'Giảm giá cửa hàng',
    sortable: true
  },{
    key: 'bonus_presentee_pay',
    label: 'Bạn bè nạp thưởng CH',
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
    column: 'number',
    direction: 'asc'
  },
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

// State
const stateAdd = ref({
  number: null,
  bonus: 0,
  bonus_wheel: 0,
  bonus_presentee_pay: 0,
  discount: 0,
})

const stateEditInfo = ref({
  _id: null,
  number: null,
  bonus: null,
  bonus_wheel: null,
  bonus_presentee_pay: null,
  discount: null
})

const stateEditNeed = ref({
  _id: null,
  need: null
})

const stateEditLimit = ref({
  _id: null,
  limit: null
})

// Modal
const modal = ref({
  add: false,
  editInfo: false,
  editNeed: false,
  editLimit: false,
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  number: null,
  bonus: 0,
  bonus_wheel: 0,
  bonus_presentee_pay: 0,
  discount: 0,
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  editInfo: false,
  editNeed: false,
  editLimit: false,
  del: false
})

// Actions
const actions = (row) => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEditInfo.value).forEach(key => stateEditInfo.value[key] = row[key])
      modal.value.editInfo = true
    }
  }],[{
    label: 'Sửa yêu cầu',
    icon: 'i-bx-lock-open',
    disabled: row.number == 1,
    click: () => {
      Object.keys(stateEditNeed.value).forEach(key => stateEditNeed.value[key] = row[key])
      modal.value.editNeed = true
    }
  },{
    label: 'Sửa giới hạn',
    icon: 'i-bx-lock-alt',
    click: () => {
      Object.keys(stateEditLimit.value).forEach(key => stateEditLimit.value[key] = row[key])
      modal.value.editLimit = true
    }
  }],[{
    label: 'Xóa cấp độ',
    icon: 'i-bx-trash',
    disabled: row.number == 1,
    click: () => delAction(row._id)
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('level/manage/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const addAction = async () => {
  try {
    loading.value.add = true
    await useAPI('level/manage/add', JSON.parse(JSON.stringify(stateAdd.value)))

    loading.value.add = false
    modal.value.add = false
    getList()
  }
  catch (e) {
    loading.value.add = false
  }
}

const editInfoAction = async () => {
  try {
    loading.value.editInfo = true
    await useAPI('level/manage/edit-info', JSON.parse(JSON.stringify(stateEditInfo.value)))

    loading.value.editInfo = false
    modal.value.editInfo = false
    getList()
  }
  catch (e) {
    loading.value.editInfo = false
  }
}

const editNeedAction = async () => {
  try {
    loading.value.editNeed = true
    await useAPI('level/manage/edit-need', JSON.parse(JSON.stringify(stateEditNeed.value)))

    loading.value.editNeed = false
    modal.value.editNeed = false
    getList()
  }
  catch (e) {
    loading.value.editNeed = false
  }
}

const editLimitAction = async () => {
  try {
    loading.value.editLimit = true
    await useAPI('level/manage/edit-limit', JSON.parse(JSON.stringify(stateEditLimit.value)))

    loading.value.editLimit = false
    modal.value.editLimit = false
    getList()
  }
  catch (e) {
    loading.value.editLimit = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('level/manage/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
