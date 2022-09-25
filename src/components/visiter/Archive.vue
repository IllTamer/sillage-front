<template>
  <div>
    <div class="col-xs-8 col-xs-offset-2">
    <!-- top -->
    <div class="archive-title">
      <h2 class="inline">归档</h2>
    </div>
    <!-- archive -->
    <div :key="year" v-for=" (monthEntity, year) in yearMonthMap" class="archive">
      <h2>{{year}}</h2>
      <div :key="month" v-for="(entityList, month) in monthEntity" class="list-group">
        <h3>{{month}}</h3>
        <a :key="minBlog.id" v-for="minBlog in (entityList as unknown as Array<MinBlog>)" :href="`/${NavHref.DETAIL}/${minBlog.id}`" class="list-group-item">
          <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>
          <h3 class="blog-title">{{minBlog.title}}</h3>
          <span class="label-data">{{DateUtil.formatDate(new Date(minBlog.createTime), 'MM月dd日')}}</span>
          <span class="label label-default pull-right hidden-xs hidden-sm">{{BlogFlag[minBlog.flag]}}</span>
        </a>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, Ref, onBeforeMount } from 'vue';
  import { Axios } from '../../ts/axios';
  import { APIHref, NavHref, BlogFlag } from '../../ts/export';
  import { DateUtil } from '../../ts/date';

  let yearMonthMap: Ref<Map<number, Map<number, Array<MinBlog>>>> = ref<any>(null);

  onBeforeMount((): void => {
    Axios
      .get(`/${APIHref.BLOG}/year-month-map`)
      .then((response): void => {
        const resp: Resp = response.data;
        yearMonthMap.value = resp.data;
      })
  });
</script>

<style scoped lang="less">
  .archive {
    h2, h3 {
      text-align: center;
    }
    h3.blog-title {
      display: inline;
      font-size: 15px;
      color: gray;
      margin-left: 6px;
    }
  }

  .archive-title {
      text-align: center;
      border-bottom: solid;
      border-top: solid;
      border-color: #e1e0e0;
      h2 {
        font-weight: bold;
        margin: 20px auto;
    }
  }

  .label-data {
      border: solid 1px gray;
      border-radius: 4px;
      padding: 3px;
      margin-left: 6px;
      font-size: 75%;
      color: gray;
  }
</style>