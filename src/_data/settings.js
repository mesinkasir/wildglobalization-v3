const siteUrl = process.env.URL || 'https://wildglobalization.com/';

export default {
	title: 'Wild Globalization',
	tagline: 'A pan-historical exploration of the five wild forces driving hyper-globalizing civilization.',
	description:
		'A pan-historical exploration of ecology, culture, technology, economy, and governance as wild forces shaping civilization.',
	url: siteUrl,
	noindex: false,
	favicon: '/assets/img/favicon-180.png',
	defaultLanguage: 'en',
	author: {
		name: 'The Wild Globalization Project',
		url: siteUrl
	},
	languages: {
		en: {
			contentDir: 'content/',
			locale: 'en',
			languageName: 'English',
			title: 'Wild Globalization',
			tagline: 'A pan-historical exploration of the five wild forces.'
		}
	},
	head: {
		link: [
			{ rel: 'stylesheet', href: '/assets/css/index.css' },
			{ rel: 'alternate', href: '/feed/feed.xml', type: 'application/atom+xml', title: 'Wild Globalization Atom Feed' },
			{ rel: 'alternate', href: '/feed/feed.rss', type: 'application/rss+xml', title: 'Wild Globalization RSS Feed' },
			{ rel: 'alternate', href: '/feed/feed.json', type: 'application/feed+json', title: 'Wild Globalization JSON Feed' }
		],
		script: [{ src: '/assets/js/index.js', defer: true }],
		meta: [
			{ name: 'color-scheme', content: 'dark' },
			{ name: 'theme-color', content: '#11151f' }
		]
	},
	seo: {
		preserveQueryParams: false,
		openGraph: { type: 'website' },
		twitter: { card: 'summary_large_image' }
	}
};
