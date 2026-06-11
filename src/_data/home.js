export default {
	nav: [
		{ label: 'The Book', href: '#book' },
		{ label: 'About', href: '#about' },
		{ label: 'The Author', href: '#author' },
		{ label: 'Blog', href: '/blog/' },
		{
			label: 'Pages',
			href: '/pages/',
			children: [
				{ label: 'Welcome', href: '/pages/welcome/' },
				{ label: 'Opening Act', href: '/pages/opening-act/' },
				{ label: 'Wild Globalization 1.0', href: '/pages/wild-globalization-1-0/' },
				{ label: 'Wild Globalization 2.0', href: '/pages/wild-globalization-2-0/' },
				{ label: 'Wild Ecology', href: '/pages/wild-ecology/' },
				{ label: 'Wild Sex & Culture', href: '/pages/wild-sex-culture/' },
				{ label: 'Wild Tech', href: '/pages/wild-tech/' },
				{ label: 'Wild Economy', href: '/pages/wild-economy/' },
				{ label: 'Wild Governance', href: '/pages/wild-governance/' },
				{ label: 'Hints', href: '/pages/hints/' },
				{ label: 'About the Author', href: '/pages/about-the-author/' }
			]
		},
		{ label: 'Timeline', href: '/timeline/' },
		{ label: 'Archive', href: '/archive/' }
	]
};
