<template>
  <div>
    <h3>博客发布</h3>
    <div class="col-sm-10 col-sm-offset-1">
      <form id="article-form" v-if="blog">
        <!-- title -->
        <div class="input-group">
          <div class="input-group-btn">
            <input type="hidden" id="flag" value="0">
            <select class="form-control" v-model="blog.flag" title="fileType">
              <option :value="0" select @click="blog.flag = 0">原创</option>
              <option :value="1" @click="blog.flag = 1">转载</option>
            </select>
          </div>
          <input class="form-control" type="text" placeholder="标题" v-model="blog.title" required>
        </div>
        <!-- cover -->
        <div class="input-group interval">
          <span class="input-group-addon" id="image-addon">Cover</span>
          <input id="cover" v-model="blog.cover" type="text" class="form-control" aria-describedby="image-addon" placeholder="http(s):// ..." required>
        </div>
        <!-- types & tags -->
        <div class="row interval">
          <!-- types -->
          <div class="col-sm-6">
            <div class="input-group">
              <span class="input-group-addon" id="article-type-addon">分类</span>
              <el-select class="select m-2" v-model="blog.typeId" placeholder="Select type">
                <el-option :key="type.id" v-for="(type) in typeList" :label="type.name" :value="type.id"/>
              </el-select>
            </div>
          </div>
          <!-- tags -->
          <div class="col-sm-6">
            <div class="input-group">
              <span class="input-group-addon" id="article-tag-addon">标签</span>
              <el-select v-model="blog.tagIdList" multiple placeholder="Select tags" class="selectpicker select">
                <el-option v-for="tag in tagList" :key="tag.id" :label="tag.name" :value="tag.id"/>
              </el-select>
            </div>
          </div>
        </div>
        <!-- summary -->
        <div class="interval">
          <textarea v-model="blog.summary" class="form-control" rows="3" placeholder="摘要..." required></textarea>
        </div>
        <!-- content -->
        <div class="interval">
          <div id="eritor-md-content">
            <EditorMD v-model="blog.content" class="form-control editor-md" placeholder="正文..." required></EditorMD>
          </div>
        </div>
        <!-- other options -->
        <div class="interval">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="recommend" v-model="blog.recommend" />
            <label class="form-check-label" for="recommend">推荐</label>
            <input class="form-check-input" type="checkbox" id="appreciation" v-model="blog.appreciation" />
            <label class="form-check-label" for="appreciation">赞赏</label>
            <input class="form-check-input" type="checkbox" id="shareStatement" v-model="blog.shareStatement" />
            <label class="form-check-label" for="shareStatement">转载声明</label>
            <input class="form-check-input" type="checkbox" id="commentable" v-model="blog.commentable" />
            <label class="form-check-label" for="commentable">评论</label>
          </div>
        </div>
        <!-- button -->
        <div class="interval pull-right">
          <div class="btn btn-default" onclick="window.history.go(-1)">返回</div>
          <div class="btn btn-default" @click="submit(false)">保存</div>
          <div class="btn btn-success" @click="submit(true)">发布</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, Ref, onActivated } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import EditorMD from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';
  import { Axios, headers } from '../../ts/axios';
  import { APIHref } from '../../ts/export';
  import { DateUtil } from '../../ts/date';

  const router = useRouter();
  const route = useRoute();
  const blog: Ref<PublishBlog> = ref<any>(null);
  // 分类列表
  let typeList: Ref<Array<Type>> = ref([]);
  // 标签列表
  let tagList: Ref<Array<Tag>> = ref([]);

  onActivated((): void => {
    init();
    blog.value.id = Number(route.params.id);
    // 新增返回
    if (blog.value.id == -1) return;
    // request PublishBlog
    Axios
      .get(`/${APIHref.ADMIN_BLOG}/${blog.value.id}`, {
        headers: headers
      }).then((response): void => {
        const resp: Resp = response.data;
        blog.value = resp.data;
      });
  });

  function init() {
    blog.value = {
    // 当前博客Id，为 -1 则代表新建
    id: -1,
    title: null as any,
    // markdown content
    content: '',
    summary: null as any,
    cover: null as any,
    flag: 0,
    views: 0,
    appreciation: true,
    shareStatement: true,
    commentable: true,
    recommend: true,
    published: true,
    createTime: null as any,
    updateTime: null as any,
    typeId: null as any,
    tagIdList: []
  }
    Axios
      .get(`/${APIHref.TYPE}/list`)
      .then((response): void => {
        const resp: Resp = response.data;
        typeList.value = resp.data;
      });
    Axios
      .get(`/${APIHref.TAG}/list`)
      .then((response): void => {
        const resp: Resp = response.data;
        tagList.value = resp.data;
      });
    blog.value.content = `#### Disabled options
  - TeX (Based on KaTeX);
  - Emoji;
  - Task lists;
  - HTML tags decode;
  - Flowchart and Sequence Diagram;`
  }

  // 提交博文
  function submit(publish: boolean) {
    blog.value.published = publish;
    console.log(blog.value);
    if (empty(blog.value.title) || empty(blog.value.content) || empty(blog.value.summary) || empty(blog.value.cover)) {
      alert('标题 / 正文 / 摘要 / 封面 不为空！');
      return;
    }
    if (blog.value.typeId == null || blog.value.typeId == 0) {
      alert('请选择博文分类')
      return;
    }
    
    blog.value.updateTime = new Date().toISOString();
    if (blog.value.createTime == null)
      blog.value.createTime = blog.value.updateTime; 
    //  save(insert / update) blog
    Axios
      .post(`/${APIHref.ADMIN_BLOG}`, blog.value, {
        headers: headers
      })
      .then((response): void => {
        const resp: InsertResp = (response.data as Resp).data;
        alert('请求' + resp.success ? '成功' : '失败');
        router.push({
          name: 'detailBlog',
          params: {
            id: resp.objectId
          }
        })
      });
  }

  function empty(s: string): boolean {
    return s == null || s.length == 0;
  }
</script>

<style scoped lang="less">
  /* 修复 form-control width: 100% 导致的兼容问题 */
  form > div.input-group select.form-control {
    width: auto;
  }

  form div.interval {
    padding-top: 20px;
    .btn {
      margin-left: 10px;
    }
  }

  .form-check > label {
    padding-right: 8px;
  }

  h3 {
    text-align: center;
  }

  .select {
    width: 100%;
  }

  .editor-md {
    height: 640px;
    width: 100%;
  }
</style>