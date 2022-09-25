<template>
  <footer id="footer" class="footer">
    <div class="container">
      <div class="row center">
        <div class="col-xs-3">
          <img class="qrcode img-rounded img-responsive" src="/image/wechat_qrcode.png" alt="wechat_qrcode">
        </div>
        <div class="col-xs-1">
          <div class="line"></div>
        </div>
        <div class="col-xs-3">
          <h4>更多作品</h4>
          <a class="center-block" href="https://github.com/IllTamer">Github: IllTamer</a>
          <a class="center-block" href="https://gitee.com/IllTamer_Gitee">Gitee: IllTamer_Gitee</a>
        </div>
        <div class="col-xs-1">
          <div class="line"></div>
        </div>
        <div class="col-xs-4">
          <h4>关于此站</h4>
          <p>IllTamer 的个人博客项目。我希望它像花一样来到你身边，虽终会逝去，但仍留有淡淡余香。</p>
        </div>
      </div>
      <div class="center">
        <hr class="spliter" />
        <a class="copyright" href="https://beian.miit.gov.cn">豫ICP备2022019351号-1</a>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="less">
  .spliter {
    border-top: 1px solid black;
    size: 3;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .copyright {
    color: gray;
  }
  .footer {
    background-color: #EEEEEE;
    margin-top: 20px;;
    padding-top: 20px;
    opacity: 0.7;
  }

  .line {
      width: 1px;
      height: 110px;
      background-color: gray;
      margin: 1px auto;
  }
</style>