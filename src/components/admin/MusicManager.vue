<template>
  <div>
    <el-row>
      <el-col :span="5">
        <el-button class="full-width" @click="createSongList">Add SongList</el-button>
        <!-- song list -->
        <el-collapse v-if="currentSongList" @change="change" accordion>
          <el-collapse-item :key="songList.id" v-for="(songList, index) in songListArray" :title="songList.name" :name="songList.id">
            <span>{{songList.introduction}}</span>
            <div class="center">
              <el-button link type="primary" @click="modifySongList(songList)">Edit</el-button>
              <el-button link type="danger" @click="removeSongList(index, songList.name, songList.id)">Delete</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
      <el-col :span="16" :offset="3">
        <!-- music list -->
        <el-table :data="currentMusicList" class="full-width tableLimit" max-height="300">
          <el-table-column fixed prop="id" label="Id" width="120" max-height="" />
          <el-table-column prop="name" label="名称" width="120" />
          <el-table-column prop="artist" label="歌手" width="120" />
          <el-table-column prop="theme" label="主题色" width="120" />
          <el-table-column label="音频URL" width="120">
            <template #default="scope">
              <a :href="scope.row.url" target="_blank">{{scope.row.url}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="cover" label="封面URL" width="120">
            <template #default="scope">
              <a :href="scope.row.cover" target="_blank">{{scope.row.cover}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="lrc" label="歌词URL" width="120">
            <template #default="scope">
              <a :href="scope.row.lrc" target="_blank">{{scope.row.lrc}}</a>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click.prevent="removeMusicFromSongList(scope.row.id, scope.$index);"
              >
                Remove
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="full-width" @click="createMusic">Add Music</el-button>
      </el-col>
    </el-row>
    <!-- 歌单提交表单 -->
    <el-dialog v-model="songListDialogVisible" :title="songListDialogTitle">
      <el-form :model="formSongList">
        <el-form-item label="name">
          <el-input v-model="formSongList.name" placeholder="name"/>
        </el-form-item>
        <el-form-item label="introduction">
          <el-input type="textarea" :rows="3" v-model="formSongList.introduction" placeholder="introduction..."></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="songListDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="() => {songListDialogVisible = false; submitSongList()}">提交</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 歌曲提交表单 -->
    <el-dialog v-model="musicDialogVisible" title="上传歌曲">
      <el-form :rules="rules" :model="formMusic" label-position="top" status-icon>
        <el-form-item label="name" prop="name">
          <el-input v-model="formMusic.name" placeholder="name"/>
        </el-form-item>        
        <el-form-item label="artist" prop="artist">
          <el-input v-model="formMusic.artist" placeholder="artist"/>
        </el-form-item>
        <el-form-item label="theme">
          <el-color-picker v-model="formMusic.theme" :predefine="['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585']" />
        </el-form-item>
        <div>
          <el-upload
            drag
            action="http://resource.illtamer.com/upload-music"
            :on-success="musicUploadSuccess"
            :on-remove="musicUploadRemove"
            multiple
            accept=".flac,.jpg,.png,.lrc"
            :limit="3"
          >
            <el-icon class="el-icon--upload"><upload-filled/></el-icon>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
            <template class="el-upload__tip" #tip>
              <div>
                请分别上传 歌曲文件(.flac)、封面图片(.jpg/.png)、歌词文件(.lrc)
              </div>
            </template>
          </el-upload>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="musicDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="() => {musicDialogVisible = false; submitMusic()}">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, Ref, onBeforeMount, watch } from 'vue';
	import { Axios, headers } from '../../ts/axios';
	import { APIHref } from '../../ts/export';
  import { UploadFilled } from '@element-plus/icons-vue'
  import { UploadFile } from 'element-plus/es/components';
  import { FormRules } from 'element-plus/es/tokens';

  // 当前歌单
  let currentSongList: Ref<SongList> = ref<any>(null);
  // 当前歌单歌曲列表
  let currentMusicList: Ref<Array<RespMusic>> = ref([]);
  // 歌单列表
  let songListArray: Ref<Array<SongList>> = ref([]);
  // 编辑(新增)歌单
  let formSongList: Ref<SongList> = ref<any>(null);
  // 歌单弹出框是否可见
  let songListDialogVisible: Ref<boolean> = ref<any>(null);
  // 弹出框标题
  let songListDialogTitle: Ref<string> = ref('');
  // 歌曲弹出框是否可见
  let musicDialogVisible: Ref<boolean> = ref<any>(null);
  // 编辑(新增)歌曲
  let formMusic: Ref<RespMusic> = ref<any>(null);

  const rules = ref<FormRules>({
    name: [
      { required: true, message: 'Please input Activity name', trigger: 'blur' }
    ],
    artist: [
      { required: true, message: 'Please input Activity artist', trigger: 'blur' }
    ]
  })

  onBeforeMount((): void => {
    Axios
      .get(`/${APIHref.MUSIC}/song-list`)
      .then((response): void => {
        const resp: Resp = response.data;
        songListArray.value = resp.data;
        currentSongList.value = songListArray.value[0];
        change(currentSongList.value.id);
      });
  });

  function change(songListId: any) {
    // 关闭时传参为 ''
    if (typeof songListId == 'string' && songListId.length == 0) return;  
    Axios
      .get(`/${APIHref.MUSIC}/list/${songListId}`)
      .then((response): void => {
        const resp: Resp = response.data;
        currentMusicList.value = resp.data;
      });
  }

  function submitMusic() {
    if (!notEmpty(formMusic.value.name) || !notEmpty(formMusic.value.artist)) {
      alert('歌曲名 / 作者 不能为空');
      return;
    }
    if (!notEmpty(formMusic.value.theme)) {
      alert('请选择主题色');
      return;
    }
    if (!notEmpty(formMusic.value.url) || !notEmpty(formMusic.value.cover) || !notEmpty(formMusic.value.lrc)) {
      alert('请完整上传歌曲文件 & 封面 & 歌词');
      return;
    }
    Axios
      .post(`/${APIHref.ADMIN_MUSIC}`, formMusic.value, {
        headers: headers
      })
      .then((response): void => {
        const resp: Resp = response.data;
        alert('请求' + resp.data.success ? '成功' : '失败');
        if (resp.data.success) {
          addMusicToSongList(formMusic.value.id = resp.data.objectId);
          currentMusicList.value.push(formMusic.value);
        }
      });
  }

  // 删除歌曲
  function removeMusicFromSongList(musicId: number, index: number) {
    Axios
      .delete(`/${APIHref.ADMIN_MUSIC_SONGLIST}/music/${currentSongList.value.id}?musicId=${musicId}`, {
        headers: headers
      })
      .then((response): void => {
        const resp: Resp = response.data;
        alert('请求' + (resp.data as Resp).data ? '成功' : '失败');
        if (resp.data) {
          currentMusicList.value.splice(index, 1);
        }
      });
  }

  // form 文件删除调用
  function musicUploadRemove(uploadFile: UploadFile) {
    const url = (uploadFile.response as UploadResp).url;
    const suffix = url.substring(url.lastIndexOf('.'));
    if (suffix == '.flac') {
      formMusic.value.url = null as any;
    } else if (suffix == '.lrc') {
      formMusic.value.lrc = null as any;
    } else if (suffix == '.jpg' || suffix == '.png') {
      formMusic.value.cover = null as any;
    }
    return true;
  }

  // nginx 上传成功调用
  function musicUploadSuccess(response: UploadResp) {
    const suffix = response.url.substring(response.url.lastIndexOf('.'));
    if (suffix == '.flac') {
      formMusic.value.url = response.url;
    } else if (suffix == '.lrc') {
      formMusic.value.lrc = response.url;
    } else if (suffix == '.jpg' || suffix == '.png') {
      formMusic.value.cover = response.url;
    } else {
      console.error(`Except type: ${suffix} with url: ${response.url}`)
      alert('错误的类型文件，请删除后重新上传！');
    }
  }

  function createMusic() {
    formMusic.value = {id: 0, name: null as any, artist: null as any, url: null as any, cover: null as any, lrc: null as any, theme: null as any};
    musicDialogVisible.value = true;
  }

  // 修改 tag 内容
  function modifySongList(songList: SongList) {
    formSongList.value = songList;
    songListDialogTitle.value = '修改歌单';
    songListDialogVisible.value = true;
  }

  // 创建 tag
  function createSongList() {
    formSongList.value = {id: 0, introduction: null as any, name: null as any};
    songListDialogTitle.value = '新建歌单';
    songListDialogVisible.value = true;
  }

  function submitSongList() {
    if (formSongList.value.id == 0) {
      // create
      Axios
        .post(`/${APIHref.ADMIN_MUSIC_SONGLIST}`, {
          name: formSongList.value.name,
          introduction: formSongList.value.introduction
        }, {
          headers: headers
        }).then((resp) => {
          const data = (resp.data as Resp).data;
          alert('请求' + data.success ? '成功' : '失败');
          formSongList.value.id = data.objectId;
          songListArray.value.push(formSongList.value);
        });
    } else {
      // update
      Axios
        .put(`/${APIHref.ADMIN_MUSIC_SONGLIST}`, {
          id: formSongList.value.id,
          name: formSongList.value.name,
          introduction: formSongList.value.introduction
        }, {
          headers: headers
        }).then((resp) => {
          alert('请求' + (resp.data as Resp).data ? '成功' : '失败');
        });
    }
  }

  function removeSongList(index: number, songListName: string, songListId: number) {
    if (!confirm('您确认要删除歌单: \n\t' + songListName + ' 吗?')) return;
    Axios
      .delete(`/${APIHref.ADMIN_MUSIC_SONGLIST}/${songListId}`, {
        headers: headers
      })
      .then((response): void => {
        const resp: Resp = response.data;
        alert('删除' + (resp.data ? '成功' : '失败'));
        if (resp.data) {
          currentMusicList.value = [];
          songListArray.value.splice(index, 1);
        }
      });
  }

  // 向歌单添加音乐
  function addMusicToSongList(musicId: number) {
    Axios
      .post(`/${APIHref.ADMIN_MUSIC_SONGLIST}/music/${currentSongList.value.id}?musicId=${musicId}`, {}, {
        headers: headers
      })
      .then((response): void => {
        const resp: Resp = response.data;
        alert('添加' + (resp.data ? '成功' : '失败'));
      });
  }

  function notEmpty(s: string): boolean {
    return s != null && s.length != 0;
  }
</script>

<style scoped lang="less">
  .full-width {
    width: 100%;
  }
  // el-table 限制行数
  .el-table {
    :deep(.cell) {
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;     
      -webkit-box-orient: vertical;
    }
  }
  // el-upload drag 隐藏多余输入框
  :deep(input.el-upload__input) {
    display: none !important;
  }
</style>