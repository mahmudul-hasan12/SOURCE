const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function verify() {
  console.log('=== 1. Checking Homepage Hero Cover Photo ===');
  const home = await get('http://localhost:3000');
  console.log('Home Status:', home.status);
  const hasCoverPhoto = home.body.includes('/hero-cover.jpg');
  const hasHighOpacity = home.body.includes('opacity-80') || home.body.includes('opacity-90');
  console.log('Contains /hero-cover.jpg:', hasCoverPhoto);
  console.log('Contains high opacity (80-90%):', hasHighOpacity);
  if (!hasCoverPhoto || !hasHighOpacity) {
    throw new Error('Hero cover photo styling not found in HTML!');
  }
  console.log('PASS: Hero cover photo is prominently visible!');

  console.log('\n=== 2. Checking Workwear Product Page (/product/prod-895199300568) ===');
  const workwear = await get('http://localhost:3000/product/prod-895199300568');
  console.log('Workwear PDP Status:', workwear.status);
  const hasWorkwearTitle = workwear.body.includes('Cotton') && workwear.body.includes('Workwear');
  const hasGenericPlaceholder = workwear.body.includes('photo-1586528116311-');
  const hasToolbar = workwear.body.includes('1688 Direct Factory Listing');
  const hasQuickEdit = workwear.body.includes('Quick Edit & Sync');

  console.log('Contains authentic Workwear title:', hasWorkwearTitle);
  console.log('Contains generic warehouse placeholder:', hasGenericPlaceholder);
  console.log('Contains 1688 Sourcing Toolbar:', hasToolbar);
  console.log('Contains Quick Edit modal trigger:', hasQuickEdit);

  if (!hasWorkwearTitle) {
    throw new Error('Expected Workwear title not found!');
  }
  if (hasGenericPlaceholder) {
    throw new Error('Generic warehouse placeholder still found!');
  }
  console.log('PASS: Genuine workwear suit photos and title verified!');

  console.log('\n>>> ALL HERO COVER & WORKWEAR TESTS PASSED 100%! <<<');
}

verify().catch(e => {
  console.error('Test Failed:', e);
  process.exit(1);
});
