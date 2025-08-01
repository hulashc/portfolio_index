const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const {
  URL
} = require('url');

const assetsDir = path.join(__dirname, 'assets');
const cssDir = path.join(__dirname, 'css');
const jsDir = path.join(__dirname, 'js');

// Create directories
[assetsDir, cssDir, jsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true
    });
  }
});

// Enhanced download helper with retry mechanism and better error handling
async function downloadFile(fileUrl, filename, maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Downloading (attempt ${attempt}/${maxRetries}): ${path.basename(filename)}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const res = await fetch(fileUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Referer': 'https://cristinagomezruiz.com/',
          'Origin': 'https://cristinagomezruiz.com'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        console.log(`❌ HTTP ${res.status} for ${path.basename(filename)}: ${res.statusText}`);
        if (attempt === maxRetries) return false;
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        continue;
      }

      const dest = fs.createWriteStream(filename);
      return new Promise((resolve, reject) => {
        res.body.pipe(dest);
        res.body.on("error", (err) => {
          console.log(`❌ Stream error for ${path.basename(filename)}:`, err.message);
          reject(err);
        });
        dest.on("finish", () => {
          const stats = fs.statSync(filename);
          console.log(`✅ Downloaded: ${path.basename(filename)} (${Math.round(stats.size/1024)}KB)`);
          resolve(true);
        });
        dest.on("error", reject);
      });
    } catch (error) {
      console.log(`❌ Error downloading ${path.basename(filename)} (attempt ${attempt}):`, error.message);
      if (attempt === maxRetries) return false;
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
  return false;
}

// Improved filename sanitization
function sanitizeFilename(url, extension = '') {
  try {
    const {
      pathname,
      search
    } = new URL(url);
    let filename = pathname.split('/').pop() || 'index';

    if (!filename.includes('.') && extension) {
      filename += extension;
    }

    filename = filename.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
    filename = filename.replace(/\s+/g, '_');

    if (filename.length > 100) {
      const ext = path.extname(filename);
      const name = path.basename(filename, ext);
      filename = name.substring(0, 100 - ext.length) + ext;
    }

    if (search || filename === 'index') {
      const hash = require('crypto').createHash('md5').update(url).digest('hex').substring(0, 8);
      const ext = path.extname(filename);
      const name = path.basename(filename, ext);
      filename = `${name}_${hash}${ext}`;
    }

    return filename;
  } catch (error) {
    const hash = require('crypto').createHash('md5').update(url).digest('hex').substring(0, 12);
    return `file_${hash}${extension}`;
  }
}

// Progress tracking
function createProgressTracker(total) {
  let completed = 0;
  return {
    update: (success = true) => {
      completed++;
      const percentage = Math.round((completed / total) * 100);
      const status = success ? '✅' : '❌';
      console.log(`📊 Progress: ${completed}/${total} (${percentage}%) ${status}`);
    },
    getCompleted: () => completed
  };
}

// Enhanced wait for page to fully load
async function waitForPageLoad(page, maxWaitTime = 30000) {
  console.log('⏳ Waiting for page to fully load...');

  // Wait for basic DOM
  try {
    await page.waitForSelector('body', {
      timeout: 10000
    });
    console.log('✅ Basic DOM loaded');
  } catch (error) {
    console.log('⚠️ Basic DOM timeout');
  }

  // Wait for loading indicators to disappear
  const loadingSelectors = [
    '.loading',
    '.loader',
    '.spinner',
    '.preloader',
    '[class*="loading"]',
    '[class*="loader"]',
    '[id*="loading"]',
    '[id*="loader"]'
  ];

  for (const selector of loadingSelectors) {
    try {
      await page.waitForSelector(selector, {
        timeout: 2000
      });
      console.log(`🔄 Found loading indicator: ${selector}`);
      await page.waitForSelector(selector, {
        hidden: true,
        timeout: maxWaitTime
      });
      console.log(`✅ Loading indicator hidden: ${selector}`);
      break;
    } catch (error) {
      // Loading indicator not found or didn't hide, continue
    }
  }

  // Wait for content selectors that indicate the main content has loaded
  const contentSelectors = [
    'main',
    '[role="main"]',
    '.main-content',
    '.content',
    'article',
    'section',
    '.page-content',
    '#content'
  ];

  for (const selector of contentSelectors) {
    try {
      await page.waitForSelector(selector, {
        timeout: 5000
      });
      console.log(`✅ Found main content: ${selector}`);
      break;
    } catch (error) {
      // Content selector not found, continue
    }
  }

  // Wait for images to load
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll('img'));
    await Promise.allSettled(
      images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve); // Don't fail on broken images
          setTimeout(resolve, 5000); // Don't wait forever
        });
      })
    );
  });

  // Additional wait for any remaining async operations
  await new Promise(resolve => setTimeout(resolve, 3000));
  console.log('✅ Page loading complete');
}

