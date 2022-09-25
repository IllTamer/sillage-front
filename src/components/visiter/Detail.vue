<template>
	<div v-if="detailBlog != null" class="col-xs-10 col-xs-offset-1">
		<div class="panel panel-default">
			<ul class="list-group">
				<!-- header -->
				<li class="list-group-item">
					<div class="inline">
						<img class="user-icon img-thumbnail img-circle" :src="detailBlog.minUser.avatar" alt="">
						<router-link :to="{ name: 'about' }">{{detailBlog.minUser.nick}}</router-link>
					</div>
					<div class="inline icon-margin">
						<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
						<span>{{detailBlog.views}}</span>
					</div>
					<div class="inline pull-right">
						<span class="glyphicon glyphicon-calendar" aria-hidden="true"></span>
						<span>{{DateUtil.format(detailBlog.createTime)}}</span>
					</div>
				</li>
				<!-- image -->
				<li class="list-group-item">
					<img class="center-block img-rounded img-responsive" :src="detailBlog.cover" alt="">
				</li>
				<!-- content -->
				<li class="content list-group-item">
					<!-- title -->
					<h2>{{detailBlog.title}} <span class="label label-default">{{BlogFlag[detailBlog.flag]}}</span></h2>
					<!-- text -->
					<div class="typo typo-selection line-numbers" id="tools-bar-content" v-html="detailBlog.content"></div>
					<!-- label -->
					<div class="label-style">
						<a @click="jump('tag', tag.id, router)" :key="tag.id" v-for="tag in detailBlog.tags"
							class="label label-success">{{tag.name}}</a>
					</div>
					<!-- reward -->
					<div v-if="detailBlog.appreciation" class="center">
						<div class="btn-group reward">
							<button class="btn dropdown-toggle" data-toggle="dropdown" type="button">赞赏<span class="caret"></span></button>
							<div class="dropdown-menu reword-qrcode">
								<img class="inline" src="/image/wepay.jpg" />
								<img class="inline" src="/image/alpay.jpg" />
							</div>
						</div>
					</div>
				</li>
				<!-- message -->
				<li v-if="detailBlog.shareStatement" class="list-group-item info-bg">
					<div class="row">
						<div class="col-xs-8 text-success info-padding">
							<ul>
								<li>作者: {{detailBlog.minUser.nick}}<a :href="NavHref.ABOUT">(联系作者)</a></li>
								<li>发布时间: {{DateUtil.format(detailBlog.createTime)}}</li>
								<li>更新时间: {{DateUtil.format(detailBlog.updateTime)}}</li>
								<li>版权声明: AGPLv3</li>
								<li>版权声明: 自由转载-非商用</li>
							</ul>
						</div>
						<div class="col-xs-4">
							<img class="qrcode pull-right" src="/image/wechat_qrcode.png" alt="">
						</div>
					</div>
				</li>
				<!-- comment show -->
				<li v-if="detailBlog.commentable" class="list-group-item" id="comment-show">
					<div class="panel panel-default">
						<div class="panel-heading">
							评论区
						</div>
						<div class="panel-body">
							<div :key="rateComment.id" v-for="rateComment in detailBlog.rateComments" class="comment">
								<!-- top -->
								<div class="comment-body">
									<div class="row">
										<div class="col-xs-1">
											<img :src="rateComment.avatar" alt="">
										</div>
										<div class="col-xs-11">
											<a class="author" href="#"><span>{{rateComment.nick}}</span></a>
											<span>{{DateUtil.format(rateComment.createTime)}}</span>
											<div>{{rateComment.content}}</div>
											<a class="reply" @click="quickReply(rateComment.id, rateComment.nick)">回复</a>
										</div>
									</div>
								</div>
								<!-- son -->
								<div v-for="sonComment in rateComment.sonComments" class="comment-reply">
									<div class="comment-body">
										<div class="row">
											<div class="col-xs-1">
												<img :src="sonComment.avatar" alt="">
											</div>
											<div class="col-xs-11">
												<a class="author" href="#">
													<span>{{sonComment.nick}}</span>
													<span class="at">{{` @${rateComment.nick}`}}</span>
												</a>
												<span>{{DateUtil.format(sonComment.createTime)}}</span>
												<div>{{sonComment.content}}</div>
												<a class="reply" @click="quickReply(sonComment.id, sonComment.nick)">回复</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<!-- submit comment -->
		<div v-if="detailBlog.commentable" class="row">
			<div class="contact-box text-center">
				<div id="comment">
					<div class="form-group row">
						<div class="col-xs-6">
							<input :value="nick" type="text" class="form-control" placeholder="昵称*" required>
						</div>
						<div class="col-xs-6">
							<input :value="email" type="email" class="form-control" placeholder="Email* ( Use to connect )" required>
						</div>
					</div>
					<div class="form-group">
						<textarea :value="content" id="content" class="form-control" rows="4" :placeholder="contentPlaceholder" required></textarea>
					</div>
					<button @click="comment" class="btn-block" type="button">评论</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
  	import { onActivated, ref, Ref } from 'vue';
  	import { useRoute, useRouter } from 'vue-router';
	// markdown -> html
	import { marked } from 'marked';
	import Prism from 'prismjs';
	import { Axios } from '../../ts/axios';
 	import { jump, APIHref, NavHref, BlogFlag } from '../../ts/export';
	import { DateUtil } from '../../ts/date';

	const router = useRouter();
  	const route = useRoute();
	let detailBlog: Ref<DetailBlog> = ref<any>(null)

	let parentCommentId: number = 0;
	let nick: Ref<string> = ref('');
	let email: Ref<string> = ref('');
	let content: Ref<string> = ref('');

	let contentPlaceholder: Ref<string> = ref('内容*')

	onActivated((): void => {
		// 当前博客id
		const blogId: number = Number(route.params.id);
		Axios
		.get(`/${APIHref.BLOG}/detail/${blogId}`)
		.then((response): void => {
			const resp: Resp = response.data;
			detailBlog.value = resp.data;
					detailBlog.value.content = marked(detailBlog.value.content);
		})
		.then((): void => {Prism.highlightAll()});
	})


	function comment() {
		// TODO
	}

	function quickReply(parentId: number, parentNick: string): void {
		parentCommentId = parentId;
		contentPlaceholder.value = '@' + parentNick;
		(document.getElementById('content') as HTMLTextAreaElement).focus();
		(document.getElementById('comment') as HTMLElement).scrollIntoView({behavior: 'smooth'});
	}
