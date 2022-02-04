import Vue from 'vue';
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib'
// import Vuetify from 'vuetify/lib/framework'
import VuetifyToast from 'vuetify-toast-snackbar-ng'

Vue.use(Vuetify, {
  components: {
    VSnackbar,
    VBtn,
    VIcon
  }
});

Vue.use(VuetifyToast, {
	x: 'middle', // default
	y: 'top', // default
	iconColor: '', // default
	classes: [
		'body-2'
	],
	timeout: 3000, // default
	dismissable: true, // default
	multiLine: false, // default
	vertical: false, // default
	queueable: false, // default
	showClose: false, // default
	closeText: '', // default
	closeIcon: 'mdi-close', // default
	closeColor: '', // default
	slot: [], //default
	shorts: {
		custom: {
			color: 'purple'
		}
	},
	property: '$toast' // default
})

export default new Vuetify({
});
