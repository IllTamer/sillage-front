type JWTInfo = {
    // jwt 的过期时间
    exp: number,
    // jwt 的签发时间
    iat: number,
    // jwt 签发者
    iss: string,
    // jwt 的唯一身份标识
    jti: string,
    // jwt 所面向的用户
    sub: number
}

// 后端响应数据格式
type Resp = {
    // 0 | 301 | 500
    status: number,
    // 'success' | 'warning' | 'error'
    msg: string,
    // 
    data: any
}

// 插入响应类型
type InsertResp = {
    success: boolean,
    // 插入实体类的主键
    objectId: number
}

// MyBatis Page类型
type Page<T> = {
    // 当前页面所在索引，[1, )
    current: number,
    // 总页数
    pages: number,
    // 结果集
    records: Array<T>,
    // 页面容量
    size: number,
    // 总结果数
    total: number
}

// 标签类型
type Tag = {
    id: number,
    name: string,
}

// 分类类型
type Type = {
    id: number,
    name: string,
}

// 最简用户类型
type MinUser = {
    id: number,
    nick: string,
    avatar: string
}

// 发布博客类型
type PublishBlog = {
    id: number,
    title: string,
    content: string,
    summary: string,
    cover: string,
    flag: number,
    views: number,
    appreciation: boolean,
    shareStatement: boolean,
    commentable: boolean,
    recommend: boolean,
    published: boolean,
    createTime: string,
    updateTime: string,
    typeId: number,
    tagIdList: Array<number>
}

// 详细博客类型
type DetailBlog = {
    id: number,
    title: string,
    content: string,
    summary: string,
    cover: string,
    flag: number,
    views: number,
    appreciation: boolean,
    shareStatement: boolean,
    commentable: boolean,
    createTime: string,
    updateTime: string,
    // tag
    tags: Array<Tag>,
    // user
    minUser: MinUser,
    // comment
    rateComments: Array<RateComment>
}

// 管理页博客类型
type ManageBlog = {
    id: number,
    title: string,
    type: Type,
    recommend: boolean,
    views: number,
    updateTime: string,
    published: boolean
}

// 缩略博客类型
type HomeBlog = {
    id: number,
    title: string,
    summary: string,
    cover: string,
    views: number,
    createTime: string,
    // tag
    tags: Array<Tag>,
    // user
    minUser: MinUser
}

// 最简博客类型
type MinBlog = {
    id: number,
    title: string,
    createTime: string,
    // 原创 / 搬运
    flag: number
}

// 分级评论
type RateComment = {
    id: number,
    nick: string,
    email: string,
    content: string,
    avatar: string,
    createTime: string,
    blogId: number,
    sonComments: Array<RateComment>
}

// 计数分类类型
type CountType = {
    id: number,
    name: string,
    blogCount: number
}

// 文件上传响应类型
type UploadResp = {
    code: number,
    msg: string,
    url: string
}

// 服务器返回的音乐类型
type RespMusic = {
    id: number,
    name: string,
    artist: string,
    url: string,
    cover: string,
    lrc: string,
    theme: string
}

// vue3-aplayer 音乐
// @see https://github.com/SevenOutman/vue-aplayer/blob/develop/docs/README.zh-CN.md
type Music = {
    // 歌曲名称
    title: string,
    // 演唱者
    artist: string,
    // 音频URL
    src: string,
    // 封面URL
    pic: string,
    // LRC歌词
    lrc: string,
    // 歌曲主题色
    theme: string
}

// 歌单类型
type SongList = {
    id: number,
    name: string,
    introduction: string
}

// 标题栏类型
type NavElement = {
    name: string,
    // bs3对应的glyphicon图标
    icon: string,
}
