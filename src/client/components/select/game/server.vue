<template>
  <USelectMenu
    v-model="server"
    :options="options"
    size="lg"
    value-attribute="value"
    option-attribute="label"
    :disabled="options.length == 0 || !!disabled"
    :loading="loading"
  >
    <template #label>
      <UiText mini>{{ select ? select.label : 'Chọn máy chủ' }}</UiText>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  loading: Boolean,
  serverData: Object,
  options: {
    type: Array,
    default: () => []
  },
  disabled: Boolean,
  auto: Boolean
})
const emit = defineEmits(['update:modelValue', 'update:serverData', 'update:loading'])

const loading = ref(true)

const server = computed({
  get: () => props.modelValue || '',
  set: (value) => emit('update:modelValue', value)
}) 

const options = ref(props.options)
const select = computed(() => options.value.find(i => i.value === server.value))

watch(select, val => {
  if(!val) return emit('update:serverData', undefined)
  emit('update:serverData', {
    server_id: val.value,
    server_name: val.label
  })
})

const fetch = async () => {
  try {
    loading.value = true
    emit('update:loading', true)
    const list = await useAPI('game/public/server')

    options.value = options.value.concat(list.map(i => ({ value: i.server_id, label: i.server_name })))
    if(options.value.length > 0 && !!props.auto){
      server.value = options.value[0]['value']
    }

    loading.value = false
    emit('update:loading', false)
  }
  catch (e){
    options.value = []
    loading.value = false
    emit('update:loading', false)
  }
}

fetch()
</script>