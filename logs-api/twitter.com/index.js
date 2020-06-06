const domain =  __dirname.split(/\\|\//).pop();

const headerCSP = function({headers}) {
  const val = ' blob: ws://localhost:3000 ';
  const csp = headers['content-security-policy'];
  if (csp) {
    headers['content-security-policy'] = csp[0].replace(/ blob: /g, val);
  }
  return {headers};
};

const unregisterJS = function() {
  document.addEventListener('DOMContentLoaded', (event) => {
    setTimeout(() => {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
        registration.unregister()
      }});
      console.log('unregister service worker')
    }, 1000)
  })
};

let debunk;
let urlList = [];
function html5vid({url}, fn) {
  if (url.match(/.ts$/)) {
    urlList.push(url.replace(/https:\//, `${mitm.home}/cache`));
    debunk && clearTimeout(debunk);
    debunk = setTimeout(function() {
      clearTimeout(debunk);
      const files = urlList;
      urlList = [];
      const arr = files[0].match(/(\d+)\/(pu\/vid|vid)/);
      if (fs.existsSync(`${arr[1]}.mp4`)) {
        return;
      }
      if (arr && arr[1]) {
        const tsList = [];
        for (let file of files) {
          if (file.match(arr[1])) {
            tsList.push(`file '${file}'`);
          }
        }
        fs.writeFileSync(`${arr[1]}.txt`, tsList.join('\n'));
        execFile('ffmpeg', `-f concat -safe 0 -i ${arr[1]}.txt -c copy ${arr[1]}.ts`.split(' '), () => {
          execFile('ffmpeg', `-i ${arr[1]}.ts -acodec copy -vcodec copy ${arr[1]}.mp4`.split(' '), () => {
            fs.remove(`${arr[1]}.txt`);
            fs.remove(`${arr[1]}.ts`);
            fn && fn();
          });
        });
        //console.log(arr);
      }
    }, 1500)
  }
}

const routes = {
  title: 'Twitter - twitter',
  url: 'https://www.twitter.com/search?q=covid&src=typed_query',
  screenshot: {
    selector: 'button[type=submit],a[role=button]',
    at: 'sshot',
  },
  mock: {
    'mitm-play/twitter.js': {
      js: [unregisterJS],
    },
  },
  cache: {
    'abs.twimg.com': {
      contentType: ['javascript'],
      hashQstring: true,
    },
    'video.twimg.com': {
      contentType: ['mpegURL', 'MP2T'],
      resp: html5vid,
    },
  },
  log: {
    'api.twitter.com': {
      contentType: ['json']
    },
  },  
  html: {
    'twimg.com': 0,
    'twitter.com': {
      resp: headerCSP,
      src:['twitter.js'],
    },
  },
}

global.mitm.fn.routeSet(routes, domain, true)
//mitm-play twi --chromium='D:\Apps\chrome-gog\chrome.exe' -cspr='.'
