<template>
  <UModal v-model="modal" prevent-close>
    <UCard>
      <template #header>
        <UiText size="base" weight="semibold">Cập nhật tài khoản</UiText>
        <UiText size="sm" color="gray">Vui lòng tạo tên định danh của bạn trước khi tiếp tục</UiText>
      </template>

      <UForm :state="state" :validate="validate" @submit="submit">
        <UFormGroup name="username">
          <UInput v-model="state.username" icon="i-bxs-user" placeholder="Nhập tên định danh" :disabled="loading" />
        </UFormGroup>

        <UiFlex justify="between" class="mt-4">
          <UButton color="gray" @click="signOut">Đăng xuất</UButton>
          <UButton type="submit" :loading="loading">Xác nhận</UButton>
        </UiFlex>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
const { setAuth, removeAuth } = useAuthStore()
const emit = defineEmits(['done'])

const modal = ref(true)

const loading = ref(false)

const state = ref({
  username: undefined
})

const validate = (state) => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Vui lòng nhập đầy đủ' })
  else if (state.username.length < 6 || state.username.length > 12) errors.push({ path: 'username', message: 'Độ dài 6-12 ký tự' })
  else if (!!state.username.match(/\s/g)) errors.push({ path: 'username', message: 'Phát hiện khoảng cách' })
  else if (!(/^[a-z0-9]*$/g).test(state.username)) errors.push({ path: 'username', message: 'Phát hiện ký tự đặc biệt và viết hoa' })
  else if (!!state.username.includes('admin')
    || !!state.username.includes('smod')
    || !!state.username.includes('robot')
  ) errors.push({ path: 'username', message: 'Danh xưng không hợp lệ' })
  return errors
}

const signOut = async () => {
  modal.value = false
  await removeAuth()
}

const submit = async () => {
  try {
    loading.value = true
    await useAPI('auth/public/update/username', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
    modal.value = false
    await setAuth(auth)
  }
  catch (e) {
    loading.value = false
  }
}
</script>