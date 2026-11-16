const { execFile } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function testUrl(url, name) {
  return new Promise((resolve, reject) => {
    execFile(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--virtual-time-budget=6000',
      '--dump-dom',
      url
    ], (err, stdout, stderr) => {
      if (err) return reject(err);
      console.log(`\n========================================`);
      console.log(`=== TEST RESULT: ${name} (${url}) ===`);
      console.log(`========================================`);
      console.log('Rendered DOM Length:', stdout.length);
      
      const isBlank = stdout.includes('<div id="root"></div>') || stdout.length < 1500;
      console.log('Is Blank Page?', isBlank ? 'FAIL (BLANK)' : 'PASS (NOT BLANK)');
      
      const hasBrand = stdout.includes('Karigar');
      console.log('Has Brand Header?', hasBrand);

      if (name === 'HOMEPAGE') {
        const hasHero = stdout.includes('17,000+ businesses') || stdout.includes('Electricians');
        console.log('Has Hero Content?', hasHero);
        const hasFooter = stdout.includes('2026 KarigarPK');
        console.log('Has 2026 Footer?', hasFooter);
      } else if (name === 'FIND_KARIGAR') {
        const hasHub = stdout.includes('Discovery Hub') || stdout.includes('Explore Areas');
        console.log('Has Discovery Hub / Mode Tabs?', hasHub);
        const hasAreasOrGrid = stdout.includes('Areas') || stdout.includes('Listings');
        console.log('Has Areas or Listings info?', hasAreasOrGrid);
      }
      
      resolve({ isBlank, length: stdout.length });
    });
  });
}

async function run() {
  try {
    const resHome = await testUrl('http://localhost:4173', 'HOMEPAGE');
    const resFind = await testUrl('http://localhost:4173/find-karigar', 'FIND_KARIGAR');
    
    if (resHome.isBlank || resFind.isBlank) {
      console.error('\n[FATAL] One or more pages rendered blank!');
      process.exit(1);
    } else {
      console.log('\n[SUCCESS] Both Homepage and /find-karigar rendered completely and successfully in Chrome without being blank!');
      process.exit(0);
    }
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
}

run();
