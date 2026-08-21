#!/usr/bin/env node
// Usage: npm run new-post -- "My Post Title"
import fs from "fs";
import path from "path";

const title = process.argv.slice(2).join(" ").trim();

if (!title) {
  console.error('Usage: npm run new-post -- "My Post Title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, "")
  .trim()
  .replace(/\s+/g, "-");

const date = new Date().toISOString().slice(0, 10);
const postsDir = path.join(process.cwd(), "content", "posts");
const filePath = path.join(postsDir, `${slug}.mdx`);

if (fs.existsSync(filePath)) {
  console.error(`Post already exists: ${filePath}`);
  process.exit(1);
}

const frontmatter = `---
title: "${title}"
date: "${date}"
description: "TODO: one or two sentences summarizing this post."
tags: []
author: ""
draft: true
---

Write the post here.
`;

fs.mkdirSync(postsDir, { recursive: true });
fs.writeFileSync(filePath, frontmatter);
console.log(`Created ${path.relative(process.cwd(), filePath)}`);
