import * as React from 'react';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import Page from 'components/Page';
import Container from 'components/Container';
import IndexLayout from 'layouts';

interface PageTemplateProps {
  data: {
    site: {
      siteMetadata: {
        title: string;
        description: string;
        author: {
          name: string;
          url: string;
        };
      };
    };
    mdx: {
      body: string;
      excerpt: string;
      frontmatter: {
        title: string;
      };
    };
  };
}

const PageTemplate: React.FC<PageTemplateProps> = ({ data }) => (
  <IndexLayout>
    <Page>
      <Container>
        <h1>{data.mdx.frontmatter.title}</h1>
        <MDXRenderer>{data.mdx.body}</MDXRenderer>
      </Container>
    </Page>
  </IndexLayout>
);

export default PageTemplate;

export const query = graphql`
  query PageTemplateQuery($slug: String!) {
    site {
      siteMetadata {
        title
        description
        author {
          name
          url
        }
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      body
      excerpt
      frontmatter {
        title
      }
    }
  }
`;
