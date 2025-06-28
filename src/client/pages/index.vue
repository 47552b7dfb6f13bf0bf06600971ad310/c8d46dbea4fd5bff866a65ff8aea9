<template>
  <div class="HomePage">
    <DataBanner class="mb-4"/>
    <DataPromoHome class="mb-8" />
    <DataNewsLatest class="mb-8" />
    <DataGameMore />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['home']
})
</script>