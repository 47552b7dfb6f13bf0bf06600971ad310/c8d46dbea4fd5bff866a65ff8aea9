<template>
  <UiFlex wrap :justify="justify" class="gap-1">
    <UiText size="sm" class="text-gray-600 italic" v-if="!items || items.length == 0">{{empty || 'Chưa có vật phẩm'}}</UiText>
    <DataItem v-for="(item, index) in items" :key="index" :item="item" :amount="item.amount" />
  </UiFlex>
</template>

<script setup>
const props = defineProps(['items', 'empty', 'justify'])
</script>