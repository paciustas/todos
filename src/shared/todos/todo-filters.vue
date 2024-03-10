<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import Dropdown from 'primevue/dropdown'
import { Filters } from '@/shared/types'

const emit = defineEmits<{
  'update:visible': [ boolean ],
  'change': [ Filters ]
}>()

const filters = reactive<Filters>( {
  completed: null,
} )

const options = ref( [
  { name: 'Все', value: null },
  { name: 'Выполненные', value: true },
  { name: 'Не выполненные', value: false },
] )

watch( filters, () => emit( 'change', filters ) )

</script>

<template>
  <div class="flex flex-row gap-2">
    <Dropdown
      v-model="filters.completed"
      placeholder="Сортировка"
      size="small"
      :options="options"
      option-label="name"
      option-value="value"
    />
  </div>
</template>