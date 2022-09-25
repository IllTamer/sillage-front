<template>
  <div>
    <div class="col-sm-8 col-sm-offset-2">
      <!-- top -->
      <div class="panel panel-default panel-body">
        <h3 class="inline">分类</h3> <span class="pull-right">共 <h3 v-if="pages != null" class="inline">{{pages.total}}</h3> 篇</span>
      </div>
      <!-- types -->
      <div class="panel panel-default panel-body">
        <ul v-if="typeList.length != 0" class="nav nav-pills types" role="tablist">
          <li :key="type.id" v-for="(type) in typeList" :class="`${type.id == currentTypeId ? 'active' : null}`" role="presentation">
            <a @click="currentTypeId = type.id">
              {{type.name}}
            </a>
          </li>
        </ul>
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
  let currentIndex: Ref<number> = ref(0);
  // 当前类型
  let currentTypeId: Ref<number> = ref(0);
  // 分类列表
  let typeList: Ref<Array<Type>> = ref([]);
  // 分页
  let pages: Ref<Page<HomeBlog>> = ref<any>(null);

  onBeforeMount((): void => {
    const typeId = router.query.id;
    Axios
      .get(`/${APIHref.TYPE}/list`)
      .then((response): void => {
        const resp: Resp = response.data;
        typeList.value = resp.data;
        currentIndex.value = 1;
        currentTypeId.value = typeId != undefined ? Number(typeId) : typeList.value[0].id;
      })
  });

  watch(currentIndex, (now) => {
    refresh(currentTypeId.value, now);
  });

  watch(currentTypeId, (now) => {
    refresh(now, currentIndex.value = 1);
  });

  function refresh(typeId: number, index: number): void {
    Axios
      .get(`/${APIHref.BLOG}/by-type/${typeId}/${index}`)
      .then((response): void => {
        const resp: Resp = response.data;
        pages.value = resp.data;
      })
  }
</script>

<style scoped lang="less">
  .types {
    li {
      margin: 5px 10px!important;
      border: solid 1px skyblue;
      border-radius: 8px;
      opacity: 0.9;
      &>a {
        padding: 4px 9px;
      }
      &.active {
        opacity: 1;
        a, a:hover {
          background-color: lightseagreen;
        }
      }
    }
  }
  ul > li.active {
      background-color: gray!important;
  }
</style>