<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/logo.png" @click="ffs=1">
		{{ffs}}
		<!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
		<Example />
	</div>
</template>
<script>
	// import HelloWorld from './components/index.vue'
	export default {
		provide() {
			return {
				parentValue: '我是父组件的值啊',
				isbaba: this,
			}
		},
		components: {
			// HelloWorld,
		},
		data() {
			return {
				ffs: '2122',
			}
		},
		setup() {
			// console.log(instance)
		},
	}
</script>
