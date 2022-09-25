import { ElMessage } from 'element-plus';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { Base64 } from '../ts/export';

export const visiterRoutes: Array<RouteRecordRaw> = [{
  name: 'blog',
  path: '/',
  component: () => import('../components/visiter/Blog.vue')
}, {
  name: 'type',
  path: '/type',
  component: () => import('../components/visiter/Type.vue')
}, {
  name: 'tag',
  path: '/tag',
  component: () => import('../components/visiter/Tag.vue')
}, {
  name: 'archive',
  path: '/archive',
  component: () => import('../components/visiter/Archive.vue')
}, {
  name: 'resource',
  path: '/resource',
  component: () => import('../components/visiter/Resource.vue')
}, {
  name: 'music',
  path: '/music',
  component: () => import('../components/visiter/Music.vue')
}, {
  name: 'about',
  path: '/about',
  component: () => import('../components/visiter/About.vue')
}];

export const otherRoutes: Array<RouteRecordRaw> = [{
  name: 'search',
  path: '/search',
  component: () => import('../components/visiter/Search.vue')
}, {
  name: 'detailBlog',
  path: '/blog/detail/:id',
  component: () => import('../components/visiter/Detail.vue')
}];

export const userRoutes: Array<RouteRecordRaw> = [{
  name: 'userLogin',
  path: '/user/login',
  component: () => import('../components/user/UserLogin.vue')
}]; 

export const adminRoutes: Array<RouteRecordRaw> = [{
  name: 'blogAdmin',
  path: '/admin/blog',
  component: () => import('../components/admin/BlogManager.vue'),
}, {
  name: 'typeAdmin',
  path: '/admin/type',
  component: () => import('../components/admin/TypeManager.vue')
}, {
  name: 'tagAdmin',
  path: '/admin/tag',
  component: () => import('../components/admin/TagManager.vue')
}, {
  name: 'musicAdmin',
  path: '/admin/music',
  component: () => import('../components/admin/MusicManager.vue')
}, {
  name: 'detailAdmin',
  path: '/admin/blog/detail/:id',
  component: () => import('../components/admin/DetailManager.vue')
}]

const routes: Array<RouteRecordRaw> = visiterRoutes.concat(otherRoutes, userRoutes, adminRoutes);

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  // 跳转后页面回到顶部
  scrollBehavior: (to: any, from: any, saveTop: any) => {
    if (saveTop) {
      return saveTop;
    } else {
      return { x: 0, y: 0 }
    }
  }
});

/**
 * 全局前置路由守卫，每一次路由跳转前都进入这个 beforeEach 函数
 */
router.beforeEach((to, from, next) => {
  // 获取 token
  const token = localStorage.getItem('token');
  if (token != null && token.length != 0 && !expAvailable(token)) {
    localStorage.removeItem('token');
  }

  if (!to.path.startsWith('/admin')) {
    next();
  } else {
    // token 不存在
    if (token === null || token === '') {
      ElMessage.error('您还没有登录，请先登录');
      next({ name: 'userLogin' });
      return;
    }
    if (!expAvailable(token)) {
      ElMessage.error('登录已过期，请重新登录！');
      next({ name: 'userLogin' });
      return;
    }
    next();
  }
});

function expAvailable(token: string): boolean {
  // check expresstion
  const infoStr = new Base64().decode(token.split('.')[1]);
  const info :JWTInfo = JSON.parse(`${infoStr.substring(0, infoStr.indexOf('\u0000'))}`);
  return (info.exp * 1000 >= new Date().getTime() + 1000);
}
export { router };