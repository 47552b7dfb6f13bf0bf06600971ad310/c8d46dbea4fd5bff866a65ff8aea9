<template>
  <div class="@container grid grid-cols-12 gap-4">
    <!--Left-->
    <div class="@3xl:col-span-8 col-span-12">
      <DataPromoPayment class="mb-4" />

      <UCard>
        <UForm ref="form" :state="state" :validate="validate" @submit="submit">
          <UFormGroup name="gate">
            <SelectGate auto v-model="state.gate" v-model:gate="gateSelect" />
          </UFormGroup>

          <DataEmpty class="min-h-[200px]" loading v-if="!gateSelect"/>
          <div v-else>
            <UAlert title="Ưu Đãi" icon="i-bxs-gift" color="red" variant="soft" class="mb-4" v-if="(!!savePayBonus && savePayBonus.number > 0)">
              <template #description>
                <UiText>
                  Tặng 
                  <b>{{ savePayBonus.number }}%</b> 
                  giá trị nạp vào tích nạp ngày và tháng
                  <b v-if="savePayBonus.time">{{ savePayBonus.time }}</b>
                </UiText>
              </template>
            </UAlert>

            <UFormGroup label="Khuyến mãi" v-if="gateBonus && gateBonus.number > 0">
              <UInput :model-value="`+${gateBonus.number}% ${gateBonus.time}`" readonly />
            </UFormGroup>

            <!-- QR -->
            <div v-if="gateSelect.type != 1" class="mb-4">
              <UFormGroup name="money">
                <div class="bg-gray rounded-2xl p-4">
                  <UiFlex justify="between" class="mb-4">
                    <UiText color="gray" size="sm">Số Xu Nhận</UiText>
                    <UiText color="gray" size="sm" >
                      {{ useMoney().toMoney(totalCoin || 0) }} Xu
                    </UiText>
                  </UiFlex>

                  <UInput 
                    v-model="state.money" 
                    variant="none" 
                    type="number" 
                    size="3xl" 
                    placeholder="Nhập số tiền nạp (>= 20.000)" 
                    class="font-bold"
                  />
                </div>
              </UFormGroup>

              <div class="bg-gray rounded-2xl p-4">
                <UiText color="orange" size="xs" weight="bold" class="mb-3">Lưu ý</UiText>
                <UiText color="gray" size="sm" class="mb-2">- Xu nhận được từ <b class="text-orange-500">khuyến mãi nạp đầu và nạp lần 2</b> sẽ nhận được sau khi nạp <b>thành công</b>.</UiText>
                <UiText color="gray" size="sm" class="mb-2">- Hệ thống cung cấp <b class="text-orange-500">thông tin người nhận ngẫu nhiên</b>, vui lòng dựa vào thông tin hiển thị trên mã <b class="text-orange-500">QR để nạp tiền</b>.</UiText>
                <UiText color="gray" size="sm"><b class="text-orange-500">- Mã QR</b> chỉ cung cấp cho <b class="text-orange-500">nạp tiền lần này</b>. Vui lòng không lưu lại sử dụng cho những lần nạp tiền sau.</UiText>
              </div>
            </div>

            <!-- Card -->
            <div v-if="gateSelect.type == 1" class="mb-4">
              <UFormGroup label="Chọn nhà mạng" name="card_net">
                <USelectMenu v-model="state.card.net" :options="card.net" value-attribute="value" size="lg" />
              </UFormGroup>

              <UFormGroup label="Chọn mệnh giá" name="card_money">
                <USelectMenu v-model="state.money" :options="card.money" value-attribute="value" size="lg" />
              </UFormGroup>

              <UiFlex items="start" class="gap-1 flex-col @xl:flex-row">
                <UFormGroup label="Số Series" name="card_seri" class="grow w-full">
                  <UInput v-model="state.card.seri" placeholder="Nhập số Series" />
                </UFormGroup>

                <UFormGroup label="Mã thẻ (PIN)" name="card_pin" class="grow w-full">
                  <UInput v-model="state.card.pin" placeholder="Nhập mã thẻ PIN"/>
                </UFormGroup>
              </UiFlex>

              <UFormGroup label="Tổng Xu nhận" name="money" v-if="!!totalCoin">
                <UInput :model-value="`${useMoney().toMoney(totalCoin)} Xu`" readonly />
              </UFormGroup>

              <div class="bg-gray rounded-2xl p-4">
                <UiText color="orange" size="xs" weight="bold" class="mb-3">Lưu ý</UiText>
                <UiText color="gray" size="sm" class="mb-2">- Xu nhận được từ <b class="text-orange-500">khuyến mãi nạp đầu và nạp lần 2</b> sẽ nhận được sau khi nạp <b>thành công</b>.</UiText>
                <UiText color="gray" size="sm" class="mb-2">- Tất cả thẻ cào của các nhà mạng có mức chiết khấu là <b class="text-orange-500">20%</b>, nên khuyến mãi khi nạp qua kênh này sẽ luôn ít hơn các kênh còn lại.</UiText>
                <UiText color="gray" size="sm">- Nếu bạn <b class="text-orange-500">nhập sai thông tin</b> thẻ có thể bị mất, vui lòng nhập chính xác.</UiText>
              </div>
            </div>

            <!-- Button -->
            <UButton block type="submit" :loading="loading" color="yellow" size="lg" :disabled="!!payment">   
              {{ gateSelect.type != 1 ? 'Tạo Mã QR' : 'Kiểm Tra Thẻ' }}
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>

    <!--Right-->
    <div class="@3xl:col-span-4 col-span-12 @3xl:block hidden">
      <UCard class="bg-card">
        <DataEmpty loading class="min-h-[200px]" v-if="!gateSelect"/>

        <div v-else>
          <UiImg :src="`/images/payment/create-card.png`" w="1" h="1" img-size="500px" class="w-[90%] mb-6 mx-auto bounce-anim" v-if="gateSelect.type == 1"/>
          <UiImg :src="`/images/payment/create-qr.png`" w="1" h="1" img-size="500px" class="w-[90%] mb-6 mx-auto bounce-anim" v-if="gateSelect.type == 2"/>
          <UiImg :src="`/images/payment/create-momo.png`" w="1" h="1" img-size="500px" class="w-[90%] mb-6 mx-auto bounce-anim" v-if="gateSelect.type == 3"/>

          <UiText weight="bold" color="primary" class="text-lg md:text-xl mb-1" align="center">
            {{ gateSelect.type == 1 ? 'Card Pay' : gateSelect.type == 2 ? 'QR Bank' : 'QR Wallet'}}
          </UiText>
          <UiText weight="semibold" color="gray" align="center" class="text-sm md:text-base mb-4">
            {{ gateSelect.type == 1 ? 'Dễ Dàng - Tiện Lợi' : gateSelect.type == 2 ? 'Nhanh Chóng - An Toàn' : 'Nhanh Chóng - An Toàn' }}
          </UiText>
        </div>
      </UCard>
    </div>

    <!-- Modal View -->
    <UModal v-model="modal.payment" preventClose :ui="{width: 'sm:max-w-[370px]'}">
      <UiContent title="Giao Dịch" sub="Thông tin chi tiết giao dịch nạp Xu" class="bg-card p-4 rounded-2xl">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.payment = false, reset()"></UButton>
        </template>

        <DataPaymentView :fetch-id="payment" @history="modal.payment = false, modal.history = true, reset()" v-if="payment" />
      </UiContent>
    </UModal>

    <!-- Modal History -->
    <UModal v-model="modal.history" :ui="{width: 'sm:max-w-[900px]'}">
      <UiContent title="Lịch Sử Nạp" sub="Danh sách các giao dịch nạp Xu" class="bg-card rounded-2xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.history = false"></UButton>
        </template>

        <DataPaymentHistory />
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const { dayjs, displayFull } = useDayJs()
const authStore = useAuthStore()

