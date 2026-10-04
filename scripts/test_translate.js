const https = require('https');

function translate(text) {
  return new Promise((resolve, reject) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed[0]) {
            const translated = parsed[0].map(item => item[0]).filter(Boolean).join('');
            resolve(translated);
          } else {
            resolve(text);
          }
        } catch (e) {
          resolve(text);
        }
      });
    }).on('error', err => reject(err));
  });
}

async function run() {
  const samples = [
    "高精度重型CNC平口虎钳 6寸 精密铣床虎钳",
    "材质: 优质球墨铸铁",
    "产地: 广东东莞",
    "加工定制: 是",
    "适用机床: 铣床、加工中心",
    "表面处理: 导轨超音频淬火精密研磨，硬度强耐磨损。"
  ];

  console.log("Testing Chinese to English translation...");
  for (const s of samples) {
    const res = await translate(s);
    console.log(`[ZH] ${s}\n[EN] ${res}\n`);
  }
}

run();
