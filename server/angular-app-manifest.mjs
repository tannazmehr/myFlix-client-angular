
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/myFlix-client-angular/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 23595, hash: 'bc546853358cae73b7f0d75ec398bc91abab4f5a7ec731e3240241a2676dd036', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17169, hash: '05d2888d495ddc3481cf802c02d0b0535684ebd5a3f949c160c83d0586ee8b2f', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-36AW6TKX.css': {size: 6979, hash: 'vY6tjD/ce7M', text: () => import('./assets-chunks/styles-36AW6TKX_css.mjs').then(m => m.default)}
  },
};
