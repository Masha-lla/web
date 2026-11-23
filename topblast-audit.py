import json,urllib.request,urllib.parse,datetime,concurrent.futures,subprocess,time
wallets=['0:a582447478b816011d2d661f186d0c83a9af899f9c143f55c73cb0c1e919803f','0:eee00893fff24abaa4f46678ded11a1721030f723e2e20661999edd42b884594']
day='2026-11-14';start=int(datetime.datetime.fromisoformat(day).replace(tzinfo=datetime.timezone.utc).timestamp());end=start+86400
for w in wallets:
 alltx=[]
 for offset in range(0,20000,128):
  q=urllib.parse.urlencode({'account':w,'start_utime':start,'end_utime':end-1,'limit':128,'offset':offset,'sort':'asc'});s=json.loads(subprocess.check_output(['curl','-fsS','--retry','3','--retry-delay','2','--max-time','30','https://toncenter.com/api/v3/transactions?'+q]));tx=s['transactions'];alltx+=tx;time.sleep(1.5)
  if len(tx)<128:break
 json.dump(alltx,open('/tmp/topblast-'+w[-6:]+'-'+day+'.json','w'))
 total=sum(int(t.get('in_msg',{}).get('value') or 0) for t in alltx if t.get('in_msg',{}).get('source') and t['in_msg']['source'].lower() not in wallets)
 print('wallet',w,'transactions',len(alltx),'all external inflows TON',total/1e9)
 grouped={}
 for t in alltx:
  m=t.get('in_msg') or {};comment=(m.get('message_content') or {}).get('decoded') or {};comment=comment.get('comment','');key=comment.split(':')[0][:65] if comment else 'opcode '+str(m.get('opcode'));grouped[key]=grouped.get(key,0)+int(m.get('value') or 0)
 print(sorted([(k,v/1e9) for k,v in grouped.items()],key=lambda x:-x[1])[:20])
