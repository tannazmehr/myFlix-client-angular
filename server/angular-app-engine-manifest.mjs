
export default {
  basePath: 'https://tannazmehr.github.io/myFlix-client-angular',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
