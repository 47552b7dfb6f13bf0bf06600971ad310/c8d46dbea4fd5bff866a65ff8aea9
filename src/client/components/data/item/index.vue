<template>
  <div v-if="item" class="
    relative inline-block
    cursor-pointer
    rounded-2xl
  ">
    <DataItemImage 
      class="p-1"
      :size="size"
      :src="item.image || item.item_image" 
      :type="item.type"
      @click="modal = true" 
    />

    <UiFlex 
      v-if="amount && amount > 0"
      class="
        absolute
        bottom-0 right-0
        rounded-2xl
        px-[6px] py-[1px]
        bg-primary-800 font-medium text-xs text-white
        cursor-pointer
      "
      @click="modal = true" 
    >
      <UiText align="center" weight="bold" >
        {{ miniMoney(amount) }}
      </UiText>
    </UiFlex>

    <UModal v-model="modal" :ui="{ width: 'max-w-[220px] sm:max-w-[220px]' }">
      <UCard class="bg-card" :ui="{ body: { padding: 'p-4 sm:p-4' } }">
        <DataItemImage :src="item.image || item.item_image" :type="item.type" :size="120" class="mx-auto mb-2" />

        <UiFlex type="col" class="mt-4">
          <UiText weight="bold" align="center" size="lg" class="max-w-[90%] leading-[1.5rem] mb-2">
            {{ item.name || item.item_name }}
          </UiText>
          <UiText size="xs" weight="semibold" class="line-clamp-1" color="gray">Vật Phẩm</UiText>
          <UBadge size="md" class="bg-gray px-4 md:px-6 max-w-full mt-3" v-if="!!amount && amount > 0">x {{ toMoney(amount) }}</UBadge>
        </UiFlex>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
const { miniMoney, toMoney } = useMoney()
const props = defineProps({
  item: Object,
  amount: [ String, Number ],
  size: { type: [ String, Number ]}
})

const modal = ref(false)
</script>