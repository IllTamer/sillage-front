<template>
  <div>
    <div class="col-sm-8 col-sm-offset-2">
      <!-- top -->
      <div class="panel panel-default panel-body">
        <h3 class="inline">标签</h3> <span class="pull-right">共 <h3 v-if="pages != null" class="inline">{{pages.total}}</h3> 篇</span>
      </div>
      <!-- types -->
      <div class="panel panel-default panel-body">
        <div v-if="tagList.length != 0" class="types">
          <span :key="tag.id" v-for="tag in tagList" :class="`${tag.id == currentTagId ? 'active' : null}`">
            <a @click="currentTagId = tag.id" class="label label-success">
              {{tag.name}}
            </a>
          </span>
        </div>
      </div>
      <!-- content -->
      <BlogPage v-if="pages != null" :pages="pages"></BlogPage>
      <!-- bottom -->
      <div v-if="pages != null" class="panel panel-body panel-default">
        <a :class="`btn btn-default pull-left ${pages.current > 1 ? '' : 'disabled'}`" type="button"
          @click="-- currentIndex">上一页</a>
        <a :class="`btn btn-default pull-right ${pages.current < pages.pages ? '' : 'disabled'}`" type="button"
          @click="++ currentIndex">下一页</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, Ref, onBeforeMount, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { Axios } from '../../ts/axios';
  import { APIHref } from '../../ts/export';
  import BlogPage from '../fragment/BlogPage.vue';

  const router = useRoute();
  // 当前索引
  let currentIndex: Ref<number> = ref(1);
  // 当前标签
  let currentTagId: Ref<number> = ref(0);
  // 分页
  let pages: Ref<Page<HomeBlog>> = ref<any>(null);
  // 标签列表
  let tagList: Ref<Array<Tag>> = ref([]);

  onBeforeMount((): void => {
    const tagId = router.query.id;
    Axios
      .get(`/${APIHref.TAG}/list`)
      .then((response): void => {
        const resp: Resp = response.data;
        tagList.value = resp.data;
        currentTagId.value = tagId != undefined ? Number(tagId) : tagList.value[0].id;
      })
  });

  watch(currentIndex, (now) => {
    refresh(currentTagId.value, now);
  });

  watch(currentTagId, (now) => {
    refresh(now, currentIndex.value = 1);
  });

  function refresh(tagId: number, index: number): void {
    Axios
      .get(`/${APIHref.BLOG}/by-tag/${tagId}/${index}`)
      .then((response): void => {
        const resp: Resp = response.data;
        pages.value = resp.data;
      })
  }
</script>

<style scoped lang="less">
  .types {
    & > span {
      display: inline-block;
      padding: 4px 5px 7px 5px!important;
      opacity: 0.7;
    }
    & > span.active {
      border: gray solid 1px;
      border-radius: 8px;
      opacity: 1;
    }
  }
</style>