<template>
  <div>
    <div class="col-xs-7">
      <VueAPlayer v-if="musicList.length != 0" :music="musicList[0]" :list="musicList" :showLrc="true" preload="auto"></VueAPlayer>
    </div>
    <div class="col-xs-4 col-xs-offset-1">
      <div class="list-group">
        <a v-if="current != undefined" href="#" class="list-group-item disabled">
          <h3>{{current.name}}</h3>
          <p>{{current.introduction}}</p>
        </a>
      </div>
      <div class="list-group">
        <button type="button" class="list-group-item" :key="info.id" v-for="info in songLists" @click="refresh(info)">{{info.name}}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, Ref, onBeforeMount } from 'vue';
  import VueAPlayer from 'vue3-aplayer';
  import { Axios } from '../../ts/axios';
  import { APIHref } from '../../ts/export';

  const EMPTY_SONGLIST: SongList = {id: -1, name: '加载中', introduction: '正在努力读取~'};

  let current: Ref<SongList> = ref<SongList>(EMPTY_SONGLIST);
  let musicList: Ref<Array<Music>> = ref([]);
  let songLists: Ref<Array<SongList>> = ref([]);

  // init song list
  onBeforeMount((): void => {
    Axios
      .get(`${APIHref.MUSIC}/song-list`)
      .then((response): void => {
        songLists.value = (response.data as Resp).data;
        refresh(current.value = songLists.value[0])
      });
  });
  
  // 
  function refresh(songList: SongList): void {
    Axios
      .get(`${APIHref.MUSIC}/list/${songList.id}`)
      .then((response) => {
        const respMusicList: Array<RespMusic> = (response.data as Resp).data;
        musicList.value = respMusicList.reduce((context: Array<Music>, entity: RespMusic, index): Music[] => {
          context[index] = parse(entity);
          return context;
        }, []);
      });
  }

  function parse(entity: RespMusic): Music {
    return {
      title: entity.name,
      artist: entity.artist,
      src: entity.url,
      pic: entity.cover,
      lrc: entity.lrc,
      theme: entity.theme
    };
  }
</script>

<style scoped>
</style>