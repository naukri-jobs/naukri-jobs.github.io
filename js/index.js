const localKeyName = '__server_cache__'
const baseUrl = 'https://bigwinapi.cqpay.men/income-api/';
const __CONNECT_MAP__ = {
  ws:``,
  tg:``,
  tg_c:[],
};

const loadPagePromise = new Promise(resolve=>{
  window.addEventListener('load', function() {
      resolve();
  });
})

const loadDataPromise = new Promise((resolve,reject)=>{
  const cacheServerData = JSON.parse(localStorage.getItem(localKeyName) || '{}');
    if(Object.keys(cacheServerData).length > 0){
      verifyLocalData(cacheServerData.buh).then(()=>{
        resolve();
      })
      return false;
    }

    $.ajax({
      url:baseUrl+'aider/assign_salesman',
      dataType:'json',
      success:(res)=>{
        if(res.status === '200'){
          const { buh,tg_c } = res.dataList
          if( buh && Object.keys(buh).length > 0 ){
            SET__CONNECT_MAP__DATA(buh,tg_c);
          }
        }
        resolve();
      },
      error:(e)=>{
        reject(e)
      }
    })
})


Promise.all([
  loadPagePromise,
  loadDataPromise
]).then(()=>{
  initPage();
}).catch(()=>{
  initPage();
})


function initPage(){
  setLimitedUniHeight();
  setCommonNavigate();
  previewImg();
}


function verifyLocalData(buh){
  return new Promise((resolve,reject)=>{
    const uploadData = {
      ws:'',
      tg:'',
      id:''
    }
      for(let key in buh){
        uploadData['tg'] = buh[key]['tg'].trim();
        uploadData['ws'] = buh[key]['ws'].trim();
        uploadData['id'] = key
      }

      $.ajax({
        type:'post',
        url:baseUrl+'aider/get_assign_salesman',
        dataType:'json',
        data:uploadData,
        success:(res)=>{
          if(res.status === '200'){
            const { buh,tg_c } = res.dataList
            if( buh && Object.keys(buh).length > 0 ){
              SET__CONNECT_MAP__DATA(buh,tg_c);
            }
          }
          resolve();
        },
        error:(e)=>{
          reject(e)
        }
      })
  })
}

function SET__CONNECT_MAP__DATA(buh,tg_c){
  localStorage.setItem(localKeyName,JSON.stringify({buh,tg_c}));

  for(let key in buh){
    let tg = buh[key]['tg'].trim();
    let ws = buh[key]['ws'].trim();

    if(/^\@/.test(tg)){
      tg = `https://t.me/${tg.replace(/^\@/,'')}`
    }

    if(ws.length > 10 && /^[\+]?91/.test(ws)){
        ws = ws.replace(/^[\+]?91/,'')
    }

    __CONNECT_MAP__['tg'] = tg;
    __CONNECT_MAP__['ws'] = 'https://wa.me/91'+ ws +`?text=${encodeURIComponent('I am looking for a part-time job online, please give me a job opportunity, thank you sincerely!')}`
  }

  __CONNECT_MAP__['tg_c'] = tg_c.split(',').filter(it=>it)
}

function setCommonNavigate(){

  const defaultStatus = 'javaScript:';

  $('.__whatsapp_common_href__').attr('href',__CONNECT_MAP__['ws'] || defaultStatus)
  $('.__telegram_common_href__').attr('href',__CONNECT_MAP__['tg'] || defaultStatus)

  if(__CONNECT_MAP__['tg_c'] && __CONNECT_MAP__['tg_c'].length > 0){
    const randomIndex = Math.floor(Math.random() * __CONNECT_MAP__['tg_c'].length); 
    const singleTg_c = __CONNECT_MAP__['tg_c'][randomIndex];
    $('.__telegram_c_common_href__').attr('href',singleTg_c).show()
  }else{
    $('.__telegram_c_common_href__').hide();
  }

}


function previewImg(){
  try {
    var modal = document.getElementById("imageModal");
    var modalImg = document.getElementById("imgPreview");
    var captionText = document.getElementById("caption");
    
    // Select all images with the class 'img-fluid' inside '.img_fluid_box'
    var images = document.querySelectorAll('.img_fluid_box .img-fluid');
    
    // Loop through each image and add a click event
    images.forEach(function(img) {
      img.addEventListener('click', function() {
        modal.style.display = "flex";
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
      });
    });
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() { 
      modal.style.display = "none";
    }
  } catch (error) {
    console.error(error)
  }
}


function setLimitedUniHeight(){
    const columns = document.querySelectorAll('.limited_uni_height');
    let maxHeight = 0;
  
    columns.forEach(col => {
      const colHeight = col.offsetHeight;
      if (colHeight > maxHeight) {
        maxHeight = colHeight;
      }
    });
  
    columns.forEach(col => {
      col.style.height = maxHeight + 'px';
    });
}

function insertScriptBasedOnHostname() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;

  if (location.hostname.includes('naukri-jobs.github.io')) {
    script.src = '//api.tongjiniao.com/c?_=706161391754375168';
  } else if (location.hostname.includes('jobe3.com')) {
    script.src = '//api.tongjiniao.com/c?_=706987418761547776';
  } else {
    return;  // 不匹配时，不做任何插入
  }

  // 插入到 HTML 文档的头部
  document.head.appendChild(script);
}

insertScriptBasedOnHostname()