<template>
  <div class="relative h-full min-h-full">
    <LayoutManageHeader />

    <div class="
      grid grid-cols-12 gap-0 
      min-h-[calc(100%-var(--header-size))]
    ">
      <div class="
        xl:col-span-2 col-span-12
        xl:block hidden
        xl:sticky xl:top-[var(--header-size)]
        xl:max-h-[calc(100vh-var(--header-size))] overflow-y-auto
        border-r border-gray-200 dark:border-gray-800
        HideScroll
        p-4
      ">
        <LayoutManageNav />
      </div>
      
      <div class="xl:col-span-10 col-span-12">
        <main class="p-4 max-w-[1700px] mx-auto w-full overflow-x-hidden min-h-full">
          <slot></slot>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: () => `Manage Pannel`,
  robots: 'none'
})

const authStore = useAuthStore()
watch(() => authStore.isLogin, (val) => !val && useTo().navigateToSSL('/'))
</script>