// Check if page has proper structure
async function validatePageStructure(page) {
  const structure = await page.evaluate(() => {
    const body = document.body;
    const hasContent = body && body.children.length > 0;
    const hasText = body && body.innerText.trim().length > 100;
    const hasImages = document.querySelectorAll('img').length > 0;
    const hasStyles = document.querySelectorAll('style, link[rel="stylesheet"]').length > 0;

    return {
      hasContent,
      hasText,
      hasImages,
      hasStyles,
      bodyChildren: body ? body.children.length : 0,
      textLength: body ? body.innerText.trim().length : 0
    };
  });

  console.log(`📊 Page structure validation:
  - Body children: ${structure.bodyChildren}
  - Text length: ${structure.textLength}
  - Has images: ${structure.hasImages}
  - Has styles: ${structure.hasStyles}`);

  return structure.hasContent && structure.hasText && structure.textLength > 500;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const url = 'https://cristinagomezruiz.com/';

  console.log('🚀 Starting enhanced website scraper...');
  console.log('📋 Target:', url);

  const browser = await puppeteer.launch({
    headless: false, // Changed to false for debugging
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const page = await browser.newPage();

  // Set realistic browser conditions
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
  await page.setViewport({
    width: 1366,
    height: 768
  });
  await page.setDefaultNavigationTimeout(120000);

  // Enable request interception to track all resources
  await page.setRequestInterception(true);
  const resourceUrls = new Set();
  const failedRequests = new Set();

  page.on('request', (request) => {
    const resourceUrl = request.url();
    resourceUrls.add(resourceUrl);
    request.continue();
  });

  page.on('requestfailed', (request) => {
    failedRequests.add(request.url());
    console.log(`⚠️ Request failed: ${request.url()}`);
  });

  // Listen for console logs to debug JavaScript issues
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('🐛 Browser error:', msg.text());
    }
  });

  console.log(`🌐 Navigating to ${url}...`);

  try {
    await page.goto(url, {
      waitUntil: ['domcontentloaded'],
      timeout: 120000
    });
    console.log('✅ Initial navigation completed');
  } catch (error) {
    console.log('❌ Navigation failed:', error.message);
    await browser.close();
    return;
  }

  // Enhanced waiting for the page to fully load
  await waitForPageLoad(page, 45000);

  // Progressive loading with scrolling to trigger lazy loading
  console.log('📜 Triggering lazy loading with scroll...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 150;
      let scrollCount = 0;
      const maxScrolls = 40;

      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        scrollCount++;

        if (totalHeight >= scrollHeight || scrollCount >= maxScrolls) {
          clearInterval(timer);
          window.scrollTo(0, 0); // Scroll back to top
          resolve();
        }
      }, 300);
    });
  });

  // Wait after scrolling
  await sleep(5000);

  // Additional network idle wait
  try {
    await page.waitForLoadState('networkidle', {
      timeout: 15000
    });
  } catch (error) {
    console.log('⚠️ Network idle timeout, continuing...');
  }

  // Validate page structure
  const isValid = await validatePageStructure(page);
  if (!isValid) {
    console.log('⚠️ Page structure seems incomplete. Waiting longer...');
    await sleep(10000);

    // Try one more validation
    const isValidSecond = await validatePageStructure(page);
    if (!isValidSecond) {
      console.log('❌ Page structure still incomplete. Proceeding anyway...');
    }
  }

  console.log(`📦 Found ${resourceUrls.size} total requests`);
  if (failedRequests.size > 0) {
    console.log(`⚠️ ${failedRequests.size} requests failed during page load`);
  }

  // Enhanced asset extraction (keeping your existing logic)
  const assets = await page.evaluate(() => {
    const result = {
      images: [],
      videos: [],
      css: [],
      js: [],
      fonts: []
    };

    // Images - including srcset and data-src (lazy loading)
    document.querySelectorAll('img').forEach(img => {
      if (img.src && !img.src.startsWith('data:') && img.src !== window.location.href) {
        result.images.push(img.src);
      }
      if (img.dataset.src && !img.dataset.src.startsWith('data:')) {
        result.images.push(img.dataset.src);
      }
      // Handle srcset
      if (img.srcset) {
        const srcsetUrls = img.srcset.split(',').map(src => src.trim().split(' ')[0]);
        srcsetUrls.forEach(url => {
          if (url && !url.startsWith('data:') && url !== window.location.href) {
            result.images.push(url);
          }
        });
      }
    });

    // Background images from computed styles
    document.querySelectorAll('div, section, header, main, article, aside').forEach(el => {
      const style = window.getComputedStyle(el);
      const bgImage = style.backgroundImage;
      if (bgImage && bgImage !== 'none') {
        const matches = bgImage.match(/url\(['"']?([^'"]+)['"']?\)/);
        if (matches && !matches[1].startsWith('data:')) {
          try {
            const fullUrl = new URL(matches[1], window.location.href).href;
            result.images.push(fullUrl);
          } catch (e) {
            // Invalid URL
          }
        }
      }
    });

    // Videos and audio
    document.querySelectorAll('video, audio, source').forEach(media => {
      if (media.src && !media.src.startsWith('data:')) {
        result.videos.push(media.src);
      }
      if (media.dataset.src && !media.dataset.src.startsWith('data:')) {
        result.videos.push(media.dataset.src);
      }
    });

    // CSS
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      if (link.href) {
        result.css.push(link.href);
      }
    });

    // JavaScript
    document.querySelectorAll('script[src]').forEach(script => {
      if (script.src) {
        result.js.push(script.src);
      }
    });

    // Fonts from CSS
    const stylesheets = Array.from(document.styleSheets);
    stylesheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules || []);
        rules.forEach(rule => {
          const cssText = rule.cssText || (rule.style && rule.style.cssText);
          if (cssText) {
            const fontMatches = cssText.match(/url\(['"']?([^'"]+?\.(woff2?|ttf|otf|eot))['"']?\)/gi);
            if (fontMatches) {
              fontMatches.forEach(match => {
                const url = match.replace(/url\(['"']?(.+?)['"']?\)/i, '$1');
                if (!url.startsWith('data:')) {
                  try {
                    result.fonts.push(new URL(url, window.location.href).href);
                  } catch (e) {
                    // Invalid URL, skip
                  }
                }
              });
            }
          }
        });
      } catch (e) {
        // Cross-origin stylesheets may not be readable
      }
    });

    // Remove duplicates
    Object.keys(result).forEach(key => {
      result[key] = [...new Set(result[key])];
    });

    return result;
  });

  // Add resources from network requests (keeping your existing logic)
  Array.from(resourceUrls).forEach(resourceUrl => {
    try {
      const url = new URL(resourceUrl);
      const pathname = url.pathname.toLowerCase();

      if (pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|avif|bmp|tiff)$/)) {
        if (!assets.images.includes(resourceUrl)) assets.images.push(resourceUrl);
      } else if (pathname.match(/\.(mp4|webm|ogg|mov|avi|flv|wmv|m4v|3gp)$/)) {
        if (!assets.videos.includes(resourceUrl)) assets.videos.push(resourceUrl);
      } else if (pathname.match(/\.css$/)) {
        if (!assets.css.includes(resourceUrl)) assets.css.push(resourceUrl);
      } else if (pathname.match(/\.(js|mjs)$/)) {
        if (!assets.js.includes(resourceUrl)) assets.js.push(resourceUrl);
      } else if (pathname.match(/\.(woff2?|ttf|otf|eot)$/)) {
        if (!assets.fonts.includes(resourceUrl)) assets.fonts.push(resourceUrl);
      }
    } catch (e) {
      // Invalid URL, skip
    }
  });

  const totalAssets = assets.images.length + assets.videos.length +
    assets.css.length + assets.js.length + assets.fonts.length;

  console.log(`\n📊 Asset breakdown:
  - Images: ${assets.images.length}
  - Videos: ${assets.videos.length}  
  - CSS: ${assets.css.length}
  - JavaScript: ${assets.js.length}
  - Fonts: ${assets.fonts.length}
  - Total: ${totalAssets}\n`);

  if (totalAssets === 0) {
    console.log('⚠️ No assets found. The page might be heavily protected or use unusual loading methods.');
  }

  // Download assets with progress tracking (keeping your existing download logic)
  const urlToLocalMap = {};
  const progress = createProgressTracker(totalAssets);
  let successCount = 0;

  console.log('📥 Starting asset downloads...\n');

  // Download images
  console.log(`🖼️  Downloading ${assets.images.length} images...`);
  for (const imageUrl of assets.images) {
    const filename = sanitizeFilename(imageUrl);
    const localPath = path.join(assetsDir, filename);
    const success = await downloadFile(imageUrl, localPath);
    if (success) {
      urlToLocalMap[imageUrl] = './assets/' + filename;
      successCount++;
    }
    progress.update(success);
    await sleep(100);
  }

  // Download videos
  console.log(`\n🎥 Downloading ${assets.videos.length} videos...`);
  for (const videoUrl of assets.videos) {
    const filename = sanitizeFilename(videoUrl);
    const localPath = path.join(assetsDir, filename);
    const success = await downloadFile(videoUrl, localPath);
    if (success) {
      urlToLocalMap[videoUrl] = './assets/' + filename;
      successCount++;
    }
    progress.update(success);
    await sleep(200);
  }

  // Download CSS
  console.log(`\n🎨 Downloading ${assets.css.length} stylesheets...`);
  for (const cssUrl of assets.css) {
    const filename = sanitizeFilename(cssUrl, '.css');
    const localPath = path.join(cssDir, filename);
    const success = await downloadFile(cssUrl, localPath);
    if (success) {
      urlToLocalMap[cssUrl] = './css/' + filename;
      successCount++;
    }
    progress.update(success);
    await sleep(100);
  }

  // Download JavaScript
  console.log(`\n⚙️  Downloading ${assets.js.length} scripts...`);
  for (const jsUrl of assets.js) {
    const filename = sanitizeFilename(jsUrl, '.js');
    const localPath = path.join(jsDir, filename);
    const success = await downloadFile(jsUrl, localPath);
    if (success) {
      urlToLocalMap[jsUrl] = './js/' + filename;
      successCount++;
    }
    progress.update(success);
    await sleep(100);
  }

  // Download fonts
  console.log(`\n🔤 Downloading ${assets.fonts.length} fonts...`);
  for (const fontUrl of assets.fonts) {
    const filename = sanitizeFilename(fontUrl);
    const localPath = path.join(assetsDir, filename);
    const success = await downloadFile(fontUrl, localPath);
    if (success) {
      urlToLocalMap[fontUrl] = './assets/' + filename;
      successCount++;
    }
    progress.update(success);
    await sleep(100);
  }

  console.log(`\n✅ Asset downloads completed!`);
  console.log(`📊 Success rate: ${successCount}/${totalAssets} (${Math.round((successCount/totalAssets)*100)}%)\n`);

  // Get the final HTML after all JavaScript has executed
  console.log('🔄 Processing HTML and replacing URLs...');
  let html = await page.content();

  // Enhanced URL replacement (keeping your existing logic)
  let replacementCount = 0;
  for (const [remoteUrl, localPath] of Object.entries(urlToLocalMap)) {
    const beforeCount = (html.match(new RegExp(remoteUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    const encodedUrl = encodeURI(remoteUrl);
    html = html.replaceAll(remoteUrl, localPath);
    html = html.replaceAll(encodedUrl, localPath);

    if (beforeCount > 0) {
      replacementCount += beforeCount;
      console.log(`🔄 Replaced ${beforeCount} occurrences of ${path.basename(localPath)}`);
    }
  }

  // Enhanced CSS url() replacement
  html = html.replace(/url\(['"']?(https?:\/\/[^'")\s]+)['"']?\)/gi, (match, url) => {
    if (urlToLocalMap[url]) {
      return match.replace(url, urlToLocalMap[url]);
    }
    return match;
  });

  console.log(`✅ Made ${replacementCount} URL replacements`);

  // Clean up problematic scripts - be more selective
  html = html.replace(/<script[^>]*>[\s\S]*?(?:analytics|tracking|gtag|fbq|_gaq)[\s\S]*?<\/script>/gi, '');

  // Add offline-friendly modifications
  const headInsert = `
  <base href="./">
  <meta name="robots" content="noindex, nofollow">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Offline copy generated on ${new Date().toISOString()} -->
  <style>
  /* Ensure offline functionality */
  [data-src] { opacity: 1 !important; }
  .loading, .loader { display: none !important; }
  </style>`;

  html = html.replace('<head>', '<head>' + headInsert);

  // Write the final HTML
  const outputFile = 'cristina-gomez-ruiz-offline.html';
  fs.writeFileSync(outputFile, html);
  console.log(`✅ Offline HTML saved as ${outputFile} (${Math.round(html.length/1024)}KB)`);

  // Take screenshots
  console.log('📸 Taking screenshots...');
  await page.screenshot({
    path: 'screenshot-desktop.png',
    fullPage: true,
    quality: 90
  });

  await page.setViewport({
    width: 375,
    height: 667
  });
  await page.screenshot({
    path: 'screenshot-mobile.png',
    fullPage: true,
    quality: 90
  });
  console.log('✅ Screenshots saved');

  await browser.close();

  console.log(`
🎉 Enhanced scraping complete! 
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Files created:
   ✓ ${outputFile} (main HTML file)
   ✓ assets/ (${assets.images.length + assets.videos.length + assets.fonts.length} files)
   ✓ css/ (${assets.css.length} stylesheets)  
   ✓ js/ (${assets.js.length} scripts)
   
🔧 Key improvements:
   • Better loading animation detection
   • Enhanced page structure validation  
   • Improved JavaScript execution waiting
   • More selective script cleaning
   
📊 Results: ${successCount}/${totalAssets} assets downloaded
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);

})().catch(error => {
  console.error('💥 Fatal error:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});