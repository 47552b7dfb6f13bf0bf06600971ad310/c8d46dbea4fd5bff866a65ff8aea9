<template>
  <div>
    <UCard class="bg-gray" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
    <UTable :columns="columns" :rows="list" v-model:sort="sort">
      <template #rank-data="{ row }">
        <UBadge color="gray" variant="soft">Hạng {{ row.rank }}</UBadge>
      </template>

      <template #gift-data="{ row }">
        <DataItemList :items="row.gift" class="min-w-[400px] max-w-[400px]" />
      </template>

      <template #actions-data="{ row, index }">
        <UButton icon="i-bx-edit-alt" color="gray" class="mr-1" @click="openEdit(row, index)" />
        <UButton icon="i-bx-trash" color="red" @click="delAction(index)" />
      </template>
    </UTable>
    </UCard>
  </div>
</template>

<script setup>
const props = defineProps(['event'])

// List
const list = ref(props.event.award)

// Columns
const columns = [
  {
    key: 'rank',
    label: 'Hạng'
  },{
    key: 'gift',
    label: 'Phần thưởng',
  }
]
</script>