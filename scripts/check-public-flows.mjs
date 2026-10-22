import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { deflateSync } from 'node:zlib';
import axe from 'axe-core';

const origin = 'https://luxonis.tail6ad453.ts.net:8443';
const portfolio = process.env.PORTFOLIO_URL || 'https://adam-sapiecha.github.io/Portfolio-AdamSapiecha/';
const output = path.resolve('test-results');
await fs.mkdir(output,{recursive:true});
const report = { checkedAt:new Date().toISOString(), portfolioUrl:portfolio, vantagePoint:process.env.GITHUB_ACTIONS ? 'Independent GitHub-hosted runner; no VPN, SSH or server credentials' : 'Local run; network independence is not established', runUrl:process.env.GITHUB_RUN_ID ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : null, projects:[] };
const browser = await chromium.launch();
const errors = [];
async function checkLayout(page,name) {
  for (const width of [1280,390,360]) {
    await page.setViewportSize({width,height:900});
    await page.screenshot({path:path.join(output,`${name}-${width}.png`),fullPage:true});
    const sizes = await page.evaluate(()=>({inner:window.innerWidth,client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
    assert.equal(sizes.inner,width,`${name}: viewport not applied`);
    assert(sizes.scroll<=sizes.client+1,`${name}: horizontal overflow at ${width}px (${sizes.scroll}/${sizes.client})`);
    await page.evaluate(axe.source);
    const accessibility=await page.evaluate(async()=>{
      const result=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});
      return result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary,html:n.html}))}));
    });
    await fs.writeFile(path.join(output,`${name}-accessibility-${width}.json`),JSON.stringify(accessibility,null,2));
    if(accessibility.length) console.log(JSON.stringify({name,width,accessibility},null,2));
    assert.equal(accessibility.length,0,`${name}: accessibility issues at ${width}px: ${accessibility.map(v=>v.id).join(', ')}`);
  }
  await page.setViewportSize({width:1280,height:900});
}
async function scenario(name,url,run) {
  const context=await browser.newContext({viewport:{width:1280,height:900},acceptDownloads:true});
  let page=await context.newPage();
  const pageErrors=[], apiResponses=[];
  let details;
  page.on('pageerror',error=>pageErrors.push(error.message));
  page.on('response',response=>{
    const pathname=new URL(response.url()).pathname;
    if (/\/api\/|\/public\/v1\//.test(pathname)) apiResponses.push({path:pathname,status:response.status()});
  });
  try {
    const section={taskmesh:'taskmesh',sentinelhub:'flood-routing',support:'dual-agent',posture:'backscan','posture-sample':'backscan'}[name];
    await page.goto(new URL(`projects.html#${section}`,portfolio).href,{waitUntil:'domcontentloaded',timeout:45000});
    if(process.env.GITHUB_REF_NAME==='main') {
      for(let attempt=0;attempt<18&&!await page.locator(`a[href="${origin}/sentinelhub/"]`).count();attempt++) {
        await new Promise(resolve=>setTimeout(resolve,10000));await page.reload();
      }
    }
    const entry=page.locator(`#${section} a[href="${url}"]`).first();
    if(!await entry.isVisible()) await page.locator(`#${section} summary`).click();
    if(await entry.getAttribute('target')==='_blank') {
      const popup=context.waitForEvent('page');await entry.click();page=await popup;
      page.on('pageerror',error=>pageErrors.push(error.message));
      page.on('response',response=>{const pathname=new URL(response.url()).pathname;if(/\/api\/|\/public\/v1\//.test(pathname))apiResponses.push({path:pathname,status:response.status()});});
    } else await entry.click();
    await page.waitForLoadState('domcontentloaded');
    assert.equal(page.url(),url,`${name}: portfolio link must open the actual demo`);
    details=await run(page,context);
    await checkLayout(page,name);
    assert.deepEqual(pageErrors,[],`${name}: JavaScript errors`);
    assert(apiResponses.some(r=>r.status>=200&&r.status<300),`${name}: no successful backend response`);
    report.projects.push({name,status:'passed',url,details,apiResponses});
  } catch(error) {
    await page.screenshot({path:path.join(output,`${name}-failure.png`),fullPage:true}).catch(()=>{});
    report.projects.push({name,status:'failed',url,error:error.message,details,apiResponses,pageErrors});
    errors.push(`${name}: ${error.message}`);
  } finally { await context.close(); }
}

// Generate known synthetic RGB-D; this contains no photograph or personal data.
function crc32(bytes){let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let i=0;i<8;i++)crc=(crc>>>1)^(0xedb88320&-(crc&1));}return(crc^0xffffffff)>>>0;}
function chunk(type,data){const name=Buffer.from(type),len=Buffer.alloc(4),crc=Buffer.alloc(4);len.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(Buffer.concat([name,data])));return Buffer.concat([len,name,data,crc]);}
function png(depth){const w=320,h=240,header=Buffer.alloc(13);header.writeUInt32BE(w);header.writeUInt32BE(h,4);header[8]=depth?16:8;header[9]=depth?0:2;const stride=w*(depth?2:3),raw=Buffer.alloc((stride+1)*h);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const offset=y*(stride+1)+1+x*(depth?2:3);if(depth)raw.writeUInt16BE(2000,offset);else raw.fill(100,offset,offset+3);}return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);}
const metadata={version:1,depth_unit:'mm',depth_aligned_to_rgb:true,landmark_source:'manual',intrinsics:[[600,0,160],[0,600,120],[0,0,1]],landmarks:[['left_shoulder',110,70],['right_shoulder',210,88],['left_hip',120,180],['right_hip',200,180]].map(([name,x_px,y_px])=>({name,x_px,y_px,visibility:1}))};

