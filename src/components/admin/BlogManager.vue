<template>
	<div>
		<div class="col-xs-10 col-xs-offset-1">
			<div class="panel panel-default">
				<!-- search -->
				<div class="panel-body">
					<div>
						<div class="form-group form-row">
							<div class="col-xs-5">
								<input type="text" class="form-control" v-model="searchTitle" placeholder="标题" required>
							</div>
							<div class="col-xs-3">
								<div class="form-group">
                  <el-select v-model="searchType" placeholder="分类" clearable>
                    <el-option
                      v-for="(type) in typeList"
                      :key="type.id"
                      :label="type.name"
                      :value="type.name"
                      @click="searchType = type"
                    />
                  </el-select>
								</div>
							</div>
							<div class="col-xs-2 li-center">
								<input class="checkbox" id="recommend" type="checkbox" @click="searchRecommend = (searchRecommend == null) ? true : (null as any)">
								<label for="recommend">推荐</label>
							</div>
							<div class="col-xs-2">
								<button class="btn btn-default" @click="search">
									<span class="glyphicon glyphicon-search"></span>
									搜索
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- items -->
			<div class="m-table" id="blogListContent">
				<table th:fragment="blogList" class="table table-hover">
					<thead>
						<tr>
							<th></th>
							<th>标题</th>
							<th>类型</th>
							<th>推荐</th>
							<th>浏览次数</th>
							<th>更新时间</th>
							<th>状态</th>
							<th>操作</th>
						</tr>
					</thead>
					<tbody v-if="pages">
						<tr :key="manageBlog.id" v-for="(manageBlog, index) in pages.records">
							<td>{{index + 1 + (pages.current-1) * pages.size}}</td>
							<td>{{manageBlog.title}}</td>
							<td>{{manageBlog.type.name}}</td>
							<td><span v-show="manageBlog.recommend" class="glyphicon glyphicon-ok"></span></td>
							<td>{{manageBlog.views}}</td>
							<td>{{DateUtil.format(manageBlog.updateTime)}}</td>
							<td>{{manageBlog.published ? '发布' : '草稿'}}</td>
							<td>
								<router-link class="btn btn-add" :to="{ name: 'detailAdmin', params: { id: manageBlog.id } }">编辑</router-link>
								<a class="btn btn-delete" @click="remove(manageBlog.title, manageBlog.id)">删除</a>
							</td>
						</tr>
					</tbody>
					<tfoot v-if="pages">
						<tr>
							<th colspan="8">
								<div class="btn-group" role="group">
									<button :class="'btn btn-common ' + (pages.current > 1 ? '' : 'disabled')" type="button"
										@click="refresh(pages.current - 1)">上一页</button>
									<button :class="'btn btn-common ' + (pages.current < pages.pages ? '' : 'disabled')" type="button" 
                    @click="refresh(pages.current + 1)">下一页</button>
								</div>
                <router-link :to="{ name: 'detailAdmin', params: { id: -1 } }" class="btn btn-default pull-right">发布</router-link>
							</th>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, Ref, onBeforeMount, watch } from 'vue';
	import { Axios, headers } from '../../ts/axios';
	import { APIHref } from '../../ts/export';
    import { DateUtil } from '../../ts/date';

	// 当前索引
	let currentIndex: Ref<number> = ref(0);
    // 筛选标题
    let searchTitle: Ref<string> = ref<string>('');
	// 是否筛选推荐博客
	let searchRecommend: Ref<boolean> = ref<any>(null);
	// 筛选类型
	let searchType: Ref<Type> = ref<any>(null);
    // 分类列表
    let typeList: Ref<Array<Type>> = ref([]);
	// 管理博客页
	let pages: Ref<Page<ManageBlog>> = ref<any>(null);

  onBeforeMount((): void => {
    Axios
      .get(`/${APIHref.TYPE}/list`)
      .then((response): void => {
        const resp: Resp = response.data;
        typeList.value = resp.data;
      });
	currentIndex.value = 1
  });

  watch(currentIndex, (now): void => {
    refresh(now);
  });

	function search() {
    currentIndex.value = 1;
    refresh(1);
	};

	function refresh(index: number) {
		Axios
      .get(`/${APIHref.ADMIN_BLOG}/manage/${index}`, {
        headers: headers,
        params: {
          'title': searchTitle.value.length == 0 ? null : searchTitle.value,
          'typeId': searchType.value == null ? null : searchType.value.id,
          'recommend': searchRecommend.value
        }
      })
      .then((response): void => {
        const resp: Resp = response.data;
        pages.value = resp.data;
      });
	};

  function remove(blogTitle: string, blogId: number) {
    if (!confirm('您确认要删除博客: \n\t' + blogTitle + ' 吗?')) return;
    Axios
      .delete(`/${APIHref.ADMIN_BLOG}/${blogId}`, {
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

</style>