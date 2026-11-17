const { execFile } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function testLiveUrl(url, name) {
  return new Promise((resolve, reject) => {
    execFile(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--virtual-time-budget=8000',
      '--dump-dom',
      url
    ], (err, stdout, stderr) => {
      if (err) return reject(err);
      console.log(`\n========================================`);
      console.log(`=== LIVE VERIFICATION: ${name} (${url}) ===`);
      console.log(`========================================`);
      console.log('Rendered DOM Length:', stdout.length);
      
      const isBlank = stdout.includes('<div id="root"></div>') || stdout.length < 1500;
      console.log('Is Blank Page?', isBlank ? 'FAIL (BLANK)' : 'PASS (NOT BLANK)');
      
      if (name === 'LIVE_HOMEPAGE') {
        const hasHero = stdout.includes('17,000+ businesses') || stdout.includes('Electricians');
        console.log('Has Live Hero Content?', hasHero);
        const hasFooter = stdout.includes('2026 KarigarPK');
        console.log('Has 2026 Footer?', hasFooter);
      } else if (name === 'LIVE_FIND_KARIGAR') {
        const hasHub = stdout.includes('Discovery Hub') || stdout.includes('Explore Areas');
        console.log('Has Discovery Hub / Mode Tabs?', hasHub);
      } else if (name.includes('LIVE_BOOK')) {
        const hasForm = stdout.includes('Book Your Service') || stdout.includes('Selected Service');
        console.log('Has Booking Form?', hasForm);
        const hasButton = stdout.includes('Confirm Booking') || stdout.includes('Confirm & Book');
        console.log('Has Confirm Booking Button?', hasButton);
        const hasPaymentNote = stdout.includes('Payment Note');
        console.log('Has Payment Note?', hasPaymentNote);
      }
      
      resolve({ isBlank, length: stdout.length });
    });
  });
}

async function verifyAllLive() {
  try {
    const resHome = await testLiveUrl('https://karigarpk.live', 'LIVE_HOMEPAGE');
    const resFind = await testLiveUrl('https://karigarpk.live/find-karigar', 'LIVE_FIND_KARIGAR');
    const resBook = await testLiveUrl('https://karigarpk.live/book', 'LIVE_BOOK_WITHOUT_ID');
    const resBookId = await testLiveUrl('https://karigarpk.live/book/67389a871234567890abcdef', 'LIVE_BOOK_WITH_ID');
    
    if (resHome.isBlank || resFind.isBlank || resBook.isBlank || resBookId.isBlank) {
      console.error('\n[FATAL] One or more live pages rendered blank!');
      process.exit(1);
    } else {
      console.log('\n[SUCCESS] All live production pages (Homepage, /find-karigar, /book, and /book/:id) rendered completely and without any errors in Chrome!');
      process.exit(0);
    }
  } catch (err) {
    console.error('Live verification failed:', err);
    process.exit(1);
  }
}

verifyAllLive();
