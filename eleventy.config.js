import { feedPlugin } from '@11ty/eleventy-plugin-rss';
import yaml from 'js-yaml';
import settings from './src/_data/settings.js';
import markdownIt from 'markdown-it';
import markdownItAnchor from "markdown-it-anchor";
import markdownItAttrs from "markdown-it-attrs";
import markdownItFootnote from "markdown-it-footnote";
import pluginTOC from 'eleventy-plugin-toc';
import { IdAttributePlugin } from '@11ty/eleventy'; 
import { execSync } from 'child_process';
const siteUrl = settings.url.replace(/\/$/, '');

function absoluteUrl(path = '/') {
	return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function decodeEntities(value = '') {
	return String(value)
		.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
		.replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
		.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function excerpt(content = '') {
	return decodeEntities(String(content)
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, 240));
}

function createMemoizedRenderer(renderFn) {
	const cache = new Map();
	return (content) => {
		if (cache.has(content)) return cache.get(content);
		const result = renderFn(content);
		cache.set(content, result);
		return result;
	};
}

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {

	eleventyConfig.addPlugin(feedPlugin, {
		outputPath: '/feed/feed.xml',
		stylesheet: 'pretty-atom-feed.xsl',
		collection: { name: 'archive', limit: 20 },
		metadata: {
			language: 'en',
			title: settings.title,
			subtitle: settings.tagline,
			base: siteUrl,
			author: { name: settings.author.name }
		}
	});

	const markdownLib = markdownIt({
		html: true,
		breaks: true,
		linkify: true,
		typographer: true,
	})
		.use(markdownItAttrs)
		.use(markdownItFootnote)
		.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "",
				ariaHidden: false,
			}),
			level: [1, 2, 3, 4],
			slugify: eleventyConfig.getFilter("slugify"),
		});

	const defaultImageRule = markdownLib.renderer.rules.image || ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
	markdownLib.renderer.rules.image = (tokens, idx, options, env, self) => {
		const token = tokens[idx];
		if (!token.attrGet("loading")) token.attrSet("loading", "lazy");
		if (!token.attrGet("decoding")) token.attrSet("decoding", "async");
		return defaultImageRule(tokens, idx, options, env, self);
	};

	eleventyConfig.addCollection('archive', (collectionApi) => {
		return collectionApi.getFilteredByGlob('src/content/archive/**/*.html')
			.filter((item) => item.data.feed !== false)
			.sort((a, b) => b.date - a.date);
	});

	eleventyConfig.addCollection('blog', (collectionApi) => {
		return collectionApi.getFilteredByGlob('src/content/blog/**/*.{html,md,njk}')
			.filter((item) => item.url !== '/blog/' && item.data.draft !== true)
			.sort((a, b) => b.date - a.date);
	});

	eleventyConfig.addCollection('pages', (collectionApi) => {
		return collectionApi.getFilteredByGlob('src/content/pages/**/*.{md,njk}')
			.filter((item) => item.data.draft !== true && item.data.showInPagesNav === true)
			.sort((a, b) => {
				const orderA = a.data.timelineOrder ?? 999;
				const orderB = b.data.timelineOrder ?? 999;
				return orderA - orderB || a.data.title.localeCompare(b.data.title);
			});
	});

	eleventyConfig.addCollection('timelinePages', (collectionApi) => {
		return collectionApi.getFilteredByGlob('src/content/pages/**/*.{md,njk}')
			.filter((item) => item.data.draft !== true && item.data.showInTimeline === true)
			.sort((a, b) => {
				const orderA = a.data.timelineOrder ?? 999;
				const orderB = b.data.timelineOrder ?? 999;
				return orderA - orderB || a.data.title.localeCompare(b.data.title);
			});
	});

	 eleventyConfig.on('eleventy.after', () => {
    execSync(`npx pagefind --source _site --glob "**/*.html"`, { encoding: 'utf-8' });
  });

	eleventyConfig.setLibrary("md", markdownLib);

	const renderMd = createMemoizedRenderer((content) => markdownLib.render(content || ""));
	eleventyConfig.addFilter("md", (content) => renderMd(content || ""));
	eleventyConfig.addFilter("markdownify", (content) => renderMd(content || ""));
	eleventyConfig.addFilter("markdown", (content) => markdownLib.render(content || ""));

	eleventyConfig.addPlugin(pluginTOC, {
		tags: ["h2", "h3", "h4", "h5"],
		id: "toci",
		class: "list-group",
		ul: true,
		flat: true,
		wrapper: "div",
	});

	eleventyConfig.addPlugin(IdAttributePlugin);

	eleventyConfig.addShortcode("currentBuildDate", () => new Date().toISOString());

	eleventyConfig.addPassthroughCopy("src/assets");
	eleventyConfig.addPassthroughCopy("src/css");
	eleventyConfig.addPassthroughCopy("src/js");

	eleventyConfig.addDataExtension('yml,yaml', (contents) => yaml.load(contents));

	eleventyConfig.addGlobalData('currentYear', new Date().getFullYear());
eleventyConfig.addFilter('readableDate', (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});
	eleventyConfig.addFilter('absoluteUrl', absoluteUrl);
	eleventyConfig.addFilter('fullUrl', absoluteUrl);
	eleventyConfig.addFilter('excerpt', excerpt);
	eleventyConfig.addFilter('plainText', decodeEntities);
	eleventyConfig.addFilter('dateToRfc3339', (date) => {
  if (!date) return '';
  let dt = DateTime.fromJSDate(new Date(date));
  return dt.isValid ? dt.toISO() : '';
});
	eleventyConfig.addFilter('dateToRfc822', (date) => new Date(date).toUTCString());
	eleventyConfig.addFilter('json', (value) => JSON.stringify(value));
	eleventyConfig.addFilter('limit', (array, count) => array.slice(0, count));
}

export const config = {
	dir: {
		input: "src",
		output: "_site",
		includes: "_includes",
		data: "_data"
	},
	markdownTemplateEngine: "njk",
	htmlTemplateEngine: "njk"
};