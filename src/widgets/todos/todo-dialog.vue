<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { TodoEntity } from '@/shared/types'
import { useTodosStore } from '@/app/store'
import dayjs from 'dayjs'

const emit = defineEmits<{
  'update:visible': [ boolean ],
  'onsave': [ TodoEntity ]
}>()

const props = defineProps<{
  visible: boolean
}>()

const visible = computed( {
  get: () => props.visible,
  set: ( value ) => emit( 'update:visible', value ),
} )

const todos = useTodosStore()

const name = ref<string>( '' )
const description = ref<string>( '' )
const expired_at = ref<string | Date | null>( '' )

watch( () => visible.value, () => {
  if ( !visible.value ) {
    name.value = ''
    description.value = ''
    expired_at.value = null
  } else {
    name.value = todos.current?.name || ''
    description.value = todos.current?.description || ''
    expired_at.value = todos.current?.expired_at ? dayjs( todos.current?.expired_at ).toDate() : ''
  }
} )

const save = () => {
  const expiredAt = expired_at.value ? dayjs( expired_at.value ).format( 'YYYY-MM-DD HH:mm:00' ) : null
  if ( todos.current ) {
    todos.updatedTodo( {
      ...todos.current,
      name: name.value,
      description: description.value,
      expired_at: expiredAt,
    } )
  } else {
    todos.addTodo( {
      name: name.value,
      description: description.value,
      completed: false,
      expired_at: expiredAt,
    } )
  }
  visible.value = false
}

const remove = () => {
  if ( todos.current ) {
    todos.removeTodo( [ todos.current.id ] )
    visible.value = false
  }
}

const canSave = computed<boolean>( () => !!name.value )

const namePlaceholder = computed( () => todos.current?.name || 'Название' )
const descriptionPlaceholder = computed( () => todos.current?.description || 'Описание' )
const expiredAtPlaceholder = computed( () =>
  todos.current?.expired_at
    ? dayjs( todos.current?.expired_at ).format( 'DD.MM.YYYY HH:mm' )
    : 'Дэдлайн'
)

</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Задача"
    :draggable="false"
    dismissable-mask
    :style="{ width: 'calc( 100% - 48px )', maxWidth: '400px' }"
  >
    <div class="flex flex-column gap-2">
      <InputText v-model:model-value="name" :placeholder="namePlaceholder" />
      <Textarea v-model:model-value="description" :placeholder="descriptionPlaceholder" autoResize />
      <Calendar
        v-model:model-value="expired_at"
        :placeholder="expiredAtPlaceholder" dateFormat="dd.mm.yy"
        show-time hour-format="24"
      />
      <div class="flex justify-content-end gap-2">
        <Button
          v-if="todos.current?.id"
          type="button"
          label="Удалить"
          severity="danger"
          text
          @click="remove"
        />
        <Button
          type="button"
          label="Сохранить"
          :disabled="!canSave"
          @click="save"
        />
      </div>
    </div>
  </Dialog>
</template>