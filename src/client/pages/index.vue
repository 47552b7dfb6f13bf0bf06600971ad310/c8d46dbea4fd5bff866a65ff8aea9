<template>
  <div class="HomePage">
    <DataBanner class="mb-4"/>
    <DataPromoHome />
    <DataNewsLatest class="my-16" />
    <DataGameMore />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['home']
})
</script>