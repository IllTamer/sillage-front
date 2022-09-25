<template>
  <div>
    <!-- left text -->
    <div class="col-xs-8">
      <div class="panel panel-default">
        <!-- top -->
        <div class="panel-body">
          <h3 class="inline">博客列表</h3>
          <span class="pull-right">共 <h3 v-if="pages != null" class="inline">{{pages.total}}</h3> 篇</span>
        </div>
        <!-- content -->
        <BlogPage v-if="pages != null" :pages="pages"></BlogPage>
        <!-- bottom -->
        <div v-if="pages != null" class="panel-body">
          <a :class="`btn btn-default pull-left ${pages.current > 1 ? '' : 'disabled'}`" type="button" @click="-- currentIndex">上一页</a>
          <a :class="`btn btn-default pull-right ${pages.current < pages.pages ? '' : 'disabled'}`" type="button" @click="++ currentIndex">下一页</a>
        </div>
      </div>
    </div>
    <!-- right top -->
    <div class="col-xs-3 col-xs-offset-1">
      <!-- types -->
      <div class="panel panel-default">
        <div class="panel-heading">
          <span class="glyphicon glyphicon-th-list"></span>
          分类
          <RouterLink class="pull-right" :to="{ name: 'type' }">More ></RouterLink>
        </div>
        <div class="panel-body">
          <div class="list-group">
            <a :key="countType.id" v-for="countType in countTypeList" @click="jump('type', countType.id, router)" class="list-group-item">
              <span>{{countType.name}}</span>
              <span class="badge hidden-xs hidden-sm">{{countType.blogCount}}</span>
            </a>
          </div>
        </div>
      </div>
      <!-- tags -->
      <div class="panel panel-default">
        <div class="panel-heading">
          <span class="glyphicon glyphicon-tags"></span>
          标签
          <RouterLink class="pull-right" :to="{ name: 'tag' }">More ></RouterLink>
        </div>
        <div class="panel-body content-edge">
          <a :key="tag.id" v-for="tag in tagList" @click="jump('tag', tag.id, router)" class="label label-success">
            {{tag.name}}
          </a>
        </div>
      </div>
      <!-- nearly -->
      <div class="panel panel-default">
        <div class="panel-heading">
          <span class="glyphicon glyphicon-book"></span>
          最新文章
        </div>
        <ul class="list-group">
          <a :key="minBlog.id" v-for="minBlog in latestMinBlogList" @click="toDetail(minBlog.id, router)" class="list-group-item">
            <span>{{`[${BlogFlag[minBlog.flag]}]`}}</span>
            {{minBlog.title}}
          </a>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, Ref, onBeforeMount, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { Axios } from '../../ts/axios';
  import { jump, toDetail, APIHref, BlogFlag } from '../../ts/export';
  import BlogPage from '../fragment/BlogPage.vue'

  const router = useRouter();
  // 当前索引
  let currentIndex: Ref<number> = ref(0);
  // 计数类型列表
  let countTypeList: Ref<Array<CountType>> = ref([]);
  // 标签列表
  let tagList: Ref<Array<Tag>> = ref([]);
  // 最新文章列表
  let latestMinBlogList: Ref<Array<MinBlog>> = ref([]);
  // 分页
  let pages: Ref<Page<HomeBlog>> = ref<any>(null);

  onBeforeMount((): void => {
    Axios
      .get(`/${APIHref.TYPE}/count-list`)
      .then((response): void => {
        const resp: Resp = response.data;
        countTypeList.value = resp.data;
      });
    Axios
      .get(`/${APIHref.TAG}/list`)
      .then((response): void => {
        const resp: Resp = response.data;
        tagList.value = resp.data;
      })
    Axios
      .get(`/${APIHref.BLOG}/latest-list`)
      .then((response): void => {
        const resp: Resp = response.data;
        latestMinBlogList.value = resp.data;
      });
    currentIndex.value = 1;
  });

  watch(currentIndex, (now): void => {
    refresh(now);
  })

  // 刷新指定页数的数据
  function refresh(index: number) {
    Axios
      .get(`/${APIHref.BLOG}/${index}`)
      .then((response): void => {
        const resp: Resp = response.data;
        pages.value = resp.data;
      })
  }
</script>

<style scoped lang="less">

</style>