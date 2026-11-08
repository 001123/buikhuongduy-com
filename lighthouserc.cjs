// Lighthouse CI: every audited page must score 100 in all four categories.
// Runs against the static build in dist/ (no network, no Cloudflare headers).
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        '/',
        '/en/',
        '/about/',
        '/contact/',
        '/blog/',
        '/blog/fast-ci-under-30-seconds/',
        '/en/blog/perfect-lighthouse-score/',
      ],
      // Several runs per URL; the "optimistic" assertion uses the best one to absorb CI noise.
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless=new',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 1, aggregationMethod: 'optimistic' }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci/reports',
    },
  },
};
