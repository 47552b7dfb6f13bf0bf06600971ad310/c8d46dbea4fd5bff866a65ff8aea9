<template>
  <UiFlex type="col" justify="center" class="p-6 w-full min-h-screen">
    <UCard class="bg-card min-w-[300px]">
      <template #header>
        <UiText size="base" weight="semibold">Xác minh quyền truy cập</UiText>
        <UiText size="sm" color="gray">Vui lòng nhập mật khẩu ủy quyền</UiText>
      </template>

      <UForm :state="state" @submit="submit">
        <UFormGroup>
          <UInput v-model="state.password" icon="i-bxs-lock" type="password" :disabled="loading" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton color="yellow" type="submit" :loading="loading">Xác nhận</UButton>
        </UiFlex>
      </UForm>
    </UCard>
  </UiFlex>
</template>

<script setup>
definePageMeta({
  layout: false,
  middleware: 'whitelist'
})

useSeoMeta({
  robots: 'none'
})

const loading = ref(false)

const state = ref({
  password: null
})

const submit = async () => {
  try {
    loading.value = true
    const link = await useAPI('auth/manage/verify', JSON.parse(JSON.stringify(state.value)))
    useTo().navigateToSSL(link)
  }
  catch(e){
    loading.value = false
  }
}
</script>