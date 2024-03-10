<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Card from 'primevue/card'
import { TodoEntity } from '@/shared/types'
import Checkbox from 'primevue/checkbox'
import TodoDeadline from '@/shared/todos/todo-deadline.vue'

const props = defineProps<{
  data: TodoEntity
  selected?: boolean
}>()

const emit = defineEmits<{
  'change:completed': [ number, boolean ]
}>()

const completed = ref<boolean>( !!props?.data?.completed )

const classList = computed<string[]>( () => {
  const list = [ 'todo-card cursor-pointer shadow-none' ]
  if ( completed.value ) {
    list.push( 'completed' )
  }
  if ( props?.selected ) {
    list.push( 'selected' )
  }
  return list
} )

watch( completed, () => {
  if ( props.data?.id ) {
    emit( 'change:completed', props.data.id, completed.value )
  }
} )

</script>

<template>
  <Card v-if="data" :class="classList" v-bind="$attrs">
    <template #content>
      <div class="flex flex-column gap-2">
        <div class="flex align-items-center">
          <Checkbox
            v-model:model-value="completed"
            class="mr-2"
            binary
            @click.stop
          />
          <span class="font-semibold">{{ data.name }}</span>
        </div>
        <div v-if="data?.description">
          {{ data.description }}
        </div>
        <div v-if="!completed && data?.expired_at">
          <todo-deadline :expired_at="data.expired_at" />
        </div>
      </div>
      <div class="todo-card-actions flex align-items-center">
        <slot name="actions" />
      </div>
    </template>
  </Card>
</template>