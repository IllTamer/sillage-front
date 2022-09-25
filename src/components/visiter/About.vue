<template>
  <div>
    <div class="col-xs-5">
      <ul class="list-group about">
        <h4 class="list-group-item text-center">
          关于
        </h4>
        <li class="list-group-item">
          <span>
            <span>你好陌生人，我是 IllTamer，一名</span>
            <div>
              <span class="glyphicon glyphicon-minus"></span>
              Java Developer
            </div>
            <div>
              <span class="glyphicon glyphicon-minus"></span>
              Minecraft 社区开发者
            </div>
            <div>
              <span class="glyphicon glyphicon-minus"></span>
              兼职 BiliBili up 主
            </div>
            <div>
              <span class="glyphicon glyphicon-minus"></span>
              梦想成为架构师的 2024 届应届生
            </div>
            <br>
            <span class="indent">
              本站于 2022.05 期间完成，项目在 <a href="https://github.com/IllTamer/sillage">Github</a>
              上开源。如果有需要，您可以扫描底部 / 文章下方二维码添加本人微信进行交流。望本站的内容能对您有所有帮助。
            </span>
          </span>
        </li>
        <li class="list-group-item">
          <span class="label reverse-success duplicate-label">随笔</span>
          <span class="label reverse-success duplicate-label">记录</span>
          <span class="label reverse-success duplicate-label">交流</span>
        </li>
        <li class="list-group-item">Talk is esay, show me the code !</li>
        <li class="list-group-item">
          <a href="https://github.com/IllTamer" target="_blank">Github</a>
          -
          <a href="https://gitee.com/IllTamer_Gitee" target="_blank">Gitee</a>
          -
          <a href="https://blog.csdn.net/qq_51026595" target="_blank">CSDN</a>
          -
          <a href="https://www.mcbbs.net/home.php?mod=space&uid=752547" target="_blank">MCBBS</a>
          -
          <a href="https://space.bilibili.com/19383984" target="_blank">BiliBili</a>
        </li>
      </ul>
    </div>
      <div class="col-xs-5 col-xs-offset-1">
      <div class="list-group about">
        <h4 class="list-group-item text-center">友情链接</h4>
        <div class="list-group-item">
          <p class="center">Waiting for you ~</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="less">
  .indent {
      text-indent: 2em;
      display: inline-block;
  }
  /* about */
  .about {
    h4 {
      font-weight: 600;
    }
    span {
      font-weight: 200;
      letter-spacing: 0.05em;
      line-height: 20px;
    }
    li > span > div {
      text-indent: 0.5em;
    }
  }
  .reverse-success {
      background-color: white;
      color: #5cb85c;
      border: solid 1px #5cb85c;
  }
</style>