const form = ref()
const loading = ref(false)

const config = ref(null)
const limit = ref(undefined)
const payment = ref(undefined)

// Modal
const modal = ref({
  payment: false,
  history: false
})

watch(() => modal.value.payment, (val) => {
  if(!!val) return
  payment.value = undefined
  state.value.card = {
    pin: null,
    seri: null,
    net: null
  }
  state.value.money = null
})

// State
const state = ref({
  gate: null,
  card: {
    pin: null,
    seri: null,
    net: null
  },
  money: null
})

const reset = () => {
  payment.value = null
  form.value.clear()
  state.value.card = {
    pin: null,
    seri: null,
    net: null
  }
  state.value.money = null
}

watch(() => state.value.gate, () => reset())

// Save Pay Bonus
const savePayBonus = computed(() => {
  if(!config.value) return null

  let number = 0
  let time = ''
  const bonus = parseInt(config.value.pay?.number || 0)
  const expired = config.value.pay?.expired || null

  if(!expired) number = bonus, time = ''
  else {
    const nowTime = dayjs(Date.now()).unix()
    const expiredTime = dayjs(expired).unix()
    if(nowTime <= expiredTime) number = bonus, time = `đến ${displayFull(expired)}`
    else number = 0, time = ''
  }

  return { number, time }
})