</script>

<style scoped lang="less">
	:deep(div) {
		@import '../../../public/css/typo.less';
	}
	
	.icon-margin {
		margin: 0 10px;
	}

	/* content */
	.content {
		padding: 48px 48px 24px 48px;
		& > h2 {
			font-weight: 700;
			text-align: center;
			margin-top: 0;
			margin-bottom: 20px;
		}
	}

	.label-style {
		margin-top: 20px;
		margin-bottom: 10px;
		&  > a {
			margin-right: 5px;
		}
	}

	.reward {
			button {
			border-color: #eea236;
			color: #eea236;
			background-color: white;
			border-radius: 10em;
			padding: 6px 18px;
			&:hover {
				color: rgba(255, 166, 0, 0.65);
			}
		}
	}

	.reword-qrcode {
		width: 250px;
		left: -116%;
		right: auto;
		&  > img {
			width: 120px;
		}
	}

	div > .reward {
		margin-bottom: 20px;
	}

	.info-bg {
		background-color: #dff0d8;
		opacity: 0.7;
	}

	.info-padding {
		height: 110px;
		padding-left: 40px;
		& > ul {
			height: 100%;
			letter-spacing: 0.05em;
			font-weight: 350;
			& > li {
				margin-bottom: 2.5px;
			}
		}
	}

	/* comment */
	.comment-body {
		padding: 10px 0;
	}

	.comment-reply {
		margin-left: 35px;
		.at {
			color: teal;
		}
	}

	.border-clear {
		border-width: 0;
	}

	.author,
	.author:hover {
		color: black;
		font-weight: 700;
		text-decoration: none;
		margin-right: 5px;
	}

	.reply,
	.reply:hover {
		color: rgba(0,0,0,.4);
		text-decoration: none;
	}

	.comment-body {
		img {
			width: 36px;
			transform: translateY(10%);
		}
	}

	.comment-body .row > div > span {
		color: rgba(0,0,0,.4);
	}

	/* submit */
	.contact-box {
		-webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		padding: 36px 36px 24px 36px;
		margin: 15px 25px;
		background-color: #fff;
		border-radius: 6px;
		input {
			height: 40px;
			border: 1px solid #f7f6f5;
			font-size: 15px;
			background-color: #f7f6f5;
			font-weight: 500
		}
		textarea {
			border: 1px solid #f7f6f5;
			padding-top: 10px;
			background-color: #f7f6f5;
			font-size: 15px;
			font-weight: 500
		}
		button {
			background-color: white;
			border: solid 1px;
			border-color: rgb(155, 155, 155);
			color: gray;
			padding: 6px 18px;
			border-radius: 8px;
			cursor: pointer;
			outline: 0;
			font-weight: 500;
			font-size: 15px;
			&:hover {
				background-color: rgb(189, 189, 189);
				color: white;
			}
		}
	}

	/* tools bar */
	.tools-bar {
		position: fixed;
		z-index: 9999;
		right: 0;
		bottom: 120px;
	}

	/* tocbot modify */

	.toc-list {
		/* 清除原生列表 */
		list-style-type: none;
		li a {
			display: block;
			padding: 3px 0;
			&:hover {
				color:green;
				text-decoration: none;
			}
		}
	}

</style>