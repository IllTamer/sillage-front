<template>
  <Navbar></Navbar>
  <div class="container">
    <div class="row m-container">
      <RouterView v-slot="{ Component }">
        <!-- keep-alive 加载时必须保证能读到非空组件 -->
        <template v-if="Component">
          <!-- 动画节点要求可变组件必须仅有一个根节点div -->
          <Transition mode="out-in" name="fade">
            <KeepAlive>
              <Suspense>
                <component :is="Component"></component>
                <!-- <template #fallback>
                  loading ... （用不上，组件加载后才调 api
                </template> -->
              </Suspense>
            </KeepAlive>
          </Transition>
        </template>
      </RouterView>
    </div>
  </div>
  <Footer></Footer>
</template>

<!-- TODO 定时刷新浏览次数 -->
<script setup lang="ts">
  import { watch, ref, Ref, markRaw } from 'vue';

  import Navbar from './components/fragment/Navbar.vue'
  import Footer from './components/fragment/Footer.vue';

  // const detail = ref<typeof Detail>(null as any);
  // onMounted((): void => {
  //   detail.value.setProps(11);
  // });

  // const search = ref<typeof Search>(null as any);
  // onMounted((): void => {
  //   search.value.setProps('docker');
  // })
</script>

<style lang="less">
  @import '../public/css/common.less';
  @import '../public/css/admin-commons.less';
  // Transition 效果
  .fade {
    &-enter-active,
    &-leave-active {
      transition: opacity 0.125s linear;
    }
    &-enter-from,
    &-leave-to {
      opacity: 0;
    }
  }
</style>
