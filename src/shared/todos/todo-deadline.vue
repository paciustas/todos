<script setup lang="ts">
import Tag from 'primevue/tag'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { computed } from 'vue'
const props = defineProps<{
  expired_at: string
}>()

const severity = computed( () => {
  const hours = dayjs( props.expired_at ).diff( dayjs(), 'hour' )
  if ( hours < 24 ) {
    return 'danger'
  }
  if ( hours < 24 * 2 ) {
    return 'warning'
  }
  return 'contrast'
} )

const text = computed( () => {
  dayjs.locale( 'ru' )
  dayjs.extend( relativeTime )
  return dayjs( props.expired_at ).fromNow()
} )

// new Intl.RelativeTimeFormat

</script>

<template>
  <Tag icon="pi pi-clock" :severity="severity" :value="text" />
</template>