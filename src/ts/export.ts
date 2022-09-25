import { visiterRoutes } from "../router"; 
import { Router } from "vue-router"; 

// 博客类别
export enum BlogFlag {
    原创 = 0,
    搬运 = 1
}

// 导航栏索引
export enum NavHref {
    BLOG = 'blog',
    SEARCH = 'search',
    TYPE = 'type',
    TAG = 'tag',
    ARCHIVE = 'archive',
    RESOURCE = 'resource',
    MUSIC = 'music',
    ABOUT = 'about',
    DETAIL = 'blog/detail'
}

// API 索引
export enum APIHref {
    BLOG = 'blog',
    COMMENT = 'comment',
    MUSIC = 'music',
    TYPE = 'type',
    TAG = 'tag',
    USER = 'user',
    ADMIN_BLOG = 'admin/blog',
    ADMIN_TYPE = 'admin/type',
    ADMIN_TAG = 'admin/tag',
    ADMIN_MUSIC = 'admin/music',
    ADMIN_MUSIC_SONGLIST = 'admin/music/song-list'
}

// 路由跳转
export function jump(routerName: string, _id: number, router: Router) {
    router.push({
        name: routerName,
        query: {
            id: _id
        }
    });
    if (routerName.endsWith('Admin') || routerName.startsWith('user')) return;
    let index: number = -1;
    visiterRoutes.forEach((value, _index) => {
      if (value.name === routerName) {
        index = _index;
      }
    });
    resetSetItem('nav-index', index);
}

// 路由跳转详情页 /detail/:id
export function toDetail(blogId: number, router: Router) {
    router.push({
        name: 'detailBlog',
        params: {
            id: blogId
        }
    });
    resetSetItem('nav-index', -1);
}

/** 
 * 自定义 storage 事件
 * @apiNote storage: sessionStorage
 * @publish resetSetItem('admin', true);
 * @listener
 *  window.addEventListener('admin', () => {
 *       console.log('admin=' + sessionStorage.getItem('admin'));
 *  })
 */
export function resetSetItem(key: string, newVal: any) {
    //创建一个 StorageEvent 事件
    const event = document.createEvent('StorageEvent');
    const storage = {
        setItem: function(k: string, val: any) {
            sessionStorage.setItem(k, val);
            //初始化创建的事件
            event.initStorageEvent(k, false, false, k, null, val, null as any, null);
            //派发对象
            window.dispatchEvent(event);
        }
    }
    return storage.setItem(key, newVal);
}

export class Base64 {
    private _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    encode(input: string) {
        let output = "";
        let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        let i = 0;
        input = this._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    }

    /**
     * @apiNote 解析后结尾会多个 \u0000\u0000
     */
    decode(input: string) {
        let output = "";
        let chr1, chr2, chr3;
        let enc1, enc2, enc3, enc4;
        let i = 0;
        input = input.replace(/[^A-Za-z0-9]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = this._utf8_decode(output);
        return output;
    }
 
    _utf8_encode(string: string) {
        string = string.replace(/\r\n/g, "\n");
        let utftext = "";
        for (let n = 0; n < string.length; n++) {
            const c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }
 
    // private method for UTF-8 decoding
    _utf8_decode(utftext: string) {
        let string = "";
        let i = 0;
        let c = 0;
        let c1 = 0;
        let c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c1 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
                i += 2;
            } else {
                c1 = utftext.charCodeAt(i + 1);
                c2 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
                i += 3;
            }
        }
        return string;
    }
}