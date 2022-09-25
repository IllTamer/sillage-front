<template>
  <div>
    <div class="col-sm-8 col-sm-offset-2">
      <!-- items -->
      <div class="m-table">
        <table class="table table-hover">
          <thead>
            <tr>
              <th></th>
              <th>名称</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody v-if="pages">
            <tr :key="tag.id" v-for="(tag, index) in pages.records">
              <td>{{index + 1 + (pages.current-1) * pages.size}}</td>
              <td>{{tag.name}}</td>
              <td class="split">
                <a class="btn btn-add" @click="modify(tag)" href="#">编辑</a>
                <a class="btn btn-delete" @click="remove(tag.name, tag.id)">删除</a>
              </td>
            </tr>
          </tbody>
          <tfoot v-if="pages">
            <tr>
              <th colspan="3">
								<div class="btn-group" role="group">
									<button :class="'btn btn-common ' + (pages.current > 1 ? '' : 'disabled')" type="button"
										@click="refresh(pages.current - 1)">上一页</button>
									<button :class="'btn btn-common ' + (pages.current < pages.pages ? '' : 'disabled')" type="button" 
                    @click="refresh(pages.current + 1)">下一页</button>
								</div>
                <a class="btn btn-default pull-right" href="#" @click="create">创建</a>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- 提交表单 -->
      <el-dialog v-model="dialogVisible" :title="dialogTitle" align-center>
        <el-form :model="formTag">
          <el-form-item label="name">
            <el-input v-model="formTag.name" placeholder="name"/>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
            <el-button type="primary" @click="() => {dialogVisible = false; submit()}">提交</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
	import { ref, Ref, onBeforeMount, watch } from 'vue';
	import { Axios, headers } from '../../ts/axios';
	import { APIHref } from '../../ts/export';

  // 当前索引
	let currentIndex: Ref<number> = ref(0);
  // 分类分页
  let pages: Ref<Page<Tag>> = ref<any>(null);
  // 编辑(新增)类型
  let formTag: Ref<Tag> = ref<any>(null);
  // 弹出框是否可见
  let dialogVisible: Ref<boolean> = ref<any>(null);
  // 弹出框标题
  let dialogTitle: Ref<string> = ref('');

  onBeforeMount((): void => {
    currentIndex.value = 1;
  });

  watch(currentIndex, (now) => {
    refresh(now);
  });

  function refresh(index: number) {
    Axios
      .get(`/${APIHref.TAG}/${index}`)
      .then((response): void => {
        const resp: Resp = response.data;
        pages.value = resp.data;
      });
  };

  // 修改 tag 内容
  function modify(tag: Tag) {
    formTag.value = tag;
    dialogTitle.value = '修改类型';
    dialogVisible.value = true;
  }

  // 创建 tag
  function create() {
    formTag.value = {id: 0, name: null as any};
    dialogTitle.value = '新建类型';
    dialogVisible.value = true;
  }

  function submit() {
    let request;
    if (formTag.value.id == 0) {
      // create
      request = Axios
      .post(`/${APIHref.ADMIN_TAG}`, {
        name: formTag.value.name
      }, {
        headers: headers
      });
    } else {
      // update
      request = Axios
      .put(`/${APIHref.ADMIN_TAG}`, {
        id: formTag.value.id,
        name: formTag.value.name
      }, {
        headers: headers
      });
    }
    request.then((resp) => {
      alert('请求' + (resp.data as Resp).data ? '成功' : '失败');
      refresh(currentIndex.value = 1);
    });
  }

  function remove(tagName: string, tagId: number) {
    if (!confirm('您确认要删除类型: \n\t' + tagName + ' 吗?')) return;
    Axios
      .delete(`/${APIHref.ADMIN_TAG}/${tagId}`, {
        headers: headers
      })
      .then((response): void => {
        const resp: Resp = response.data;
        alert('删除' + (resp.data ? '成功' : '失败'));
        refresh(currentIndex.value = 1);
      });
  }
</script>

<style scoped lang="less">
  .split {
    & > a {
      margin-right: -110px;
    }
  }
</style>