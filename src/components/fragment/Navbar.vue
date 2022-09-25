<template>
  <nav class="navbar navbar-default">
    <div class="container">
      <div class="navbar-header">
        <RouterLink replace :to="{name: (admin ? visiterRoutes[0].name : adminRoutes[0].name)}" class="navbar-brand" @click="admin = !admin">sillage</RouterLink>
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#index-navbar-collapse">
          <span class="sr-only">切换导航</span>
          <span v-for="i in 3" class="icon-bar"></span>
        </button>
      </div>
      <div class="collapse navbar-collapse" id="index-navbar-collapse">
        <ul class="nav navbar-nav">
          <li :key="i" v-for="(navElement, i) in navList" :class="i == index ? 'active' : ''">
            <RouterLink :to="{name: routes[i].name}" @click="index = i">
              <span :class="`glyphicon ${navElement.icon}`" aria-hidden="true"></span>
              {{ navElement.name }}
            </RouterLink>
          </li>
        </ul>
        <!-- search -->
        <form v-if="!admin" :action="`/${NavHref.SEARCH}`" class="navbar-form navbar-right" role="search">
          <div class="input-group">
            <input name="content" v-model="searchContent" type="text" class="form-control" placeholder="搜索...">
            <span class="input-group-addon">
              <RouterLink :to="{name: 'search'}" class="glyphicon glyphicon-search" aria-hidden="true" @click="search" ></RouterLink>
            </span>
          </div>
        </form>
        <!-- user icon -->
        <div v-else class="dropdown navbar-user-icon">
          <button class="btn dropdown-toggle navbar-right" type="button" id="userMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            <img class="user-icon img-thumbnail img-circle" th:src="${avatar}" alt="">
              <!-- TODO userData -->
              IllTamer
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="userMenu">
            <li><a href="#">TODO1</a></li>
            <li><a href="#">TODO2</a></li>
            <li><a href="#">TODO3</a></li>
            <li role="separator" class="divider"></li>
            <li><a href="/login/out">Login out</a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>
  
<script setup lang="ts">
  import { ref, Ref, watch, onBeforeMount } from 'vue';
  import { useRouter, RouteRecordRaw } from 'vue-router';
  import { NavHref } from '../../ts/export';
  import { visiterRoutes, adminRoutes } from '../../router/index';

  const router = useRouter();
  // 当前页面索引
  const index = ref(0);
  const admin: Ref<boolean> = ref(false);
  // 当前路由组
  const routes: Ref<Array<RouteRecordRaw>> = ref([]);
  // 当前标签组
  const navList: Ref<Array<NavElement>> = ref([]);
  // 搜索内容
  const searchContent: Ref<string> = ref('');

  onBeforeMount(() => {
    window.addEventListener('admin', () => {
      admin.value = Boolean(sessionStorage.getItem('admin'));
    });
    window.addEventListener('nav-index', () => {
      index.value = Number(sessionStorage.getItem('nav-index'))
    })
    refresh(false);
  });

  watch(admin, (now: boolean) => {
    index.value = 0;
    refresh(now);
  });

  function refresh(isAdmin: boolean) {
    routes.value = isAdmin ? adminRoutes : visiterRoutes
    navList.value = isAdmin ? [
      { name: '博客管理', icon: 'glyphicon-book' },
      { name: '分类管理', icon: 'glyphicon-th-list' },
      { name: '标签管理', icon: 'glyphicon-tags' },
      { name: '音乐管理', icon: 'glyphicon-music' }
    ] : [
      { name: '首页', icon: 'glyphicon-home' },
      { name: '分类', icon: 'glyphicon-th-list' },
      { name: '标签', icon: 'glyphicon-tags' },
      { name: '归档', icon: 'glyphicon-list-alt' },
      { name: '资源', icon: 'glyphicon-folder-open' },
      { name: '音乐', icon: 'glyphicon-music' },
      { name: '关于', icon: 'glyphicon-tent' }
    ]
  }

  function search() {
    router.push({
      name: 'search',
      query: {
        content: searchContent.value
      }
    })
    // searchContent.value = '';
  } 
</script>

<style scoped lang="less">
  /* navbar */
  .navbar-user-icon {
    .btn {
      background-color: #F8F8F8;
      &:hover {
        background-color: #E7E7E7;
      }
    }
    ul {
      left: auto;
      right: -95px;
      top: 52px;
    }
  }
</style>