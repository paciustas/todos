import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'

import router from '@/app/router'
import App from '@/app'

createApp( App )
  .use( createPinia() )
  .use( router )
  .use( PrimeVue )
  .directive( 'tooltip', Tooltip )
  .mount( '#app' )
