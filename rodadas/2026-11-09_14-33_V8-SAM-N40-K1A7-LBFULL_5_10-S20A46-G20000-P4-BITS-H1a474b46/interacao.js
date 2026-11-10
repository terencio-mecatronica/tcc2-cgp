
const table=document.querySelector('#configs');let current=-1,ascending=true;
table.querySelectorAll('thead button').forEach(button=>button.addEventListener('click',()=>{
 const col=Number(button.dataset.col),numeric=button.dataset.kind==='number';ascending=current===col?!ascending:true;current=col;
 const rows=Array.from(table.tBodies[0].rows);rows.sort((a,b)=>{const av=a.cells[col].dataset.sort,bv=b.cells[col].dataset.sort;if(av==='')return bv===''?0:1;if(bv==='')return -1;const result=numeric?Number(av)-Number(bv):av.localeCompare(bv,'pt-BR');return ascending?result:-result;});
 rows.forEach(row=>table.tBodies[0].appendChild(row));table.querySelectorAll('th').forEach(th=>th.removeAttribute('aria-sort'));button.closest('th').setAttribute('aria-sort',ascending?'ascending':'descending');
}));
document.querySelector('#filter').addEventListener('input',event=>{const query=event.target.value.trim().toLocaleLowerCase('pt-BR');let count=0;Array.from(table.tBodies[0].rows).forEach(row=>{row.hidden=!row.textContent.toLocaleLowerCase('pt-BR').includes(query);if(!row.hidden)count++;});document.querySelector('#shown').textContent=`${count} de 381 configurações`;});

const allRuns=JSON.parse(document.querySelector('#run-data').textContent);const runTable=document.querySelector('#runs');let runPage=0,runColumn=0,runAscending=true,filteredRuns=[];
function renderRuns(){
 const q=document.querySelector('#runfilter').value.trim().toLocaleLowerCase('pt-BR'),only=document.querySelector('#onlyfunctional').checked;
 filteredRuns=allRuns.filter(r=>(!only||r[4]===70)&&r.join(' ').toLocaleLowerCase('pt-BR').includes(q));
 filteredRuns.sort((a,b)=>{let result;if(runColumn===0)result=Number(a[0].slice(1))-Number(b[0].slice(1));else if([1,4,5,6].includes(runColumn))result=a[runColumn]-b[runColumn];else result=a[runColumn].localeCompare(b[runColumn],'pt-BR');return runAscending?result:-result;});
 const pages=Math.max(1,Math.ceil(filteredRuns.length/50));runPage=Math.min(runPage,pages-1);const tbody=runTable.tBodies[0];tbody.replaceChildren();
 filteredRuns.slice(runPage*50,(runPage+1)*50).forEach(r=>{const tr=document.createElement('tr');r.forEach(v=>{const td=document.createElement('td');td.textContent=String(v);tr.appendChild(td);});tbody.appendChild(tr);});
 document.querySelector('#runstatus').textContent=`${filteredRuns.length.toLocaleString('pt-BR')} execuções · página ${runPage+1} de ${pages}`;
 document.querySelector('#prevpage').disabled=runPage===0;document.querySelector('#nextpage').disabled=runPage>=pages-1;
}
runTable.querySelectorAll('thead button').forEach(button=>button.addEventListener('click',()=>{const column=Number(button.dataset.runCol);runAscending=runColumn===column?!runAscending:true;runColumn=column;runPage=0;runTable.querySelectorAll('th').forEach(th=>th.removeAttribute('aria-sort'));button.closest('th').setAttribute('aria-sort',runAscending?'ascending':'descending');renderRuns();}));
document.querySelector('#runfilter').addEventListener('input',()=>{runPage=0;renderRuns();});document.querySelector('#onlyfunctional').addEventListener('change',()=>{runPage=0;renderRuns();});document.querySelector('#prevpage').addEventListener('click',()=>{runPage--;renderRuns();});document.querySelector('#nextpage').addEventListener('click',()=>{runPage++;renderRuns();});renderRuns();
