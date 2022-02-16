'use strict'

const path = require('path')

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  switch (node.internal.type) {
    case 'Mdx': {
      const { permalink, layout } = node.frontmatter
      const { relativePath } = getNode(node.parent)

      let slug = permalink

      if (!slug) {
        slug = `/${relativePath.replace('.md', '')}/`
      }

      // Used to generate URL to view this content.
      createNodeField({
        node,
        name: 'slug',
        value: slug || ''
      })

      // Used to determine a page layout.
      createNodeField({
        node,
        name: 'layout',
        value: layout || ''
      })
    }
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const allMarkdown = await graphql(`
    {
      allMdx(limit: 1000) {
        edges {
          node {
            fields {
              layout
              slug
            }
            frontmatter {
              title
            }
            id
            body
          }
        }
      }
    }
  `);

  if (allMarkdown.errors) {
    console.error(allMarkdown.errors)
    throw new Error(allMarkdown.errors)
  }

  allMarkdown.data.allMdx.edges.forEach(({ node }) => {
    const { slug, layout } = node.fields;

    createPage({
      path: slug,
      component: path.resolve(`./src/templates/${layout || 'page'}.tsx`),
      context: {
        slug
      }
    });
  });
}

exports.onCreateWebpackConfig = ({ getConfig, actions }) => {
  const output = getConfig().output || {};

  actions.setWebpackConfig({
    output,
    resolve: {
      alias: {
        assets: path.resolve(__dirname, 'src/assets'),
        components: path.resolve(__dirname, 'src/components'),
        styles: path.resolve(__dirname, 'src/styles'),
        layouts: path.resolve(__dirname, 'src/layouts'),
        templates: path.resolve(__dirname, 'src/templates')
      }
    }
  });
};
