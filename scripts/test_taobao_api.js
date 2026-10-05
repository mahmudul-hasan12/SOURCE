const https = require('https');

function testTaobaoApi(itemId) {
  const url = `https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=%7B%22itemNumId%22%3A%22${itemId}%22%7D`;
  console.log('Testing Taobao H5 API:', url);
  
  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
    }
  }, (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      console.log('Taobao API status:', res.statusCode);
      try {
        const json = JSON.parse(d);
        console.log('Ret:', json.ret);
        if (json.data && json.data.item) {
          console.log('Title:', json.data.item.title);
          console.log('Images:', json.data.item.images);
        }
      } catch (e) {
        console.log('Response is not JSON:', d.substring(0, 300));
      }
    });
  });
}

testTaobaoApi('651982736192');
