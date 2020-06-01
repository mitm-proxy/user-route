const domain =  __dirname.split(/\\|\//).pop();

const css = `
[data-css='c-advertisement'] {
  display: none !important;
}`

routes = {
  title: 'Channel News Asia - channelnewsasia',
  url: 'https://www.channelnewsasia.com/',  
  html: {'facebook.com':       ''},
  css:  {'styles.css': `=>${css}`},
  js: {
    'imrworldwide.com': '',
    'doubleclick.net': '',
    'facebook.net': '',
    'outbrain.com': '',
    'addthis.com': '',
    'twitter.com': '',
    'cxense.com': '',
    'demdex.net': '',
  },
}
global.mitm.fn.routeSet(routes, domain, true)
