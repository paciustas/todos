import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { TodoEntity } from '@/shared/types.ts'
import dayjs from 'dayjs'

export const useTodosStore = defineStore( 'todos', () => {

  const lsk = 'todos'

  const persistent = localStorage.getItem( lsk )

  const items = ref<TodoEntity[]>( persistent ? JSON.parse( persistent ) : [] )

  watch( [ items, items.value ], () => {
    localStorage.setItem( lsk, JSON.stringify( items.value ) )
  } )

  const currentId = ref<number | null>( null )

  const current = computed<TodoEntity | null>( () => {
    if ( currentId?.value ) {
      const find = items.value.find( ( { id } ) => id === currentId.value )
      if ( find ) {
        return find
      }
    }
    return null
  } )

  const clearItems = () => {
    items.value = []
  }

  const setItems = ( todos: TodoEntity[] ) => {
    items.value = todos
  }

  const setCurrent = ( id: number | null ) => {
    currentId.value = id
  }

  const addTodo = ( todo: Pick<TodoEntity, 'name' | 'description' | 'completed' | 'expired_at'> ) => {
    items.value.splice( 0, 0, { ...todo, id: Date.now() } )
  }

  const updatedTodo = ( todo: TodoEntity ) => {
    const index = items.value.findIndex( ( { id } ) => id === todo.id )
    if ( index >= 0 ) {
      items.value.splice( index, 1, todo )
    }
  }

  const removeTodo = ( ids: number[] ) => {
    for ( const id of ids ) {
      const index = items.value.findIndex( ( todo ) => todo.id === id )
      if ( index >= 0 ) {
        items.value.splice( index, 1 )
      }
    }
  }

  const setExample = () => {
    const tasks: TodoEntity[] = [
      {
        id: Date.now() + 1,
        name: 'Новая задача',
        description: 'С описанием',
        completed: false,
      },
      {
        id: Date.now() + 2,
        name: 'Задача без описания',
        completed: false,
      },
      {
        id: Date.now() + 3,
        name: 'Выполненная задача',
        completed: true,
      },
      {
        id: Date.now() + 4,
        name: 'Срочный баг-фикс',
        completed: false,
        expired_at: dayjs().add( 1, 'hour' ).format( 'YYYY-MM-DD HH:mm:ss' )
      },
      {
        id: Date.now() + 5,
        name: 'Задача #5',
        completed: false,
        expired_at: dayjs().add( 24 * 1.5, 'hour' ).format( 'YYYY-MM-DD HH:mm:ss' )
      },
      {
        id: Date.now() + 6,
        name: 'Задача #6',
        completed: false,
        expired_at: dayjs().add( 24 * 5, 'hour' ).format( 'YYYY-MM-DD HH:mm:ss' )
      },
    ]
    for ( const task of tasks ) {
      items.value.push( task )
    }
  }

  const setCompleted = ( id: number, status: boolean ) => {
    const index = items.value.findIndex( ( todo ) => todo.id === id )
    if ( index >= 0 ) {
      items.value.splice( index, 1, {
        ...items.value[ index ],
        completed: status,
      } )
    }
  }

  return {
    items,
    addTodo,
    updatedTodo,
    removeTodo,
    setCurrent,
    setCompleted,
    current,
    setExample,
    setItems,
    clearItems,
  }

} )