// Gate
const gateSelect = ref(undefined)

const gateBonus = computed(() => {
  if(!gateSelect.value) return null
  if(!gateSelect.value['bonus']) return null

  const bonus = gateSelect.value['bonus']
  const defaultBonus = parseInt(bonus.default || 0)
  const limitBonus = parseInt(bonus.limit?.number || 0)
  const limitExpired = bonus.limit?.expired || null
  let number, time

  if(limitBonus < 1 || (limitBonus > 0 && !limitExpired)) {
    number = defaultBonus
    time = ''
  }
  else {
    const now = dayjs(Date.now()).unix()
    const expired = dayjs(limitExpired).unix()
    if(now <= expired) {
      number = limitBonus
      time = `đến ${displayFull(limitExpired)}`
    }
    else {
      number = defaultBonus
      time = ''
    }
  }

  return { number, time }
})

// Total Coin
const totalCoin = computed(() => {
  if(!gateBonus.value) return null
  if(!state.value.money) return null
  if(state.value.money < 20000) return null

  const coin = state.value.money
  const coinBonus = Math.floor((parseInt(state.value.money) * parseInt(gateBonus.value.number)) / 100)

  return coin + coinBonus
})

// Card
const card = {
  net:  [
    { label: 'Viettel', value: 'VIETTEL' },
    { label: 'Mobifone', value: 'MOBIFONE' },
    { label: 'Vinaphone', value: 'VINAPHONE' },
  ],
  money: [
    // { label: '10.000', value: 10000 },
    { label: '20.000', value: 20000 },
    { label: '30.000', value: 30000 },
    { label: '50.000', value: 50000 },
    { label: '100.000', value: 100000 },
    { label: '200.000', value: 200000 },
    { label: '300.000', value: 300000 },
    { label: '500.000', value: 500000 },
    { label: '1.000.000', value: 1000000 },
  ]
}

// Validate
const validate = (st) => {
  const errors = []
  if (!st.gate) errors.push({ path: 'gate', message: 'Vui lòng chọn kênh nạp' })
  if (!!gateSelect.value) {
    if(gateSelect.value['type'] == 1){
      if (!st.money) errors.push({ path: 'card_money', message: 'Vui lòng nhập đầy đủ' })
      if (!st.card.net) errors.push({ path: 'card_net', message: 'Vui lòng nhập đầy đủ' })
      if (!st.card.seri) errors.push({ path: 'card_seri', message: 'Vui lòng nhập đầy đủ' })
      if (!st.card.pin) errors.push({ path: 'card_pin', message: 'Vui lòng nhập đầy đủ' })
    }
    if(gateSelect.value['type'] != 1){
      if (!st.money) errors.push({ path: 'money', message: 'Vui lòng nhập đầy đủ' })
    }
  }
  return errors
}

// Get Config
const getConfig = async () => {
  try {
    const configData = await useAPI('payment/public/config')
    config.value = configData
  }
  catch (e) {
    config.value = null
  }
}

// Submit
const submit = async () => {
  try {
    if(!authStore.isLogin) return useNotify().error('Vui lòng đăng nhập để nạp xu')
    loading.value = true
    const pay = await useAPI('payment/public/create', JSON.parse(JSON.stringify(state.value)))

    payment.value = pay
    modal.value.payment = true
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}

getConfig()
</script>