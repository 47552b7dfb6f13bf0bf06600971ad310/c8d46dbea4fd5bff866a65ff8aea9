<template>
  <div>
    <!-- Button Drag -->
    <div id="ButtonDrag" class="color-blue-light bg-anim-light shadow-lg rounded-full touch-none ring-2 ring-primary" :style="style" ref="el">
      <UDropdown v-model:open="open" :items="menu" :popper="{ 
        placement: 'auto-end',
        strategy: 'absolute',
        scroll: 'true'
      }">
        <UiImg v-if="!!configStore.config.logo_image" :src="configStore.config.logo_image" w="1" h="1" img-w="100" img-h="100" class="w-full h-full overflow-hidden rounded-full" />
        <UiIcon v-else name="i-bxs-grid-alt" class="text-white" size="8" />
      </UDropdown>
    </div>

    <!-- Overlay -->
    <div class="fixed bg-black/90 w-full h-full top-0 left-0" style="z-index: 99;" v-if="!!dragging || !!open"></div>

    <!-- Modal -->
    <UModal v-model="modal.admin.user" :ui="{ width: 'sm:max-w-[700px]' }">
      <ManageUserInfo v-if="!!playCookie && !!playCookie.user" :user="playCookie.user" />
    </UModal>

    <UModal v-model="modal.admin.mail" preventClose :ui="{ width: 'sm:max-w-[700px]' }">
      <PlayModal title="Gửi Thư" sub="Trình gửi thư cho nhân vật" @close="modal.admin.mail = false">
        <ManageGameSend v-if="!!playCookie && !!playCookie.user" :user="playCookie.user" :role="playCookie.role || null" :server="playCookie.server || null" @close="modal.admin.mail = false" />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.action.payment" preventClose :ui="{ width: 'sm:max-w-[700px]' }">
      <PlayModal title="Nạp Xu" sub="Nạp xu vào tài khoản với các ưu đãi hấp dẫn" @close="modal.action.payment = false">
        <MainActionPayment />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.action.giftcode" preventClose :ui="{ width: 'sm:max-w-[700px]' }">
      <PlayModal title="Giftcode" sub="Nhập mã quà tặng và nhận thưởng" @close="modal.action.giftcode = false">
        <MainActionGiftcode />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.shop" preventClose :ui="{ width: 'sm:max-w-[700px]' }">
      <PlayModal title="Cửa Hàng" sub="Mua vật phẩm gửi vào trò chơi"  @close="modal.shop = false">
        <MainShop scroll />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.event" preventClose :ui="{ width: 'sm:max-w-[700px]' }">
      <PlayModal title="Sự Kiện" sub="Các sự kiện đang diễn ra" @close="modal.event = false">
        <MainEvent scroll />
      </PlayModal>
    </UModal>

    <UModal v-model="modal.minigame" preventClose :ui="{ width: 'sm:max-w-[700px]' }">
      <PlayModal title="MiniGame" sub="Các trò chơi nhỏ khác của hệ thống" @close="modal.minigame = false">
        <MainMinigame />
      </PlayModal>
    </UModal>
  </div>
</template>

<script setup>
import { useDraggable } from '@vueuse/core'
const router = useRouter()
const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const authStore = useAuthStore()
const props = defineProps(['admin'])

const show = ref(configStore.config.menu)
const open = ref(false)

const el = ref(null)
const dragging = ref(false)

const playCookie = useCookie('play-manage-url', runtimeConfig.public.cookieConfig)

const modal = ref({
  admin: {
    user: false,
    mail: false
  },
  action: {
    payment: false,
    giftcode: false,
  },
  shop: false,
  event: false,
  minigame: false
})

const { style } = useDraggable(el, {
  initialValue: { x: -8, y: -8 },
  exact: false,
  preventDefault: true,
  onStart: () => {
    dragging.value = true
  },
  onEnd: () => {
    dragging.value = false
  }
})

const menu = computed(() => {
  const list = []

  // Manage
  if(authStore.profile.type > 0){
    const action = [{
      label: 'Quản Trị Viên',
      icon: 'i-bxs-shield',
      click: () => useTo().navigateToSSL('/admin')
    }]

    if(!!props.admin && !!playCookie.value.user){
      action.push({
        label: 'Tài Khoản',
        icon: 'i-bxs-user',
        click: () => modal.value.admin.user = true
      })
      action.push({
        label: 'Gửi Thư',
        icon: 'i-bxs-envelope',
        click: () => modal.value.admin.mail = true
      })
    }

    list.push(action)
  }

  // Action
  if(!!show.value.action.payment || !!show.value.action.giftcode){
    const action = []
    if(!!show.value.action.payment) action.push({
      label: 'Nạp Xu',
      icon: 'i-bxs-credit-card',
      click: () => modal.value.action.payment = true
    })
    
    if(!!show.value.action.giftcode) action.push({
      label: 'Giftcode',
      icon: 'i-bx-barcode-reader',
      click: () => modal.value.action.giftcode = true
    })
    list.push(action)
  }

  // Shop
  if(!!show.value.shop.item || !!show.value.shop.pack) list.push([{
    label: 'Cửa Hàng',
    icon: 'i-bxs-shopping-bag',
    click: () => modal.value.shop = true
  }])

  // Event
  if(
    !!show.value.event.referral 
    || !!show.value.event.login 
    || !!show.value.event.pay 
    || !!show.value.event.spend 
    || !!show.value.event.paymusty 
    || !!show.value.event.paydays
  ) list.push([{
    label: 'Sự Kiện',
    icon: 'i-bxs-calendar',
    click: () => modal.value.event = true
  }])

  // Minigame
  if(!!show.value.minigame.wheel || !!show.value.minigame.dice) list.push([{
    label: 'Minigame',
    icon: 'i-bxs-game',
    click: () => modal.value.minigame = true
  }])

  list.push([{
    label: 'Thoát',
    icon: 'i-solar-exit-bold',
    click: () => goBackOrHome()
  }])

  return list
})

const previousUrl = ref('')
const canGoBack = ref(false)

const goBackOrHome = () => {
  if (canGoBack.value) {
    router.back()
  } else {
    useTo().navigateToSSL('/')
  }
}

onMounted(() => {
  if (process.client) {
    previousUrl.value = document.referrer
    const isSameOrigin = previousUrl.value.startsWith(window.location.origin)
    canGoBack.value = isSameOrigin && window.history.length > 1
  }
})
</script>

<style lang="sass">
#ButtonDrag
  position: fixed
  display: inline-flex
  align-items: center
  justify-content: center
  min-width: 45px
  min-height: 45px
  width: 45px
  height: 45px
  max-width: 45px
  max-height: 45px
  z-index: 100
  cursor: pointer
</style>