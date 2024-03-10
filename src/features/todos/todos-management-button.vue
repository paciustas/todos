<script setup lang="ts">
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import { computed, ref } from 'vue'
import type { MenuItem } from 'primevue/menuitem'
import { download } from '@/shared'
import { TodoEntity } from '@/shared/types.ts'
import { useTodosStore } from '@/app/store'

const props = defineProps<{
  items: TodoEntity[]
}>()

const todos = useTodosStore()

const menuRef = ref()
const menuItems = computed<MenuItem[]>( () => [
  {
    label: 'Удалить все задачи', icon: 'pi pi-trash',
    disabled: !todos.items.length,
    command: () => {
      todos.clearItems()
    }
  },
  {
    label: 'Экспорт задач', icon: 'pi pi-file-export',
    disabled: !props.items.length,
    command: () => download( JSON.stringify( props.items ), 'todos.json', 'text/plain' ),
  },
  {
    label: 'Импорт задач', icon: 'pi pi-file-import',
    command: async () => {
      // я все понимаю, просто хочу это попробовать
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const [ fileHandle ] = await window.showOpenFilePicker( {
        types: [
          {
            description: 'Data',
            accept: {
              'text/plain': [ '.json' ],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      } )

      const file = await fileHandle.getFile()

      const fileReader = new FileReader()

      fileReader.readAsText( file )

      fileReader.onload = () => {
        if ( typeof fileReader.result === 'string' ) {
          try {
            let json = JSON.parse( fileReader.result )
            if ( Array.isArray( json ) ) {
              json = json.reduce<TodoEntity[]>( ( p, c ) => {
                if ( typeof c === 'object' && c !== null ) {
                  if ( c?.id && c?.name ) {
                    // тут можно каждое поле проверить, но я пропущу этот момент в пользу MVP
                    p.push( {
                      id: c.id,
                      name: c.name,
                      description: c?.description || '',
                      completed: !!c?.completed,
                      expired_at: c?.expired_at || null,
                    } )
                  }
                }
                return p
              }, [] )
              todos.setItems( json )
            }
          } catch ( error ) {
            console.log( error )
          }
        }
      }

      fileReader.onerror = () => {
        console.log( fileReader.error )
      }
    }
  },
] )
const toggle = ( event: MouseEvent ) => menuRef.value.toggle( event )
</script>

<template>
  <Button
    type="button"
    size="small"
    text
    icon="pi pi-ellipsis-v"
    @click="toggle"
  />
  <Menu ref="menuRef" :model="menuItems" :popup="true" />
</template>
