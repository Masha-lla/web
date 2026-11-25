import {build} from '/tmp/shapeshift-11609/node_modules/esbuild/lib/main.js'
import fs from 'node:fs'
const root='/tmp/shapeshift-11609';
const mocks={
'@shapeshiftoss/utils':`export const makeAsset=x=>x`,
'@/state/store':`export const useAppSelector=()=>[];export const useAppDispatch=()=>()=>{};export const store={getState:()=>({})}`,
'@/state/slices/selectors':`export const selectAssets=()=>({});export const selectAssetsBySearchQuery=()=>[]`,
'@/state/slices/tradeInputSlice/tradeInputSlice':`export const tradeInput={}`,
'@/lib/customTokenImportSupportedChainIds':`export const CUSTOM_TOKEN_IMPORT_SUPPORTED_CHAIN_IDS=[]`,
'@/components/TradeAssetSearch/hooks/useGetCustomTokensQuery':`export const useGetCustomTokensQuery=()=>({data:[],isLoading:false})`,
'@/components/TradeAssetSearch/components/CustomAssetAcknowledgement':`export const CustomAssetAcknowledgement=()=>null`,
'./AssetSearchResults':`import React from 'react';export const AssetSearchResults=({searchQuery})=><div style={{padding:24,minHeight:250}}>Simulated results{searchQuery?' for '+searchQuery:''}</div>`
};
for(const phase of ['before','after']){
await build({entryPoints:['/tmp/search-host/app.tsx'],outfile:`/tmp/search-host/${phase}.js`,bundle:true,platform:'browser',format:'esm',jsx:'automatic',nodePaths:[root+'/node_modules'],tsconfig:root+'/tsconfig.json',define:{'process.env.NODE_ENV':'"development"'},plugins:[{name:'fixtures',setup(b){b.onResolve({filter:/.*/},a=>a.path in mocks?{path:a.path,namespace:'fixtures'}:undefined);b.onLoad({filter:/.*/,namespace:'fixtures'},a=>({contents:mocks[a.path],loader:'tsx',resolveDir:root}));if(phase==='before')b.onLoad({filter:/GlobalSearchModal\.tsx$/},()=>({contents:fs.readFileSync('/tmp/global-search-baseline.tsx','utf8'),loader:'tsx',resolveDir:root+'/src/components/Layout/Header/GlobalSearch'}));}}]});
fs.writeFileSync(`/tmp/search-host/${phase}.html`,`<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><div id="root"></div><script type="module" src="/${phase}.js"></script>`)
}
