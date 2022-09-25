<template>
  <div v-if="pages != null" class="col-sm-8 col-sm-offset-2">
    <!-- top -->
    <div class="panel-body">
      <h3 class="inline">搜索结果</h3> <span class="pull-right">共 <h3 class="inline">{{pages.total}}</h3> 篇</span>
    </div>
    <!-- content -->
    <BlogPage :pages="pages"></BlogPage>
    <!-- bottom -->
    <div class="panel-body">
      <a :class="`btn btn-default pull-left ${pages.current > 1 ? '' : 'disabled'}`" type="button"
        @click="-- currentIndex">上一页</a>
      <a :class="`btn btn-default pull-right ${pages.current < pages.pages ? '' : 'disabled'}`" type="button"
        @click="++ currentIndex">下一页</a>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onActivated, ref, Ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { Axios } from '../../ts/axios';
  import { APIHref } from '../../ts/export';
  import BlogPage from '../fragment/BlogPage.vue';
  
  const router = useRoute();
  // 当前索引
  let currentIndex: Ref<number> = ref(0);
  // 当前关键字
  let content: Ref<string> = ref('');
  // 分页
  let pages: Ref<Page<HomeBlog>> = ref<any>(null);

  onActivated((): void => {
    content.value = (router.query as any).content;
    currentIndex.value = 1;
  });

  watch([currentIndex, content], (nowArray): void => {
    refresh(nowArray[0]);
  });

  function refresh(index: number): void {
    Axios
      .get(`/${APIHref.BLOG}/search/${index}?content=${content.value}`)
      .then((response): void => {
        const resp: Resp = response.data;
        pages.value = resp.data;
      })
  }
</script>

<style scoped lang="less">
</style>