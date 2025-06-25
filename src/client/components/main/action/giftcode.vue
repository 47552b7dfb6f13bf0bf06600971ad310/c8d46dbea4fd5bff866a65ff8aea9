<template>
  <UForm :validate="validate" :state="state" @submit="submit">
    <UFormGroup name="code" class="mb-8">
      <UiTitle name="Nhập mã" icon="i-bxs-barcode" class="mb-4" />
      <UiFlex class="gap-1">
        <UInput v-model="state.code" class="grow" placeholder="Nhập mã tại đây" />
        <UButton type="submit" :loading="loading" size="lg" color="yellow">Nhận Thưởng</UButton>
      </UiFlex>
    </UFormGroup>

    <UFormGroup name="public" v-show="!!giftcodes">
      <UiTitle name="Mã công khai" icon="i-material-symbols-public" class="mb-4" />
      <DataGiftcodePublic v-model:giftcodes="giftcodes" @fast="onFast" />
    </UFormGroup>

    <UModal v-model="modal.receive" prevent-close>
      <DataGiftcodeReceive :giftcode="giftcode" @done="doneReceive" @close="modal.receive = false" class="p-4" />
    </UModal>
  </UForm>
</template>

<script setup>
const authStore = useAuthStore()

const loading = ref(false)

const modal = ref({
  receive: false
})

const giftcodes = ref(undefined)
const giftcode = ref(undefined)

const state = ref({
  code: null
})

const doneReceive = () => {
  modal.value.receive = false
  state.value.code = null
}

const validate = (state) => {
  const errors = []
  if(!state.code) errors.push({ path: 'code', message: 'Vui lòng nhập đầy đủ' })
  return errors
}

const onFast = (code) => {
  if(!!loading.value) return useNotify().error('Đang xử lý, vui lòng đợi giây lát')
  state.value.code = code
  submit()
}

const submit = async () => {
  try {
    if(!authStore.isLogin) return useNotify().error('Vui lòng đăng nhập để nhận mã')
    loading.value = true
    const post = JSON.parse(JSON.stringify(state.value))
    const data = await useAPI('giftcode/public/get', {
      code: post.code
    })

    giftcode.value = data
    loading.value = false
    modal.value.receive = true
  }
  catch (e) {
    loading.value = false
  }
}
</script>