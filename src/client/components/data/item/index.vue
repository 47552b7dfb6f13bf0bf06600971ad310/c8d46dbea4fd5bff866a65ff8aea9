<template>
  <div class="
    relative inline-block
    cursor-pointer
    rounded-2xl
  ">
    <DataItemImage 
      class="p-1"
      :size="size"
      :src="item.image" 
      :type="item.type"
      @click="modal = true" 
    />

    <UiFlex 
      v-if="amount && amount > 0"
      class="
        absolute
        bottom-0 right-0
        rounded-2xl
        px-[7px] py-[1px]
        bg-gray-700
        cursor-pointer
      "
      @click="modal = true" 
    >
      <UiText align="center" weight="bold" style="color:#fff; font-size: 10px;" >
        {{ miniMoney(amount) }}
      </UiText>
    </UiFlex>

    <UModal v-model="modal" :ui="{ width: 'max-w-[220px] sm:max-w-[220px]' }">
      <UCard class="bg-card" :ui="{ body: { padding: 'p-4 sm:p-4' } }">
        <DataItemImage :src="item.image" :type="item.type" :size="120" class="mx-auto" />

        <UiFlex type="col" class="mt-4">
          <UiText weight="semibold" align="center" class="text-sm md:text-lg mt-2 mb-0.5 max-w-[90%]">
            {{ item.name }}
          </UiText>
          <UiText size="xs" weight="semibold" class="line-clamp-1 mb-4" color="gray">Vật Phẩm</UiText>
          <UButton color="gray" class="px-4 md:px-6 max-w-full"  v-if="!!amount && amount > 0">x {{ toMoney(amount) }}</UButton>
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