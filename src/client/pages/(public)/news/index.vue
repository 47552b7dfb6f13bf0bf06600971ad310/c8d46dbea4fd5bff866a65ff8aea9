<template>
  <div class="@container">
    <UiMinibanner title="Tin Tức" sub="Các tin tức mới nhất và thông tin khuyến mãi" type="news" class="mb-4 pb-3">
      <UiFlex class="w-full mt-4 gap-1">
        <UForm :state="page" @submit="page.current = 1, getList()" class="grow">
          <UInput v-model="page.search" placeholder="Tìm kiếm tin tức..." icon="i-bx-search" size="lg" :disabled="!!loading" />
        </UForm>

         <SelectNewsCategory v-model="page.category" :options="[{ _id: undefined, label: 'Tất cả' }]" size="lg" :disabled="!!loading" />
      </UiFlex>
    </UiMinibanner>

    <DataEmpty :loading="loading" text="Không có tin tức" v-if="!!loading || list.length == 0" class="min-h-[300px]"></DataEmpty>

    <div class="grid grid-cols-12 gap-4" v-else>
      <DataNewsBox 
        v-for="(item, index) in list" 
        :key="index" 
        class="@4xl:col-span-3 @2xl:col-span-4 col-span-6"
        :news="item"
      ></DataNewsBox>
    </div>

    <UiFlex justify="end" class="mt-6" v-if="page.total > list.length">
      <UPagination :max="5" :page-count="page.size" :total="page.total" v-model="page.current" />
    </UiFlex>
  </div>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Tin Tức - ${configStore.config.name}`,
  ogTitle: () => `Tin Tức - ${configStore.config.name}`,
  description: () => `Các tin tức mới nhất và thông tin khuyến mãi`,
  ogDescription: () => `Các tin tức mới nhất và thông tin khuyến mãi`,
})

const list = ref([])
const loading = ref(true)

const page = ref({
  size: 6,
  current: 1,
  total: 0,
  category: undefined,
  search: undefined
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.category, () => getList())
watch(() => page.value.search, (val) => (!val && getList()))

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('news/public/list', JSON.parse(JSON.stringify(page.value)))

    page.value.total = data.total
    list.value = data.list
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
  catch (e) {
    loading.value = false
    list.value = []
  }
}

getList()
</script>