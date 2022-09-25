<template>
  <ul class="list-group">
    <transition-group name="fade">
      <li :key="index" v-for="(homeBlog, index) in records" class="list-group-item mid-li">
        <div class="row content">
          <div class="col-xs-8 padding left_content">
            <h4 class="title">
              <a @click="toDetail(homeBlog.id, router)">{{ homeBlog.title }}</a>
            </h4>
            <p class="summary">{{ homeBlog.summary }}</p>
            <div class="row">
              <div class="col-xs-9">
                <ul class="list-inline">
                  <li>
                    <img class="user-icon img-thumbnail img-circle" :src="homeBlog.minUser.avatar" alt="">
                    <a @click="router.push({ name: 'about' })">{{ homeBlog.minUser.nick }}</a>
                  </li>
                  <li>
                    <span class="glyphicon glyphicon-calendar" aria-hidden="true"></span>
                    <span>{{ DateUtil.format(homeBlog.createTime) }}</span>
                  </li>
                  <li>
                    <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
                    <span>{{ homeBlog.views }}</span>
                  </li>
                </ul>
              </div>
              <div class="col-xs-3 duplicate-tag">
                <a :key="tag.id" v-for="tag in homeBlog.tags" @click="jump('tag', tag.id, router)"
                  class="label label-success duplicate-label">{{ tag.name }}</a>
              </div>
            </div>
          </div>
          <div class="col-xs-4 mid-center right_content">
            <a @click="toDetail(homeBlog.id, router)">
              <img class="img-rounded img-responsive" :src="homeBlog.cover" alt="">
            </a>
          </div>
        </div>
      </li>
    </transition-group>
  </ul>
</template>

<!-- BlogPage为纯渲染组件，页面状态由外部维护，无需Suspense与KeepAlive -->
<script setup lang="ts">
  import { ref, Ref, watch } from 'vue';
	import { useRouter } from 'vue-router';
  import { jump, toDetail, NavHref } from '../../ts/export';
	import { DateUtil } from '../../ts/date';

  const router = useRouter();
  // 监听 props 属性要通过返回值，解构出的值会失去响应式
  // https://cn.vuejs.org/guide/extras/reactivity-transform.html#reactive-props-destructure
	const props = defineProps<{pages: Page<HomeBlog>}>();
  
  let records: Ref<Array<HomeBlog>> = ref([]);

  // 便捷调用响应式参数的内部属性
  watch(() => props.pages, (now) => {
    records.value = [];
    setTimeout(() => recursionToLoad(now.records, 0, now.records.length), 150);
  }, {
    immediate: true
  });

  function recursionToLoad(list: Array<HomeBlog>, index: number, length: number) {
    setTimeout(() => {
      if (index == length) return;
      records.value.push(list[index]);
      recursionToLoad(list, index+1, length);
    }, 125);
  }
</script>

<style scoped lang="less">
	.content {
    height: 200px;
  }
  .left_content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .right_content {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .summary {
    text-indent: 2em;
    color: gray;
    font-weight: 300;
    letter-spacing: 1px; 
    line-height: 1.8;
		margin-bottom: 8px;
		word-wrap: break-word;
		.muti-line-limit(3);
  }
	.title {
    font-weight: 700;
		.muti-line-limit(2);
	}
	.padding {
    padding: 24px 24px 0 24px;
	}

	// 多行文字限高
	.muti-line-limit(@line) when (isnumber(@line)) {
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: @line;
	}

    // Transition 效果
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.35s ease-out;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>