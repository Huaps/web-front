import * as Events from '@/plugins/event'
import * as FILES from "@/plugins/files";
function set_user_name(username) {
  localStorage.setItem('username', username);
}

function get_user_name() {
  return localStorage.getItem('username')
}

function get_user_id() {
  return localStorage.getItem('userid');
}

function set_user_id(uid) {
  localStorage.setItem('userid', uid);
}

function get_user_city() {
  return localStorage.getItem('usercity');
}

function set_user_city(city) {
  localStorage.setItem('usercity', city);
}

function clear() {
  localStorage.removeItem('userid');
  localStorage.removeItem('username');
  localStorage.removeItem('usercity');
}

function assert() {
  const flag = localStorage.getItem('userid') !== null &&
         localStorage.getItem('username') !== null;
  if(!flag) Events.err('未登录')
  return flag;
}

function assert_admin() {
  if(get_user_name() != 'admin'){
    Events.err('权限不足')
    return false;
  }
  return true;
}

function fileURL(uid) {
  return '/api/file/download/' + String(uid)
}

async function download(url) {
  const link = document.createElement('a');
    link.href = url;
    link.download = FILES.getFileName(url);
    link.click();
}

function get(url, param = {}, identifier = null) {
  if(param == null) param = {}

  return new Promise((resolve, reject) => {
    if(identifier && param) {
      param[identifier] = get_user_id();
    }

    var params = ''
    for(let key in param)
      params += (key + '=' + param[key] + '&')
    params = params.slice(0, -1)

    var url_encode = url + (params.length > 0 ? ('?' + params) : '');
    url_encode = encodeURI(url_encode)

    fetch(url_encode)
    .then(response => response.json())
    .then(data => {
      if(data.code == 1) resolve(data)
      else throw data.message;
    })
    .catch(err => {
      console.log(err);
      reject(err);
    })
  })
}


const JOSN_HEADER = {
  'Content-Type': 'application/json'
}
function post(url, data, identifier = null, json = true, headers = {}) {
  return new Promise((resolve, reject) => {
    if(identifier) {
      const user_id = String(get_user_id());
      if(user_id == null) reject('Not logged in')
      data[String(identifier)] = user_id;
    }

    fetch(url, {
      method: 'POST',
      headers: json ? JOSN_HEADER : headers,
      body: json ? JSON.stringify(data) : data
    })
    .then(response => response.json())
    .then(data => {
      if(data.code == 1) resolve(data)
      else throw data.message;
    })
    .catch(err => {
      console.log(err);
      reject(err);
    })
  })
}

export {get, post, fileURL, download, set_user_id, get_user_id, set_user_name, get_user_name, get_user_city, set_user_city, clear, assert, assert_admin}