try {
  await scenario('taskmesh',`${origin}/taskmesh/`,async(page)=>{
    await page.getByRole('textbox').fill('Alpha beta\nGamma delta');
    await page.getByRole('button',{name:'Submit job',exact:true}).click();
    await page.getByRole('button',{name:/[a-f0-9]{8} text\.analyze/}).first().waitFor({timeout:30000});
    await page.getByRole('button',{name:/[a-f0-9]{8} text\.analyze/}).first().click();
    const dialog=page.getByRole('dialog');
    await dialog.locator('.status.succeeded').waitFor({timeout:30000});
    await dialog.locator('.result-block').filter({hasText:'"characters": 22'}).waitFor({timeout:30000});
    const text=await dialog.innerText();
    const jobId=await dialog.locator('.full-id').innerText();
    assert.match(text, /"characters": 22/);assert.match(text,/"lines": 2/);assert.match(text,/"words": 4/);
    assert(await dialog.locator('button').first().evaluate(el=>el===document.activeElement),'Dialog must receive focus');
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog').count(),0);
    await page.waitForFunction(()=>document.activeElement?.matches('button.job-link'),null,{timeout:5000});
    await page.reload();await page.getByRole('button',{name:/[a-f0-9]{8} text\.analyze/}).first().waitFor();
    const other=await browser.newContext();
    const anonymous=await other.request.get(`${origin}/taskmesh/public/v1/jobs`);
    assert([401,403].includes(anonymous.status()),'Anonymous request must not see jobs');
    const otherSession=await other.request.post(`${origin}/taskmesh/public/v1/session`,{headers:{Origin:origin},data:{}});
    assert.equal(otherSession.status(),201);
    const foreignJob=await other.request.get(`${origin}/taskmesh/public/v1/jobs/${jobId}`);
    assert.equal(foreignJob.status(),404,'A second valid session must not read this job');
    await other.close();
    return {characters:22,lines:2,words:4,reload:true,keyboard:true,separateVisitorIsolation:true};
  });
  await scenario('sentinelhub',`${origin}/sentinelhub/`,async(page,context)=>{
    await page.getByRole('button',{name:'Wczytaj przykład',exact:true}).click();
    await page.getByRole('button',{name:'Oblicz i zapisz analizę ↗',exact:true}).waitFor();
    await page.getByRole('button',{name:'Oblicz i zapisz analizę ↗',exact:true}).click();
    await page.locator('#analysis-status').filter({hasText:'Znaleziono przejazd'}).waitFor({timeout:30000});
    assert.match(await page.locator('#own-route').innerText(),/582/);
    const key=await page.locator('#workspace-key').inputValue();
    const id=await page.locator('#workspace-id').inputValue();
    assert(key.length>=32);
    await page.locator('#history-list button').first().click();
    await page.locator('#workspace-status').filter({hasText:'Odczytano zapisany wynik'}).waitFor();
    await page.reload();
    await page.getByText('Otwórz istniejącą / zachowaj dostęp',{exact:true}).click();
    await page.locator('#workspace-id').fill(id);await page.locator('#workspace-key').fill(key);
    await page.getByRole('button',{name:'Otwórz / odśwież',exact:true}).click();
    await page.locator('#history-list button').first().waitFor();
    assert.notEqual(await page.locator('#observed-at').inputValue(),'','Saved observation date must be restored');
    await page.locator('#history-list button').first().click();
    await page.locator('#workspace-status').filter({hasText:'Odczytano zapisany wynik'}).waitFor();
    assert.match(await page.locator('#own-route').innerText(),/582/);
    const denied=await context.request.get(`${origin}/sentinelhub/api/workspaces/${id}`);
    assert([401,403,404].includes(denied.status()));
    const operator=await context.request.post(`${origin}/sentinelhub/api/workspaces/${id}/imports`,{data:{}});
    assert.equal(operator.status(),404,'Operator route must be absent from public ingress');
    const other=await browser.newContext();
    const created=await other.request.post(`${origin}/sentinelhub/api/workspaces`,{data:{name:'Synthetic isolation check'}});
    assert.equal(created.status(),201);
    const otherOwner=await created.json();
    try {
      const foreign=await other.request.get(`${origin}/sentinelhub/api/workspaces/${id}`,{headers:{Authorization:`Bearer ${otherOwner.key}`}});
      assert.equal(foreign.status(),401,'Another workspace owner must not read this workspace');
    } finally {
      const removed=await other.request.delete(`${origin}/sentinelhub/api/workspaces/${otherOwner.id}`,{headers:{Authorization:`Bearer ${otherOwner.key}`}});
      assert.equal(removed.status(),204);await other.close();
    }
    return {detourMetres:582,history:true,reopen:true,privateAccess:true,separateVisitorIsolation:true};
  });
  await scenario('support',`${origin}/support/`,async(page)=>{
    await page.getByRole('button',{name:'HTTP 401',exact:true}).click();
    await page.locator('#route').filter({hasText:'TECH'}).waitFor();
    assert.match(await page.locator('#messages').innerText(),/X-API-Key/);
    await page.getByRole('button',{name:'Pricing',exact:true}).click();
    await page.locator('#messages').filter({hasText:'$49'}).waitFor();
    await page.getByRole('button',{name:'Sample refund',exact:true}).click();
    await page.getByRole('button',{name:'Sample email',exact:true}).click();
    await page.locator('#messages').filter({hasText:'provide a short reason'}).waitFor();
    await page.getByRole('button',{name:'Sample reason',exact:true}).click();
    await page.locator('#messages').filter({hasText:/Simulated case DEMO-/}).waitFor();
    assert.match(await page.locator('#messages').innerText(),/No email is sent/);
    return {technicalSource:true,billing:true,sampleRefund:true};
  });
  await scenario('posture',`${origin}/`,async(page,context)=>{
    await page.getByRole('button',{name:'Wejdź jako gość →',exact:true}).click();
    await page.locator('#application').waitFor({state:'visible',timeout:15000});
    await page.locator('#rgb').setInputFiles({name:'synthetic-rgb.png',mimeType:'image/png',buffer:png(false)});
    await page.locator('#depth').setInputFiles({name:'synthetic-depth.png',mimeType:'image/png',buffer:png(true)});
    await page.locator('#metadata').setInputFiles({name:'synthetic-capture.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(metadata))});
    await page.waitForFunction(()=>document.querySelector('#manual').hidden);
    await page.locator('#aligned').check();
    await page.getByRole('button',{name:'Przelicz i zapisz ujęcie →',exact:true}).click();
    await page.locator('#result-title').filter({hasText:'Ujęcie zaakceptowane'}).waitFor({timeout:30000});
    assert.match(await page.locator('#result-metrics').innerText(),/6\.00 cm/);
    const pdfPromise=page.waitForEvent('download');
    await page.getByRole('link',{name:'Raport PDF',exact:true}).click();
    const download=await pdfPromise;
    const pdf=await fs.readFile(await download.path());assert.equal(pdf.subarray(0,4).toString(),'%PDF');
    const captureUrl=await page.getByRole('link',{name:'Wynik JSON',exact:true}).getAttribute('href');
    const other=await browser.newContext();
    const denied=await other.request.get(new URL(captureUrl,origin).href);assert([401,403,404].includes(denied.status()));
    const otherState=await (await other.request.get(`${origin}/api/private/session`)).json();
    const otherGuest=await other.request.post(`${origin}/api/private/guest`,{headers:{'X-CSRF-Token':otherState.csrf}});
    assert.equal(otherGuest.status(),201);
    const foreignCapture=await other.request.get(new URL(captureUrl,origin).href);
    assert.equal(foreignCapture.status(),404,'A second guest must not read the first guest capture');
    await other.close();
    const csrf=(await (await context.request.get(`${origin}/api/private/session`)).json()).csrf;
    const ownerLogin=await context.request.post(`${origin}/api/private/login`,{headers:{'X-CSRF-Token':csrf},data:{username:'no-owner',password:'not-a-real-password'}});
    assert.equal(ownerLogin.status(),404,'Owner login is disabled on public instance');
    await page.reload();await page.locator('#history button').first().click();
    await page.locator('#result-title').waitFor();
    return {syntheticShoulderHeightCm:6,pdf:true,reload:true,privateAccess:true,separateVisitorIsolation:true,ownerLoginDisabled:true};
  });
  await scenario('posture-sample',`${origin}/lab`,async(page)=>{
    await page.getByRole('button',{name:'Uruchom analizę →',exact:true}).click();
    await page.locator('#status').filter({hasText:'Ujęcie zaakceptowane'}).waitFor();
    await page.getByLabel('Scenariusz',{exact:true}).selectOption('missing');
    await page.getByRole('button',{name:'Uruchom analizę →',exact:true}).click();
    await page.locator('#status').filter({hasText:'Ujęcie odrzucone'}).waitFor();
    return {acceptedAndRejected:true};
  });
  // Check portfolio separately; it needs no backend response of its own.
  const context=await browser.newContext();const page=await context.newPage();
  const projectsUrl=new URL('projects.html',portfolio).href;
  await page.goto(projectsUrl);
  if(process.env.GITHUB_REF_NAME==='main') {
    // Pages publication is asynchronous; wait for the already-reviewed link update.
    for(let attempt=0;attempt<18&&!await page.locator(`a[href="${origin}/sentinelhub/"]`).count();attempt++) {
      await new Promise(resolve=>setTimeout(resolve,10000));await page.reload();
    }
  }
  for(const suffix of ['/taskmesh/','/sentinelhub/','/support/','/lab']) assert(await page.locator(`a[href="${origin}${suffix}"]`).count(),`Portfolio link missing: ${suffix}`);
  await page.locator('[data-lang="pl"]').click();assert.equal(await page.locator('html').getAttribute('lang'),'pl');
  await page.locator('[data-lang="en"]').click();assert.equal(await page.locator('html').getAttribute('lang'),'en');
  await checkLayout(page,'portfolio');await context.close();
} catch(error) {errors.push(error.message);} finally {
  await browser.close();
  report.errors=errors;report.passed=errors.length===0;
  await fs.writeFile(path.join(output,'external-flows.json'),JSON.stringify(report,null,2));
}
console.log(JSON.stringify(report,null,2));
if(errors.length)process.exitCode=1;
